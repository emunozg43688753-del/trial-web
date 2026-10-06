"use client";

import { RotateCcw } from "lucide-react";
import type { BrainStatus, ChatMessage as ChatMessageType } from "@/types";
import { ChatMessage, ThinkingMessage } from "./chat-message";
import { RegisterNudge } from "./register-nudge";

interface ChatThreadProps {
  messages: ChatMessageType[];
  status: BrainStatus;
  errorMessage: string | null;
  onRetry: () => void;
  /** Conversion card shown after the thread (anonymous visitors only). */
  nudge?: "soft" | "gate" | null;
}

/** Renders the message list plus loading and error states. Shared by the hero brain and /intelligence. */
export function ChatThread({ messages, status, errorMessage, onRetry, nudge }: ChatThreadProps) {
  const lastId = messages[messages.length - 1]?.id;
  return (
    <div className="flex flex-col gap-7" aria-live="off">
      {messages.map((m) => (
        <ChatMessage key={m.id} message={m} streaming={status === "streaming" && m.id === lastId} />
      ))}
      {status === "loading" && <ThinkingMessage />}
      {status === "error" && (
        <div role="alert" className="flex flex-col gap-3 rounded-xl border border-line bg-surface-2/60 p-4 text-sm text-ink-2 sm:flex-row sm:items-center sm:justify-between">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 self-start rounded-full border border-line-strong bg-surface px-3 py-1.5 text-[13px] text-ink transition-colors hover:bg-surface-2 sm:self-auto"
          >
            <RotateCcw className="size-3.5" /> Reintentar
          </button>
        </div>
      )}
      {nudge && status !== "loading" && status !== "streaming" && <RegisterNudge variant={nudge} />}
    </div>
  );
}
