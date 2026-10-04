"use client";

import { MessageSquare, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { Conversation, IntelligenceMode } from "@/types";

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  mode: IntelligenceMode;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onClose?: () => void;
  className?: string;
}

const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

function relativeTime(ts: number) {
  const diff = (ts - Date.now()) / 1000;
  const abs = Math.abs(diff);
  if (abs < 60) return "ahora";
  if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), "hour");
  return rtf.format(Math.round(diff / 86400), "day");
}

export function ConversationSidebar({ conversations, activeId, mode, onSelect, onNew, onDelete, onClose, className }: ConversationSidebarProps) {
  return (
    <aside aria-label="Historial de conversaciones" className={cn("flex h-full flex-col bg-bg", className)}>
      <div className="flex items-center gap-2 p-3">
        <button
          type="button"
          onClick={onNew}
          className="inline-flex h-10 flex-1 items-center gap-2 rounded-xl border border-line-strong bg-surface px-3.5 text-sm font-medium text-ink transition-colors hover:bg-surface-2"
        >
          <Plus className="size-4" /> Nueva conversación
        </button>
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Cerrar historial" className="inline-flex size-10 items-center justify-center rounded-xl text-ink-2 hover:bg-surface-2">
            <X className="size-4" />
          </button>
        )}
      </div>

      <p className="eyebrow px-5 pt-4 pb-2">Historial</p>
      <div className="scroll-quiet flex-1 overflow-y-auto px-2 pb-4">
        {conversations.length === 0 ? (
          <div className="mx-3 mt-2 rounded-xl border border-dashed border-line p-4 text-[13px] leading-relaxed text-ink-3">
            Tus conversaciones aparecerán aquí. Se guardan solo en este dispositivo.
          </div>
        ) : (
          <ul className="space-y-0.5">
            {conversations.map((c) => (
              <li key={c.id} className="group relative">
                <button
                  type="button"
                  onClick={() => onSelect(c.id)}
                  aria-current={c.id === activeId ? "true" : undefined}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-lg px-3 py-2.5 pr-9 text-left transition-colors hover:bg-surface-2",
                    c.id === activeId && "bg-surface-2",
                  )}
                >
                  <MessageSquare aria-hidden className="mt-0.5 size-3.5 shrink-0 text-ink-3" />
                  <span className="min-w-0">
                    <span className="block truncate text-[13.5px] text-ink">{c.title}</span>
                    <span className="block text-[11px] text-ink-3" suppressHydrationWarning>{relativeTime(c.updatedAt)}</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(c.id)}
                  aria-label={`Eliminar conversación: ${c.title}`}
                  className="absolute top-2 right-1.5 inline-flex size-7 items-center justify-center rounded-md text-ink-3 opacity-100 transition-opacity hover:bg-surface-3 hover:text-danger focus-visible:opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-line p-4">
        <div className="rounded-xl bg-surface-2 p-4">
          <p className="eyebrow mb-2">{mode === "demo" ? "Demo Intelligence" : "Live Intelligence"}</p>
          <p className="text-[12.5px] leading-relaxed text-ink-2">
            {mode === "demo"
              ? "Respuestas curadas para explorar la experiencia de TRIAL Brain."
              : "Conectado a un modelo de lenguaje en tiempo real."}
          </p>
          <Link href="/contact" className="mt-3 inline-block text-[12.5px] font-medium text-ink underline-offset-4 hover:underline">
            Hablar con un estratega →
          </Link>
        </div>
      </div>
    </aside>
  );
}
