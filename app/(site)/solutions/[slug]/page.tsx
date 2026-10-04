import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentCard } from "@/components/agents/agent-card";
import { CTA } from "@/components/sections/cta";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { agents } from "@/data/agents";
import { getSolution, solutions } from "@/data/solutions";

export const dynamicParams = false;

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/solutions/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) return {};
  return {
    title: solution.name,
    description: solution.description,
    alternates: { canonical: `/solutions/${solution.slug}` },
    openGraph: { title: `${solution.name} · TRIAL`, description: solution.description },
  };
}

/** Lightweight relevance mapping between solutions and agents. */
const RELATED_AGENTS: Record<string, string[]> = {
  "ai-automation": ["operations-agent", "knowledge-agent"],
  "ai-agents": ["sales-agent", "research-agent"],
  "intelligent-customer-experience": ["support-agent", "knowledge-agent"],
  "ai-sales-systems": ["sales-agent", "executive-agent"],
  "ai-operations": ["operations-agent", "executive-agent"],
  "knowledge-intelligence": ["knowledge-agent", "research-agent"],
  "ai-strategy": ["executive-agent", "research-agent"],
  "custom-ai-systems": ["research-agent", "operations-agent"],
};

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="reveal rounded-2xl border border-line bg-surface p-7">
      <h2 className="eyebrow mb-5">{title}</h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-[14.5px] leading-relaxed text-ink-2">
            <Check aria-hidden className="mt-1 size-3.5 shrink-0 text-accent" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function SolutionPage({ params }: PageProps<"/solutions/[slug]">) {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) notFound();

  const Icon = solution.icon;
  const related = agents.filter((a) => RELATED_AGENTS[solution.slug]?.includes(a.slug));
  const index = solutions.findIndex((s) => s.slug === solution.slug);
  const next = solutions[(index + 1) % solutions.length]!;

  return (
    <>
      <section className="relative overflow-hidden border-b border-line pt-32 pb-20 sm:pt-40">
        <div aria-hidden className="grid-field pointer-events-none absolute inset-0 opacity-70" />
        <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
          <Link href="/solutions" className="inline-flex items-center gap-1.5 text-[13px] text-ink-3 hover:text-ink">
            <ArrowLeft className="size-3.5" /> Soluciones
          </Link>
          <div className="mt-10 flex items-center gap-3 animate-fade-in">
            <span className="inline-flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <Icon className="size-5" strokeWidth={1.6} />
            </span>
            <span className="eyebrow">{solution.name}</span>
          </div>
          <h1 className="editorial mt-6 max-w-4xl text-balance text-5xl text-ink animate-fade-up sm:text-7xl">{solution.tagline}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-2 animate-fade-up [animation-delay:80ms]">{solution.description}</p>
          <div className="mt-10 flex flex-col gap-3 animate-fade-up [animation-delay:160ms] sm:flex-row">
            <ButtonLink href="/contact" size="lg">{solution.cta}</ButtonLink>
            <ButtonLink
              href={`/intelligence?q=${encodeURIComponent(`¿Cómo aplicaría ${solution.name} en mi empresa?`)}`}
              variant="secondary"
              size="lg"
            >
              Preguntar a TRIAL Brain
            </ButtonLink>
          </div>
        </div>
      </section>

      <Section className="py-20 sm:py-24">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
          <div className="reveal bg-surface p-8 sm:p-10">
            <h2 className="eyebrow mb-4">El problema</h2>
            <p className="editorial text-3xl text-ink">{solution.problem}</p>
          </div>
          <div className="reveal bg-surface p-8 sm:p-10">
            <h2 className="eyebrow mb-4">El resultado</h2>
            <p className="editorial text-3xl text-ink">{solution.benefit}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <DetailList title="Capacidades" items={solution.capabilities} />
          <DetailList title="Casos de uso" items={solution.useCases} />
          <DetailList title="Entregables" items={solution.deliverables} />
        </div>
      </Section>

      {related.length > 0 && (
        <Section className="border-t border-line py-20 sm:py-24">
          <h2 className="editorial reveal mb-10 text-4xl text-ink">Agentes relacionados</h2>
          <ul className="grid gap-4 md:grid-cols-2">
            {related.map((a) => (
              <li key={a.slug}>
                <AgentCard agent={a} />
              </li>
            ))}
          </ul>
          <Link href={`/solutions/${next.slug}`} className="group mt-14 flex items-center justify-between border-t border-line pt-8">
            <span>
              <span className="eyebrow block">Siguiente solución</span>
              <span className="mt-2 block text-2xl font-semibold tracking-tight text-ink group-hover:text-accent">{next.name}</span>
            </span>
            <ArrowRight className="size-5 text-ink-3 transition-transform group-hover:translate-x-1 group-hover:text-accent" />
          </Link>
        </Section>
      )}

      <CTA />
    </>
  );
}
