"use client";

import { Gift, PartyPopper, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { growthConfig } from "@/config/growth";
import { salesAgents } from "@/data/sales-agents";

const CONFETTI = Array.from({ length: 18 }, (_, i) => i);

/** Promotional welcome shown once, right after the account is created. */
export function WelcomeModal({ name, trialEndsAt, onClose }: { name: string; trialEndsAt: string; onClose: () => void }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const first = name.trim().split(" ")[0];
  const demoAgents = salesAgents.filter((a) => a.tier === "demo");
  const ends = new Date(trialEndsAt).toLocaleString("es", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    buttonRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <button type="button" aria-label="Cerrar" onClick={onClose} className="absolute inset-0 bg-ink/40 backdrop-blur-[2px] animate-fade-in" />

      <div className="relative w-full max-w-lg overflow-hidden rounded-t-3xl border border-line bg-surface shadow-lift animate-fade-up sm:rounded-3xl">
        {/* Confetti */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 overflow-hidden">
          {CONFETTI.map((i) => (
            <span
              key={i}
              className="absolute top-[-12px] block h-2.5 w-1.5 rounded-sm animate-[confetti_2.4s_ease-in_forwards]"
              style={{
                left: `${(i * 53) % 100}%`,
                background: ["var(--accent)", "#f5b84b", "#5fc493", "#f08a80"][i % 4],
                animationDelay: `${(i % 6) * 0.12}s`,
                transform: `rotate(${i * 37}deg)`,
              }}
            />
          ))}
        </div>

        <button type="button" onClick={onClose} aria-label="Cerrar" className="absolute top-4 right-4 inline-flex size-9 items-center justify-center rounded-full text-ink-3 hover:bg-surface-2 hover:text-ink">
          <X className="size-4" />
        </button>

        <div className="relative px-6 pt-10 pb-7 text-center sm:px-10">
          <span className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <PartyPopper className="size-7" strokeWidth={1.6} />
          </span>
          <p className="eyebrow mt-6">Premio desbloqueado</p>
          <h2 id="welcome-title" className="editorial mt-3 text-balance text-4xl text-ink">
            ¡Felicidades{first ? `, ${first}` : ""}! Ganaste una demo de {growthConfig.trialDays} días.
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-ink-2">
            Ya puedes activar nuestro <strong className="text-ink">listado de Agentes de Ventas con IA</strong> y ponerlos a prueba con tu negocio.
          </p>

          <ul className="mx-auto mt-6 grid max-w-sm grid-cols-2 gap-2 text-left">
            {demoAgents.map(({ id, name: agentName, icon: Icon }) => (
              <li key={id} className="flex items-center gap-2 rounded-xl border border-line bg-bg px-3 py-2 text-[13px] text-ink">
                <Icon className="size-3.5 text-accent" strokeWidth={1.8} /> {agentName}
              </li>
            ))}
          </ul>

          <p className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] text-ink-3">
            <Gift className="size-3.5" /> Activa hasta {growthConfig.maxDemoAgents} agentes · válido hasta el {ends}
          </p>

          <Button ref={buttonRef} size="lg" variant="accent" className="mt-7 w-full" onClick={onClose}>
            Activar mis agentes ahora
          </Button>
        </div>
      </div>
    </div>
  );
}
