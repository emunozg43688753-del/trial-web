import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { TrialBrain } from "@/components/intelligence/trial-brain";
import { demoSignupHref, growthConfig } from "@/config/growth";
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
        <Link
          href={demoSignupHref}
          className="group inline-flex items-center gap-2 rounded-full border border-accent-line bg-surface/80 py-1.5 pr-3 pl-1.5 text-[12.5px] text-ink-2 transition-colors animate-fade-in hover:border-accent hover:text-ink"
        >
          <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[10.5px] font-medium tracking-wider text-accent-ink">GRATIS</span>
          {growthConfig.trialDays} días de demo de Agentes de Ventas con IA
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>

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

        <div className="mt-8 flex flex-col items-center gap-3 animate-fade-in [animation-delay:240ms] sm:flex-row">
          <Link
            href={demoSignupHref}
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-medium text-bg transition-colors hover:bg-ink/85"
          >
            Activar mi demo gratis
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <span className="text-[13px] text-ink-3">Sin tarjeta · {growthConfig.trialDays} días · Activación inmediata</span>
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
