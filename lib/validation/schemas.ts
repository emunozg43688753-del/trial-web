import { z } from "zod";

export const CHAT_LIMITS = {
  maxMessageChars: 4_000,
  maxMessages: 24,
} as const;

export const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(CHAT_LIMITS.maxMessageChars * 2),
      }),
    )
    .min(1)
    .refine((m) => m[m.length - 1]?.role === "user", "Last message must be from the user")
    .refine(
      (m) => (m[m.length - 1]?.content.length ?? 0) <= CHAT_LIMITS.maxMessageChars,
      "Message too long",
    ),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

export const CONTACT_AREAS = [
  "Ventas",
  "Marketing",
  "Atención al cliente",
  "Operaciones",
  "Finanzas",
  "Recursos humanos",
  "Administración",
  "Logística",
  "Gestión del conocimiento",
  "Estrategia de IA",
  "Otro",
] as const;

export const contactSchema = z.object({
  name: z.string({ error: "Escribe tu nombre" }).trim().min(2, "Escribe tu nombre").max(120),
  company: z.string({ error: "Indica tu empresa" }).trim().min(2, "Indica tu empresa").max(160),
  email: z.email({ error: "Introduce un email válido" }).max(200),
  area: z.enum(CONTACT_AREAS, { error: "Selecciona un área" }),
  problem: z.string({ error: "Describe brevemente el problema" }).trim().min(10, "Describe brevemente el problema").max(500),
  message: z.string().trim().max(4000).optional().default(""),
  /** Honeypot: must stay empty */
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
