import type { Metadata } from "next";
import { AgentCard } from "@/components/agents/agent-card";
import { CTA } from "@/components/sections/cta";
import { DemoBanner } from "@/components/sections/demo-banner";
import { PageHero, Section } from "@/components/ui/section";
import { agents } from "@/data/agents";

export const metadata: Metadata = {
  title: "AI Agents",
  description:
    "Catálogo de agentes de IA de TRIAL: ventas, soporte, investigación, operaciones, conocimiento y asistencia ejecutiva.",
  alternates: { canonical: "/agents" },
};

export default function AgentsPage() {
  return (
    <>
      <PageHero
        eyebrow="AI Agents"
        title="Sistemas especializados que trabajan con tu equipo."
        description="Cada agente tiene un objetivo, tareas definidas, herramientas y límites claros. Se integran a tus sistemas y escalan a personas cuando importa."
      />
      <Section className="py-16 sm:py-24">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <li key={agent.slug}>
              <AgentCard agent={agent} />
            </li>
          ))}
        </ul>
        <DemoBanner className="mt-10" />
      </Section>
      <CTA
        eyebrow="Agentes a medida"
        title={
          <>
            ¿Necesitas un agente que <span className="italic text-accent">todavía no existe?</span>
          </>
        }
        description="Diseñamos agentes para procesos específicos de tu industria, con tus datos y tus reglas."
      />
    </>
  );
}
