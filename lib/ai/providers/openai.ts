import "server-only";
import { readSSE, safeJsonParse } from "../sse";
import { ProviderError, type LLMProvider, type StreamChatParams } from "../types";

interface OpenAICompatibleConfig {
  apiKey: string;
  model: string;
  /** Any OpenAI-compatible endpoint: OpenAI, Azure-compatible gateways, Groq, Together, OpenRouter, Vercel AI Gateway… */
  baseUrl: string;
  maxTokens: number;
  temperature: number;
}

interface ChatCompletionChunk {
  choices?: { delta?: { content?: string | null } }[];
}

export function createOpenAICompatibleProvider(
  config: OpenAICompatibleConfig,
): LLMProvider {
  return {
    id: "openai-compatible",
    mode: "live",
    async *streamChat({ system, messages, signal }: StreamChatParams) {
      const res = await fetch(`${config.baseUrl.replace(/\/$/, "")}/chat/completions`, {
        method: "POST",
        signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          stream: true,
          temperature: config.temperature,
          max_tokens: config.maxTokens,
          messages: [{ role: "system", content: system }, ...messages],
        }),
      });

      if (!res.ok || !res.body) {
        throw new ProviderError(`Upstream error (${res.status})`, res.status);
      }

      for await (const data of readSSE(res.body)) {
        if (data === "[DONE]") return;
        const chunk = safeJsonParse<ChatCompletionChunk>(data);
        const text = chunk?.choices?.[0]?.delta?.content;
        if (text) yield text;
      }
    },
  };
}
