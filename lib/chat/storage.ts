import type { ChatMessage, Conversation } from "@/types";

/**
 * Conversation persistence boundary.
 * Today: browser storage (per device). When authentication lands, implement
 * the same interface against a database (e.g. Supabase) keyed by user id.
 */
export interface ConversationStore {
  subscribe(listener: () => void): () => void;
  getSnapshot(): Conversation[];
  getServerSnapshot(): Conversation[];
  get(id: string): Conversation | undefined;
  save(conversation: Conversation): void;
  remove(id: string): void;
}

const KEY = "trial.conversations.v1";
const MAX_CONVERSATIONS = 30;
const EMPTY: Conversation[] = [];

function createLocalStore(): ConversationStore {
  const listeners = new Set<() => void>();
  let cache: Conversation[] | null = null;

  const read = (): Conversation[] => {
    if (cache) return cache;
    try {
      const raw = window.localStorage.getItem(KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      cache = Array.isArray(parsed)
        ? (parsed as Conversation[]).sort((a, b) => b.updatedAt - a.updatedAt)
        : [];
    } catch {
      cache = [];
    }
    return cache;
  };

  const write = (items: Conversation[]) => {
    cache = items.slice(0, MAX_CONVERSATIONS);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(cache));
    } catch {
      /* storage unavailable (private mode, quota) — history stays in memory */
    }
    listeners.forEach((l) => l());
  };

  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    cache = null;
    listeners.forEach((l) => l());
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      if (listeners.size === 1) window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) window.removeEventListener("storage", onStorage);
      };
    },
    getSnapshot: read,
    getServerSnapshot: () => EMPTY,
    get: (id) => read().find((c) => c.id === id),
    save(conversation) {
      write([conversation, ...read().filter((c) => c.id !== conversation.id)]);
    },
    remove(id) {
      write(read().filter((c) => c.id !== id));
    },
  };
}

export const conversationStore = createLocalStore();

export function deriveTitle(messages: ChatMessage[]): string {
  const first = messages.find((m) => m.role === "user")?.content ?? "Nueva conversación";
  return first.length > 52 ? `${first.slice(0, 52).trimEnd()}…` : first;
}
