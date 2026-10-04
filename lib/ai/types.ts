import type { ChatRole } from "@/types";

export interface LLMMessage {
  role: ChatRole;
  content: string;
}

export interface StreamChatParams {
  system: string;
  messages: LLMMessage[];
  signal?: AbortSignal;
}

/**
 * Contract every model provider implements.
 * The UI and the API route only ever talk to this interface,
 * so swapping vendors never touches the rest of the app.
 */
export interface LLMProvider {
  readonly id: string;
  readonly mode: "live" | "demo";
  streamChat(params: StreamChatParams): AsyncIterable<string>;
}

export class ProviderError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ProviderError";
  }
}
