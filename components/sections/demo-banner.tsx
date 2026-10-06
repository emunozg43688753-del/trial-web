import { ArrowRight, Gift } from "lucide-react";
import Link from "next/link";
import { demoSignupHref, growthConfig } from "@/config/growth";

/** Reusable conversion strip: promotes the free sales-agents demo. */
export function DemoBanner({ className = "" }: { className?: string }) {
  return (
    <div className={`reveal flex flex-col gap-5 rounded-2xl border border-accent-line bg-accent-soft p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8 ${className}`}>
      <div className="flex items-start gap-4">
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface text-accent">
          <Gift className="size-5" />
        </span>
        <div>
          <p className="text-lg font-semibold tracking-tight text-ink">
            Pon a trabajar a nuestros Agentes de Ventas — {growthConfig.trialDays} días gratis.
          </p>
          <p className="mt-1 text-[14.5px] text-ink-2">
            Crea tu cuenta, activa hasta {growthConfig.maxDemoAgents} agentes y pruébalos con tu negocio. Sin tarjeta.
          </p>
        </div>
      </div>
      <Link
        href={demoSignupHref}
        className="group inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-6 text-[15px] font-medium text-accent-ink transition-colors hover:bg-accent/90"
      >
        Activar demo gratis
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
