import type { Metadata } from "next";
import { IntelligenceWorkspace } from "@/components/intelligence/intelligence-workspace";
import { isDemoMode } from "@/lib/ai/provider";

export const metadata: Metadata = {
  title: "Intelligence",
  description:
    "TRIAL Brain: un estratega de IA para diagnosticar procesos, diseñar agentes autónomos y planificar la implementación en tu empresa.",
  alternates: { canonical: "/intelligence" },
};

export default async function IntelligencePage({ searchParams }: PageProps<"/intelligence">) {
  const params = await searchParams;
  const pick = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.slice(0, 1000);

  return (
    <IntelligenceWorkspace
      initialMode={isDemoMode() ? "demo" : "live"}
      initialConversationId={pick(params.c)}
      initialPrompt={pick(params.q)}
    />
  );
}
