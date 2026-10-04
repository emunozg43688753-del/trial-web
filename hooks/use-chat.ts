"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createId } from "@/lib/utils/cn";
import type { BrainStatus, ChatMessage, IntelligenceMode } from "@/types";

type Phase = "idle" | "loading" | "streaming" | "success" | "error";

interface UseChatOptions {
  initialMessages?: ChatMessage[];
  initialMode?: IntelligenceMode;
  onMessagesChange?: (messages: ChatMessage[]) => void;
}

const FRIENDLY_ERROR =
  "No pude completar la respuesta. Revisa tu conexión e inténtalo de nuevo.";

export function useChat({ initialMessages = [], initialMode = "demo", onMessagesChange }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [phase, setPhase] = useState<Phase>("idle");
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<IntelligenceMode>(initialMode);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const onChangeRef = useRef(onMessagesChange);

  useEffect(() => {
    onChangeRef.current = onMessagesChange;
  }, [onMessagesChange]);

  // Persist only when a turn settles, not on every streamed token.
  useEffect(() => {
    if (phase === "success" || phase === "error") onChangeRef.current?.(messages);
  }, [phase, messages]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const busy = phase === "loading" || phase === "streaming";

  const run = useCallback(async (history: ChatMessage[]) => {
    const assistantId = createId();
    const controller = new AbortController();
    abortRef.current = controller;
    setErrorMessage(null);
    setPhase("loading");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: history
            .filter((m) => !m.error && m.content.trim())
            .map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(res.status === 429 && data?.error ? data.error : FRIENDLY_ERROR);
      }

      const headerMode = res.headers.get("X-Trial-Mode");
      if (headerMode === "live" || headerMode === "demo") setMode(headerMode);

      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", createdAt: Date.now() },
      ]);
      setPhase("streaming");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let content = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        content += decoder.decode(value, { stream: true });
        const snapshot = content;
        setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, content: snapshot } : m)));
      }

      if (!content.trim()) throw new Error(FRIENDLY_ERROR);
      setPhase("success");
    } catch (error) {
      if (controller.signal.aborted) {
        setPhase("success");
        return;
      }
      const message = error instanceof Error && error.message ? error.message : FRIENDLY_ERROR;
      setErrorMessage(message);
      setMessages((prev) => prev.filter((m) => !(m.id === assistantId && !m.content)));
      setPhase("error");
    } finally {
      abortRef.current = null;
    }
  }, []);

  const send = useCallback(
    (text?: string) => {
      const content = (text ?? input).trim();
      if (!content || busy) return;
      const userMessage: ChatMessage = { id: createId(), role: "user", content, createdAt: Date.now() };
      const next = [...messages, userMessage];
      setMessages(next);
      setInput("");
      void run(next);
    },
    [busy, input, messages, run],
  );

  const retry = useCallback(() => {
    if (busy) return;
    // Drop a trailing (partial) assistant answer and resend the conversation.
    const trimmed = messages[messages.length - 1]?.role === "assistant" ? messages.slice(0, -1) : messages;
    if (!trimmed.length) return;
    setMessages(trimmed);
    void run(trimmed);
  }, [busy, messages, run]);

  const stop = useCallback(() => abortRef.current?.abort(), []);

  const reset = useCallback((next: ChatMessage[] = []) => {
    abortRef.current?.abort();
    setMessages(next);
    setInput("");
    setErrorMessage(null);
    setPhase("idle");
  }, []);

  let status: BrainStatus;
  if (phase === "loading" || phase === "streaming" || phase === "error") status = phase;
  else if (input.trim()) status = "typing";
  else if (messages.length === 0) status = "empty";
  else status = phase === "success" ? "success" : "idle";

  return { messages, status, busy, input, setInput, send, retry, stop, reset, mode, errorMessage };
}
