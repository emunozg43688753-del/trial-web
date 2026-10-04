"use client";

import { Check, Copy } from "lucide-react";
import { memo, useState } from "react";
import { NeuralCore } from "@/components/ui/neural-core";
import { cn } from "@/lib/utils/cn";
import type { ChatMessage as ChatMessageType } from "@/types";
import { Markdown } from "./markdown";

interface ChatMessageProps {
  message: ChatMessageType;
  streaming?: boolean;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          /* clipboard unavailable */
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
      aria-label="Copiar respuesta"
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}

export const ChatMessage = memo(function ChatMessage({ message, streaming }: ChatMessageProps) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end animate-fade-up">
        <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-surface-2 px-4 py-3 text-[15px] leading-relaxed text-ink">
          {message.content}
        </p>
      </div>
    );
  }

  return (
    <article aria-label="Respuesta de TRIAL Brain" className="group flex gap-3.5 animate-fade-in">
      <NeuralCore size="sm" active={streaming} className="mt-0.5" />
      <div className="min-w-0 flex-1">
        <div className={cn(streaming && "[&>div>*:last-child]:caret")}>
          <Markdown content={message.content} />
        </div>
        {!streaming && message.content && (
          <div className="mt-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
            <CopyButton text={message.content} />
          </div>
        )}
      </div>
    </article>
  );
});

export function ThinkingMessage() {
  return (
    <div className="flex items-center gap-3.5 animate-fade-in" aria-live="polite">
      <NeuralCore size="sm" active />
      <span className="shimmer-text text-[15px]">Analizando tu contexto…</span>
    </div>
  );
}
