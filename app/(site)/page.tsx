import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AgentCard } from "@/components/agents/agent-card";
import { Hero } from "@/components/hero/hero";
import { CTA } from "@/components/sections/cta";
import { IndustrySelector } from "@/components/sections/industry-selector";
import { IntelligenceLayer } from "@/components/sections/intelligence-layer";
import { Philosophy } from "@/components/sections/philosophy";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { SolutionsGrid } from "@/components/solutions/solution-card";
import { Section, SectionHeader } from "@/components/ui/section";
import { siteConfig } from "@/config/site";
import { agents } from "@/data/agents";
import { solutions } from "@/data/solutions";
import { isDemoMode } from "@/lib/ai/provider";

function SeeAll({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-accent">
      {label}
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  slogan: siteConfig.tagline,
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero mode={isDemoMode() ? "demo" : "live"} />

      <IntelligenceLayer />

      <Section id="solutions" labelledBy="solutions-title">
        <SectionHeader
          id="solutions-title"
          eyebrow="Soluciones de Inteligencia"
          title="Sistemas diseñados para el trabajo real."
          description="Ocho capacidades que combinamos según tu operación. Cada una resuelve un problema concreto y se mide por resultados."
          action={<SeeAll href="/solutions" label="Ver todas las soluciones" />}
        />
        <SolutionsGrid items={solutions} />
      </Section>

      <Section id="discover" labelledBy="discover-title" className="border-t border-line">
        <SectionHeader
          id="discover-title"
          eyebrow="Descubre lo que puedes automatizar"
          title="¿Qué podría hacer la IA por tu negocio?"
          description="Selecciona un área y explora oportunidades concretas. Luego, analízalas con TRIAL Brain."
        />
        <IndustrySelector />
      </Section>

      <Section id="agents" labelledBy="agents-title" className="border-t border-line bg-surface-2/40">
        <SectionHeader
          id="agents-title"
          eyebrow="AI Agents"
          title="Especialistas digitales. Criterio humano."
          description="Agentes con objetivos claros, herramientas definidas e integraciones reales. Diseñados para trabajar con tu equipo, no en su lugar."
          action={<SeeAll href="/agents" label="Ver catálogo de agentes" />}
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <li key={agent.slug}>
              <AgentCard agent={agent} />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="how-it-works" labelledBy="how-title" className="border-t border-line">
        <SectionHeader
          id="how-title"
          eyebrow="Cómo funciona"
          title="De la oportunidad al sistema en producción."
          description="Un método en cinco fases, con entregables verificables en cada una."
        />
        <ProcessTimeline />
      </Section>

      <Philosophy />

      <CTA />
    </>
  );
}
