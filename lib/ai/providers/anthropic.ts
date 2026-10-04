import "server-only";
import { readSSE, safeJsonParse } from "../sse";
import { ProviderError, type LLMProvider, type StreamChatParams } from "../types";

interface AnthropicConfig {
  apiKey: string;
  model: string;
  baseUrl: string;
  maxTokens: number;
  temperature: number;
}

interface AnthropicStreamEvent {
  type: string;
  delta?: { type?: string; text?: string };
  error?: { message?: string };
}

export function createAnthropicProvider(config: AnthropicConfig): LLMProvider {
  return {
    id: "anthropic",
    mode: "live",
    async *streamChat({ system, messages, signal }: StreamChatParams) {
      const res = await fetch(`${config.baseUrl.replace(/\/$/, "")}/v1/messages`, {
        method: "POST",
        signal,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": config.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: config.model,
          max_tokens: config.maxTokens,
          temperature: config.temperature,
          system,
          messages,
          stream: true,
        }),
      });

      if (!res.ok || !res.body) {
        throw new ProviderError(`Upstream error (${res.status})`, res.status);
      }

      for await (const data of readSSE(res.body)) {
        const event = safeJsonParse<AnthropicStreamEvent>(data);
        if (!event) continue;
        if (event.type === "error") {
          throw new ProviderError(event.error?.message ?? "Upstream stream error");
        }
        if (event.type === "content_block_delta" && event.delta?.type === "text_delta" && event.delta.text) {
          yield event.delta.text;
        }
        if (event.type === "message_stop") return;
      }
    },
  };
}
