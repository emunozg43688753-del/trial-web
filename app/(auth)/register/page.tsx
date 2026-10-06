import { Check, Gift } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { growthConfig } from "@/config/growth";
import { salesAgents } from "@/data/sales-agents";

export const metadata: Metadata = {
  title: "Activa tu demo gratis",
  description: `Crea tu cuenta y gana ${growthConfig.trialDays} días de demo de los Agentes de Ventas con IA de TRIAL. Sin tarjeta.`,
  alternates: { canonical: "/register" },
};

const BENEFITS = [
  `${growthConfig.trialDays} días de acceso completo a la demo`,
  `Activa hasta ${growthConfig.maxDemoAgents} agentes de ventas a la vez`,
  "Pruébalos con casos reales en TRIAL Intelligence",
  "Sin tarjeta de crédito · Cancela cuando quieras",
];

export default function RegisterPage() {
  const demoAgents = salesAgents.filter((a) => a.tier === "demo");
  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-32">
      <div aria-hidden className="grid-field pointer-events-none absolute inset-x-0 top-0 h-[640px] opacity-70" />
      <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-16">
        <div className="lg:pt-8">
          <p className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1.5 text-[12.5px] font-medium text-accent animate-fade-in">
            <Gift className="size-3.5" /> Oferta de bienvenida
          </p>
          <h1 className="editorial mt-6 text-balance text-5xl text-ink animate-fade-up sm:text-6xl">
            Gana {growthConfig.trialDays} días de <span className="italic text-accent">Agentes de Ventas</span> con IA.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-2">
            Crea tu cuenta en 30 segundos y activa agentes que califican leads, hacen seguimiento y agendan reuniones por ti.
          </p>

          <ul className="mt-8 space-y-3">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-3 text-[15px] text-ink">
                <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-10 hidden rounded-2xl border border-line bg-surface/70 p-5 lg:block">
            <p className="eyebrow mb-3">Incluidos en tu demo</p>
            <ul className="grid grid-cols-2 gap-3">
              {demoAgents.map(({ id, name, icon: Icon }) => (
                <li key={id} className="flex items-center gap-2.5 text-[13.5px] text-ink-2">
                  <Icon className="size-4 text-accent" strokeWidth={1.6} /> {name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Suspense>
          <AuthForm mode="register" />
        </Suspense>
      </div>
    </section>
  );
}
