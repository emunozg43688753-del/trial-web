"use client";

import { History, Plus } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { NeuralCore } from "@/components/ui/neural-core";
import { recommendedPrompts } from "@/data/content";
import { useChat } from "@/hooks/use-chat";
import { useChatGate } from "@/hooks/use-chat-gate";
import { useStickToBottom } from "@/hooks/use-stick-to-bottom";
import { conversationStore, deriveTitle } from "@/lib/chat/storage";
import { createId } from "@/lib/utils/cn";
import type { ChatMessage, IntelligenceMode } from "@/types";
import { BrainStatusIndicator, ModeBadge } from "./brain-status";
import { ChatInput } from "./chat-input";
import { ChatThread } from "./chat-thread";
import { ConversationSidebar } from "./conversation-sidebar";
import { RegisterNudge } from "./register-nudge";

interface IntelligenceWorkspaceProps {
  initialMode: IntelligenceMode;
  initialConversationId?: string;
  initialPrompt?: string;
}

export function IntelligenceWorkspace({ initialMode, initialConversationId, initialPrompt }: IntelligenceWorkspaceProps) {
  const conversations = useSyncExternalStore(
    conversationStore.subscribe,
    conversationStore.getSnapshot,
    conversationStore.getServerSnapshot,
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const persist = useCallback((messages: ChatMessage[]) => {
    if (!messages.length) return;
    if (!activeIdRef.current) {
      activeIdRef.current = createId();
      setActiveId(activeIdRef.current);
    }
    conversationStore.save({
      id: activeIdRef.current,
      title: deriveTitle(messages),
      messages,
      updatedAt: Date.now(),
    });
  }, []);

  const chat = useChat({ initialMode, onMessagesChange: persist });
  const { ref, onScroll, pin } = useStickToBottom<HTMLDivElement>(chat.messages);
  const { reset, send } = chat;

  const select = useCallback(
    (id: string) => {
      const conversation = conversationStore.get(id);
      if (!conversation) return;
      activeIdRef.current = id;
      setActiveId(id);
      pin();
      reset(conversation.messages);
      setDrawerOpen(false);
    },
    [pin, reset],
  );

  const startNew = useCallback(() => {
    activeIdRef.current = null;
    setActiveId(null);
    reset();
    setDrawerOpen(false);
  }, [reset]);

  const remove = (id: string) => {
    conversationStore.remove(id);
    if (id === activeIdRef.current) startNew();
  };

  // Deep links: ?c=<id> continues a conversation, ?q=<prompt> starts one.
  const bootstrapped = useRef(false);
  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    if (initialConversationId && conversationStore.get(initialConversationId)) {
      // One-time hydration from browser storage, which is unavailable during SSR.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      select(initialConversationId);
    } else if (initialPrompt) {
      send(initialPrompt);
    }
    if (initialConversationId || initialPrompt) window.history.replaceState(null, "", "/intelligence");
  }, [initialConversationId, initialPrompt, select, send]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  const gate = useChatGate();
  const answers = chat.messages.filter((m) => m.role === "assistant" && m.content).length;
  const nudge = gate.gated ? "gate" : gate.anonymous && answers >= 1 ? "soft" : null;

  const submit = (text?: string) => {
    if (!(text ?? chat.input).trim() || !gate.allow()) return;
    pin();
    chat.send(text);
  };

  const empty = chat.messages.length === 0;
  const sidebarProps = { conversations, activeId, mode: chat.mode, onSelect: select, onNew: startNew, onDelete: remove };

  return (
    <div className="flex h-[100dvh] pt-16">
      {/* Desktop sidebar */}
      <ConversationSidebar {...sidebarProps} className="hidden w-[280px] shrink-0 border-r border-line lg:flex" />

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Historial">
          <button type="button" aria-label="Cerrar" className="absolute inset-0 bg-ink/30 animate-fade-in" onClick={() => setDrawerOpen(false)} />
          <ConversationSidebar {...sidebarProps} onClose={() => setDrawerOpen(false)} className="relative w-[86%] max-w-[320px] shadow-lift animate-fade-in" />
        </div>
      )}

      <section aria-label="TRIAL Intelligence" className="flex min-w-0 flex-1 flex-col">
        {/* Toolbar */}
        <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-line px-3 sm:px-5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Abrir historial"
              className="inline-flex size-9 items-center justify-center rounded-lg text-ink-2 hover:bg-surface-2 lg:hidden"
            >
              <History className="size-4" />
            </button>
            <h1 className="font-mono text-[12px] font-medium tracking-[0.2em] text-ink"><span className="hidden sm:inline">TRIAL </span>INTELLIGENCE</h1>
            <span aria-hidden className="mx-1 hidden h-3 w-px bg-line-strong sm:block" />
            <BrainStatusIndicator status={chat.status} className="hidden sm:inline-flex" />
          </div>
          <div className="flex items-center gap-2">
            <ModeBadge mode={chat.mode} />
            <button
              type="button"
              onClick={startNew}
              aria-label="Nueva conversación"
              className="inline-flex size-9 items-center justify-center rounded-lg text-ink-2 hover:bg-surface-2 lg:hidden"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        {/* Thread */}
        <div ref={ref} onScroll={onScroll} className="scroll-quiet flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
            {empty ? (
              <>
                {gate.gated && (
                  <div className="mb-10">
                    <RegisterNudge variant="gate" />
                  </div>
                )}
                <EmptyState onSelect={submit} disabled={chat.busy} />
              </>
            ) : (
              <ChatThread messages={chat.messages} status={chat.status} errorMessage={chat.errorMessage} onRetry={chat.retry} nudge={nudge} />
            )}
          </div>
        </div>

        {/* Composer */}
        <div className="shrink-0 bg-gradient-to-t from-bg via-bg to-bg/0 px-3 pb-4 sm:px-6 sm:pb-6">
          <div className="mx-auto w-full max-w-3xl">
            <ChatInput
              value={chat.input}
              onChange={chat.setInput}
              onSubmit={() => submit()}
              onStop={chat.stop}
              busy={chat.busy}
              size="lg"
              autoFocus
              placeholder={empty ? "Describe tu empresa, un proceso o un problema…" : "Responde o profundiza…"}
              footer={<span>TRIAL Brain puede cometer errores. Valida decisiones críticas con tu equipo.</span>}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function EmptyState({ onSelect, disabled }: { onSelect: (prompt: string) => void; disabled: boolean }) {
  return (
    <div className="flex flex-col items-center text-center">
      <NeuralCore className="size-12 animate-fade-in" />
      <h2 className="editorial mt-8 max-w-xl text-balance text-4xl text-ink animate-fade-up sm:text-5xl">
        ¿Qué podrías hacer con una capa de inteligencia trabajando contigo?
      </h2>
      <p className="mt-4 max-w-md text-[15px] text-ink-3 animate-fade-up [animation-delay:60ms]">
        Un estratega de IA disponible para diagnosticar procesos, diseñar agentes y planificar la implementación.
      </p>

      <div className="mt-12 grid w-full gap-3 text-left sm:grid-cols-3">
        {recommendedPrompts.map((group, gi) => (
          <div key={group.category} className="animate-fade-up" style={{ animationDelay: `${120 + gi * 60}ms` }}>
            <p className="eyebrow mb-2.5 px-1">{group.category}</p>
            <ul className="space-y-2">
              {group.prompts.map((p) => (
                <li key={p.label}>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onSelect(p.prompt)}
                    className="w-full rounded-xl border border-line bg-surface p-3.5 text-left transition-all duration-200 hover:-translate-y-px hover:border-accent-line hover:shadow-soft disabled:opacity-50"
                  >
                    <span className="block text-[13.5px] font-medium text-ink">{p.label}</span>
                    <span className="mt-1 line-clamp-2 block text-[12.5px] leading-snug text-ink-3">{p.prompt}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
