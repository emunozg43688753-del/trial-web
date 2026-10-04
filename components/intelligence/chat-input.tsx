"use client";

import { ArrowUp, Square } from "lucide-react";
import { useEffect, useRef, type FormEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils/cn";
import { CHAT_LIMITS } from "@/lib/validation/schemas";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  busy: boolean;
  placeholder: string;
  autoFocus?: boolean;
  size?: "md" | "lg";
  footer?: React.ReactNode;
}

export function ChatInput({ value, onChange, onSubmit, onStop, busy, placeholder, autoFocus, size = "md", footer }: ChatInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  // Focus on desktop only — avoids popping the virtual keyboard on touch devices.
  useEffect(() => {
    if (autoFocus && window.matchMedia("(pointer: fine)").matches) ref.current?.focus();
  }, [autoFocus]);

  // Auto-grow up to a comfortable maximum.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  }, [value]);

  const tooLong = value.length > CHAT_LIMITS.maxMessageChars;
  const canSend = value.trim().length > 0 && !tooLong && !busy;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (canSend) onSubmit();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (canSend) onSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "group/input relative rounded-2xl border border-line-strong bg-surface shadow-soft transition-[border-color,box-shadow] duration-200 focus-within:border-ink/30 focus-within:shadow-lift",
      )}
    >
      <label htmlFor="trial-input" className="sr-only">
        Escribe tu pregunta para TRIAL Brain
      </label>
      <textarea
        id="trial-input"
        ref={ref}
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-invalid={tooLong || undefined}
        className={cn(
          "scroll-quiet block w-full resize-none bg-transparent pr-14 text-ink outline-none placeholder:text-ink-3 focus-visible:outline-none",
          size === "lg" ? "min-h-[64px] px-5 pt-5 pb-3 text-base" : "min-h-[56px] px-4 pt-4 pb-2 text-[15px]",
        )}
      />
      <div className="flex items-center justify-between gap-3 px-4 pb-3">
        <div className="min-w-0 truncate text-[11px] text-ink-3">
          {tooLong ? (
            <span className="text-danger">Máximo {CHAT_LIMITS.maxMessageChars.toLocaleString("es")} caracteres</span>
          ) : (
            footer
          )}
        </div>
        {busy ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Detener respuesta"
            className="inline-flex size-9 items-center justify-center rounded-full border border-line-strong bg-surface text-ink transition-colors hover:bg-surface-2"
          >
            <Square className="size-3 fill-current" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!canSend}
            aria-label="Enviar"
            className="inline-flex size-9 items-center justify-center rounded-full bg-ink text-bg transition-all duration-200 hover:bg-accent hover:text-accent-ink disabled:bg-surface-3 disabled:text-ink-3"
          >
            <ArrowUp className="size-4" />
          </button>
        )}
      </div>
    </form>
  );
}
