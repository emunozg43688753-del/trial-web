import "server-only";
import { createAnthropicProvider } from "./providers/anthropic";
import { createDemoProvider } from "./providers/demo";
import { createOpenAICompatibleProvider } from "./providers/openai";
import type { LLMProvider } from "./types";

/**
 * Provider registry.
 * To add a vendor: create `providers/<name>.ts` implementing LLMProvider
 * and register it here. Nothing else in the app changes.
 */
type ProviderId = "openai" | "anthropic";

const DEFAULTS: Record<ProviderId, { baseUrl: string; model: string }> = {
  openai: { baseUrl: "https://api.openai.com/v1", model: "gpt-4.1-mini" },
  anthropic: { baseUrl: "https://api.anthropic.com", model: "claude-sonnet-4-5" },
};

function readNumber(value: string | undefined, fallback: number): number {
  if (value === undefined || value.trim() === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function resolveProviderId(): ProviderId {
  const explicit = process.env.LLM_PROVIDER?.toLowerCase();
  if (explicit === "anthropic" || explicit === "openai") return explicit;
  // Infer from key format when not specified.
  if (process.env.LLM_API_KEY?.startsWith("sk-ant-")) return "anthropic";
  return "openai";
}

export function isDemoMode(): boolean {
  return !process.env.LLM_API_KEY?.trim();
}

export function getProvider(): LLMProvider {
  if (isDemoMode()) return createDemoProvider();

  const id = resolveProviderId();
  const config = {
    apiKey: process.env.LLM_API_KEY!.trim(),
    model: process.env.LLM_MODEL?.trim() || DEFAULTS[id].model,
    baseUrl: process.env.LLM_BASE_URL?.trim() || DEFAULTS[id].baseUrl,
    maxTokens: readNumber(process.env.LLM_MAX_TOKENS, 1200),
    temperature: Math.min(readNumber(process.env.LLM_TEMPERATURE, 0.4), 1),
  };

  switch (id) {
    case "anthropic":
      return createAnthropicProvider(config);
    case "openai":
    default:
      return createOpenAICompatibleProvider(config);
  }
}
