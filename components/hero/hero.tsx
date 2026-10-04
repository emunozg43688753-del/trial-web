import { TrialBrain } from "@/components/intelligence/trial-brain";
import type { IntelligenceMode } from "@/types";

const CAPABILITIES = ["Agentes autónomos", "Automatización", "Knowledge Intelligence", "Integraciones"];

export function Hero({ mode }: { mode: IntelligenceMode }) {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-28">
      <div aria-hidden className="grid-field pointer-events-none absolute inset-x-0 top-0 h-[780px]" />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-240px] left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-3xl"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-5 text-center sm:px-8">
        <p className="eyebrow inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1.5 tracking-[0.08em] animate-fade-in sm:tracking-[0.14em]">
          <span aria-hidden className="size-1.5 rounded-full bg-accent" />
          Centro de Experiencia de Superinteligencia
        </p>

        <h1 id="hero-title" className="display mt-7 max-w-5xl text-balance text-[2.9rem] text-ink sm:text-7xl lg:text-[5.25rem]">
          Superinteligencia para potenciar al{" "}
          <span className="editorial font-normal tracking-[-0.02em] text-accent italic">humano.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-[17px] leading-relaxed text-ink-2 animate-fade-up [animation-delay:80ms] sm:text-lg">
          Transformamos procesos, conocimiento y operaciones mediante inteligencia artificial y agentes autónomos.
        </p>

        <div className="mt-10 w-full max-w-3xl text-left animate-fade-up [animation-delay:120ms] sm:mt-12">
          <TrialBrain initialMode={mode} />
        </div>

        <ul aria-label="Capacidades" className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 animate-fade-in [animation-delay:300ms]">
          {CAPABILITIES.map((c, i) => (
            <li key={c} className="flex items-center gap-6 font-mono text-[11px] tracking-[0.12em] text-ink-3 uppercase">
              {i > 0 && <span aria-hidden className="size-1 rounded-full bg-line-strong" />}
              {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
