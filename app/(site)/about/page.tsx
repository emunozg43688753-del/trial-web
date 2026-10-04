import type { Metadata } from "next";
import { CTA } from "@/components/sections/cta";
import { Philosophy } from "@/components/sections/philosophy";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { PageHero, Section, SectionHeader } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "About",
  description:
    "TRIAL es un Centro de Experiencia de Superinteligencia: diseñamos sistemas de IA y agentes autónomos que amplifican las capacidades humanas.",
  alternates: { canonical: "/about" },
};

const PILLARS = [
  { t: "Laboratorio", d: "Exploramos lo que los modelos y agentes pueden hacer hoy, y lo convertimos en criterio aplicable." },
  { t: "Consultora", d: "Entendemos el negocio antes que la tecnología. Priorizamos por valor medible." },
  { t: "Ingeniería", d: "Construimos sistemas en producción: seguros, observables y mantenibles." },
  { t: "Experiencia", d: "Diseñamos interfaces donde humanos e inteligencia trabajan de forma natural." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About TRIAL"
        title={
          <>
            Construimos la capa de inteligencia del <span className="italic text-accent">trabajo humano.</span>
          </>
        }
        description="TRIAL es un Centro de Experiencia de Superinteligencia. Unimos investigación aplicada, estrategia de negocio e ingeniería para que cada empresa pueda trabajar con inteligencia artificial de forma segura, útil y humana."
      />

      <Section>
        <SectionHeader eyebrow="Qué somos" title="Cuatro disciplinas, un mismo sistema." />
        <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <li key={p.t} className="reveal bg-surface p-8">
              <span className="font-mono text-[11px] text-ink-3">0{i + 1}</span>
              <h3 className="mt-8 text-xl font-semibold tracking-tight text-ink">{p.t}</h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">{p.d}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Philosophy />

      <Section className="border-b border-line">
        <SectionHeader eyebrow="Método" title="Cómo trabajamos." />
        <ProcessTimeline />
      </Section>

      <CTA />
    </>
  );
}
