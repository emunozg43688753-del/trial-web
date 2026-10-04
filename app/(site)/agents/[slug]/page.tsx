import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTA } from "@/components/sections/cta";
import { ButtonLink } from "@/components/ui/button";
import { NeuralCore } from "@/components/ui/neural-core";
import { Section } from "@/components/ui/section";
import { agents, getAgent } from "@/data/agents";

export const dynamicParams = false;

export function generateStaticParams() {
  return agents.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/agents/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const agent = getAgent(slug);
  if (!agent) return {};
  return {
    title: agent.name,
    description: `${agent.role}. ${agent.objective}`,
    alternates: { canonical: `/agents/${agent.slug}` },
    openGraph: { title: `${agent.name} · TRIAL`, description: agent.objective },
  };
}

function SpecRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-3 border-t border-line py-7 md:grid-cols-[200px_1fr]">
      <dt className="eyebrow pt-1">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((i) => (
        <li key={i} className="rounded-lg border border-line bg-surface px-3 py-1.5 font-mono text-[12px] text-ink-2">
          {i}
        </li>
      ))}
    </ul>
  );
}

export default async function AgentPage({ params }: PageProps<"/agents/[slug]">) {
  const { slug } = await params;
  const agent = getAgent(slug);
  if (!agent) notFound();

  const Icon = agent.icon;
  const index = agents.findIndex((a) => a.slug === agent.slug);
  const next = agents[(index + 1) % agents.length]!;

  return (
    <>
      <section className="relative overflow-hidden border-b border-line pt-32 pb-20 sm:pt-40">
        <div aria-hidden className="grid-field pointer-events-none absolute inset-0 opacity-70" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <Link href="/agents" className="inline-flex items-center gap-1.5 text-[13px] text-ink-3 hover:text-ink">
              <ArrowLeft className="size-3.5" /> Agentes
            </Link>
            <p className="eyebrow mt-10 flex items-center gap-2">
              <Icon aria-hidden className="size-3.5 text-accent" /> {agent.role}
            </p>
            <h1 className="display mt-5 text-6xl text-ink animate-fade-up sm:text-8xl">{agent.name}</h1>
            <p className="editorial mt-6 max-w-xl text-3xl text-ink-2 animate-fade-up [animation-delay:80ms]">{agent.objective}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contact" size="lg">Implementar este agente</ButtonLink>
              <ButtonLink
                href={`/intelligence?q=${encodeURIComponent(`Diseña un ${agent.name} (${agent.role.toLowerCase()}) adaptado a mi empresa.`)}`}
                variant="secondary"
                size="lg"
              >
                Diseñarlo con TRIAL Brain
              </ButtonLink>
            </div>
          </div>

          {/* Instruction preview */}
          <div className="rounded-2xl border border-line bg-surface shadow-lift animate-fade-up [animation-delay:160ms]">
            <div className="flex items-center gap-2 border-b border-line px-5 py-3">
              <NeuralCore size="sm" active />
              <span className="font-mono text-[11px] tracking-[0.14em] text-ink-3">INSTRUCCIÓN DE EJEMPLO</span>
            </div>
            <p className="p-6 text-[15px] leading-relaxed text-ink">“{agent.sampleInstruction}”</p>
            <div className="border-t border-line px-6 py-4 font-mono text-[11.5px] text-ink-3">
              {agent.tools.length} herramientas · {agent.integrations.length} integraciones · supervisión humana
            </div>
          </div>
        </div>
      </section>

      <Section className="py-16 sm:py-24">
        <dl className="reveal">
          <SpecRow label="Objetivo">
            <p className="text-lg leading-relaxed text-ink">{agent.objective}</p>
          </SpecRow>
          <SpecRow label="Tareas">
            <ol className="grid gap-3 sm:grid-cols-2">
              {agent.tasks.map((t, i) => (
                <li key={t} className="flex gap-3 rounded-xl border border-line bg-surface p-4 text-[14.5px] text-ink-2">
                  <span className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                  {t}
                </li>
              ))}
            </ol>
          </SpecRow>
          <SpecRow label="Herramientas">
            <Chips items={agent.tools} />
          </SpecRow>
          <SpecRow label="Integraciones posibles">
            <Chips items={agent.integrations} />
          </SpecRow>
          <SpecRow label="Beneficio">
            <p className="editorial text-3xl text-ink">{agent.benefit}</p>
          </SpecRow>
        </dl>

        <Link href={`/agents/${next.slug}`} className="group mt-10 flex items-center justify-between border-t border-line pt-8">
          <span>
            <span className="eyebrow block">Siguiente agente</span>
            <span className="mt-2 block text-2xl font-semibold tracking-tight text-ink group-hover:text-accent">{next.name}</span>
          </span>
          <ArrowRight className="size-5 text-ink-3 transition-transform group-hover:translate-x-1 group-hover:text-accent" />
        </Link>
      </Section>

      <CTA />
    </>
  );
}
