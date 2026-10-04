"use client";

import { ArrowRight, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { NeuralCore } from "@/components/ui/neural-core";
import { heroSuggestions } from "@/data/content";
import { useChat } from "@/hooks/use-chat";
import { useStickToBottom } from "@/hooks/use-stick-to-bottom";
import { useTypewriter } from "@/hooks/use-typewriter";
import { conversationStore, deriveTitle } from "@/lib/chat/storage";
import { createId } from "@/lib/utils/cn";
import type { ChatMessage, IntelligenceMode } from "@/types";
import { BrainStatusIndicator, ModeBadge } from "./brain-status";
import { ChatInput } from "./chat-input";
import { ChatThread } from "./chat-thread";
import { PromptSuggestions } from "./prompt-suggestions";

const PLACEHOLDERS = [
  "Pregúntame cómo aplicar IA a tu negocio…",
  "Tenemos 400 tickets de soporte al mes…",
  "Nuestro equipo pierde horas en reportes…",
  "Quiero un agente que califique leads…",
];

/**
 * Compact TRIAL Brain for the hero. Conversations are saved so they can be
 * continued in the full /intelligence workspace.
 */
export function TrialBrain({ initialMode }: { initialMode: IntelligenceMode }) {
  const router = useRouter();
  const conversationId = useRef<string | null>(null);
  const [focused, setFocused] = useState(false);

  const persist = useCallback((messages: ChatMessage[]) => {
    if (!messages.length) return;
    conversationId.current ??= createId();
    conversationStore.save({
      id: conversationId.current,
      title: deriveTitle(messages),
      messages,
      updatedAt: Date.now(),
    });
  }, []);

  const chat = useChat({ initialMode, onMessagesChange: persist });
  const { ref, onScroll, pin } = useStickToBottom<HTMLDivElement>(chat.messages);
  const placeholder = useTypewriter(PLACEHOLDERS, { paused: focused || chat.input.length > 0 || chat.messages.length > 0 });

  const hasConversation = chat.messages.length > 0;

  const send = (text?: string) => {
    pin();
    chat.send(text);
  };

  const continueInWorkspace = () => {
    persist(chat.messages);
    router.push(conversationId.current ? `/intelligence?c=${conversationId.current}` : "/intelligence");
  };

  const restart = () => {
    conversationId.current = null;
    chat.reset();
  };

  return (
    <div
      className="relative w-full rounded-[22px] border border-line bg-surface/90 shadow-lift backdrop-blur-sm"
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <NeuralCore size="sm" active={chat.busy} />
          <span className="font-mono text-[12px] font-medium tracking-[0.2em] text-ink">TRIAL BRAIN</span>
          <span aria-hidden className="hidden h-3 w-px bg-line-strong sm:block" />
          <BrainStatusIndicator status={chat.status} className="hidden sm:inline-flex" />
        </div>
        <ModeBadge mode={chat.mode} />
      </div>

      {/* Body */}
      <div className="px-4 pt-5 sm:px-6 sm:pt-6">
        {hasConversation ? (
          <div ref={ref} onScroll={onScroll} className="scroll-quiet -mx-1 max-h-[46vh] min-h-[180px] overflow-y-auto px-1 pb-4 sm:max-h-[420px]">
            <ChatThread messages={chat.messages} status={chat.status} errorMessage={chat.errorMessage} onRetry={chat.retry} />
          </div>
        ) : (
          <div className="pb-5">
            <h2 className="editorial text-[1.75rem] text-ink sm:text-[2rem]">¿Qué quieres transformar?</h2>
            <p className="mt-1.5 text-sm text-ink-3">Describe un proceso, un equipo o un problema. Te respondo con un diagnóstico.</p>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-3 pb-3 sm:px-4 sm:pb-4">
        <ChatInput
          value={chat.input}
          onChange={chat.setInput}
          onSubmit={() => send()}
          onStop={chat.stop}
          busy={chat.busy}
          placeholder={hasConversation ? "Continúa la conversación…" : placeholder || " "}
          footer={<span className="hidden sm:inline">Enter para enviar · Shift + Enter para nueva línea</span>}
        />
      </div>

      {/* Footer: suggestions or continuation */}
      <div className="border-t border-line px-4 py-4 sm:px-5">
        {hasConversation ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={restart}
              disabled={chat.busy}
              className="inline-flex items-center gap-1.5 text-[13px] text-ink-3 transition-colors hover:text-ink disabled:opacity-50"
            >
              <RotateCcw className="size-3.5" /> Nueva consulta
            </button>
            <button
              type="button"
              onClick={continueInWorkspace}
              disabled={chat.busy}
              className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-ink transition-colors hover:text-accent disabled:opacity-50"
            >
              Continuar en Intelligence
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        ) : (
          <PromptSuggestions suggestions={heroSuggestions} onSelect={(p) => send(p)} disabled={chat.busy} />
        )}
      </div>
    </div>
  );
}
