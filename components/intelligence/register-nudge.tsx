"use client";

import { ArrowRight, Gift } from "lucide-react";
import Link from "next/link";
import { growthConfig } from "@/config/growth";
import { track } from "@/lib/growth/client";
import { cn } from "@/lib/utils/cn";

/**
 * Conversion card inside the chat.
 * - "soft": after a useful answer, invites the visitor to save it and win the demo.
 * - "gate": shown when the anonymous message allowance is used up.
 */
export function RegisterNudge({ variant }: { variant: "soft" | "gate" }) {
  const gate = variant === "gate";
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border p-5 animate-fade-up sm:flex-row sm:items-center sm:justify-between",
        gate ? "border-accent bg-accent-soft" : "border-line bg-surface-2/50",
      )}
    >
      <div className="flex items-start gap-3">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface text-accent">
          <Gift className="size-4" />
        </span>
        <div>
          <p className="text-[14.5px] font-semibold text-ink">
            {gate ? "Crea tu cuenta gratis para seguir conversando" : "Guarda este diagnóstico y gana una demo"}
          </p>
          <p className="mt-0.5 text-[13px] text-ink-2">
            Al registrarte desbloqueas {growthConfig.trialDays} días de nuestros Agentes de Ventas con IA. Sin tarjeta.
          </p>
        </div>
      </div>
      <Link
        href="/register"
        onClick={() => track("chat_nudge_click", { variant })}
        className="group inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-accent-ink transition-colors hover:bg-accent/90"
      >
        Activar demo gratis
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
