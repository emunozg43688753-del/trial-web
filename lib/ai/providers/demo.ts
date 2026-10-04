import "server-only";
import { pickDemoResponse } from "../demo-responses";
import type { LLMProvider, StreamChatParams } from "../types";

const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });

/**
 * Simulated provider. Streams curated answers token-by-token so the full
 * UI (loading → streaming → success) can be exercised without an API key.
 */
export function createDemoProvider(): LLMProvider {
  return {
    id: "demo",
    mode: "demo",
    async *streamChat({ messages, signal }: StreamChatParams) {
      const lastUser = [...messages].reverse().find((m) => m.role === "user");
      const response = pickDemoResponse(lastUser?.content ?? "");

      // "Thinking" latency, then stream in small word groups.
      await sleep(450, signal);
      const tokens = response.match(/\S+\s*/g) ?? [response];
      for (let i = 0; i < tokens.length; i += 2) {
        yield tokens.slice(i, i + 2).join("");
        await sleep(14 + Math.random() * 22, signal);
      }
    },
  };
}
