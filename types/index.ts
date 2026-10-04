import type { LucideIcon } from "lucide-react";

/* ───────────── Content ───────────── */

export interface Solution {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  problem: string;
  benefit: string;
  icon: LucideIcon;
  capabilities: string[];
  useCases: string[];
  deliverables: string[];
  cta: string;
}

export interface Agent {
  slug: string;
  name: string;
  role: string;
  objective: string;
  tasks: string[];
  tools: string[];
  integrations: string[];
  benefit: string;
  icon: LucideIcon;
  sampleInstruction: string;
}

export interface AutomationArea {
  id: string;
  label: string;
  icon: LucideIcon;
  summary: string;
  automations: { title: string; detail: string }[];
}

export interface ProcessStep {
  index: string;
  title: string;
  headline: string;
  description: string;
  outputs: string[];
}

export interface PromptSuggestion {
  label: string;
  prompt: string;
}

/* ───────────── Chat ───────────── */

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  /** true when the assistant message failed to complete */
  error?: boolean;
}

/**
 * Visual lifecycle of the TRIAL Brain.
 * idle → typing (user writing) → loading (request sent) → streaming → success | error
 * "empty" is idle with no conversation yet.
 */
export type BrainStatus =
  | "empty"
  | "idle"
  | "typing"
  | "loading"
  | "streaming"
  | "success"
  | "error";

export type IntelligenceMode = "live" | "demo";

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
}

/* ───────────── Contact ───────────── */

export interface ContactPayload {
  name: string;
  company: string;
  email: string;
  area: string;
  problem: string;
  message: string;
}
