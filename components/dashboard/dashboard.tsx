"use client";

import { Check, Clock, Loader2, Lock, LogOut, Play, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { growthConfig } from "@/config/growth";
import { salesAgents, type SalesAgent } from "@/data/sales-agents";
import { timeLeft, useNow } from "@/hooks/use-now";
import type { Account } from "@/lib/account/types";
import { track } from "@/lib/growth/client";
import { cn } from "@/lib/utils/cn";
import { SalesCTA } from "./sales-cta";
import { WelcomeModal } from "./welcome-modal";

export function Dashboard() {
  const router = useRouter();
  const { configured, loading, user, account, accountError, justCreated, dismissWelcome, signOut } = useAuth();

  useEffect(() => {
    if (configured && !loading && !user) router.replace("/login?next=/app");
  }, [configured, loading, user, router]);

  if (!configured) {
    return (
      <Centered>
        <p className="editorial text-3xl text-ink">El panel estará disponible muy pronto.</p>
      </Centered>
    );
  }
  if (loading || !user || (!account && !accountError)) {
    return (
      <Centered>
        <Loader2 className="size-6 animate-spin text-ink-3" />
        <p className="mt-3 text-sm text-ink-3">Preparando tus agentes…</p>
      </Centered>
    );
  }
  if (!account) {
    return (
      <Centered>
        <p className="editorial text-3xl text-ink">No pudimos cargar tu cuenta.</p>
        <p className="mt-2 text-sm text-ink-3">{accountError}</p>
        <Button className="mt-6" onClick={() => window.location.reload()}>Reintentar</Button>
      </Centered>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pt-28 pb-24 sm:px-8 sm:pt-32">
      {justCreated && <WelcomeModal name={account.name} trialEndsAt={account.trialEndsAt} onClose={dismissWelcome} />}

      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Tu panel</p>
          <h1 className="editorial mt-2 text-4xl text-ink sm:text-5xl">
            Hola{account.name ? `, ${account.name.split(" ")[0]}` : ""}.
          </h1>
        </div>
        <button onClick={() => void signOut()} className="inline-flex items-center gap-1.5 self-start text-[13px] text-ink-3 hover:text-ink sm:self-auto">
          <LogOut className="size-3.5" /> Cerrar sesión
        </button>
      </header>

      <TrialBanner account={account} />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <AgentsPanel account={account} />
        <aside className="space-y-6">
          <Checklist account={account} />
          <div className="rounded-2xl border border-line bg-surface p-6">
            <p className="eyebrow">Implementación real</p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink">
              Conectamos tus agentes a tu CRM, WhatsApp y correo en una sesión estratégica de 30 minutos.
            </p>
            <SalesCTA label="Agendar sesión" className="mt-5 w-full" message="Hola TRIAL, estoy en la demo y quiero implementar mis agentes de ventas." />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-1 flex-col items-center justify-center px-5 py-40 text-center">{children}</div>;
}

/* ───────────── Trial status ───────────── */

function TrialBanner({ account }: { account: Account }) {
  const now = useNow();
  const left = timeLeft(new Date(account.trialEndsAt).getTime(), now);

  if (account.status === "customer") {
    return (
      <div className="mt-8 flex items-center gap-3 rounded-2xl border border-success/30 bg-success/5 px-5 py-4 text-[14px] text-ink">
        <Check className="size-4 text-success" /> Plan activo. Tus agentes están trabajando.
      </div>
    );
  }

  const expired = account.status === "expired" || left.ms === 0;
  const urgent = !expired && left.days === 0;

  return (
    <div
      className={cn(
        "mt-8 flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6",
        expired ? "tone-inverse border-transparent" : urgent ? "border-danger/30 bg-danger/5" : "border-accent-line bg-accent-soft",
      )}
    >
      <div className="flex items-start gap-4">
        <span className={cn("mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl", expired ? "bg-surface-2 text-accent" : "bg-surface text-accent")}>
          {expired ? <Lock className="size-5" /> : <Clock className="size-5" />}
        </span>
        <div>
          {expired ? (
            <>
              <p className="text-lg font-semibold text-ink">Tu demo terminó. Tu configuración sigue guardada.</p>
              <p className="mt-1 text-[14px] text-ink-2">Habla con un estratega para mantener tus agentes trabajando con tu negocio real.</p>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold text-ink">
                Demo activa · te quedan{" "}
                <span className="tabular-nums text-accent">
                  {left.days > 0 && `${left.days}d `}
                  {left.hours}h {left.minutes}m
                </span>
              </p>
              <p className="mt-1 text-[14px] text-ink-2">
                {urgent ? "Último día: agenda tu sesión para no perder tus agentes." : `Activa hasta ${growthConfig.maxDemoAgents} agentes y pruébalos con casos reales.`}
              </p>
            </>
          )}
        </div>
      </div>
      <SalesCTA
        label={expired ? "Reactivar mis agentes" : "Mantener mis agentes"}
        variant={expired ? "accent" : "primary"}
        className="shrink-0"
        message={expired ? "Hola TRIAL, terminó mi demo y quiero reactivar mis agentes." : "Hola TRIAL, quiero mantener mis agentes de ventas activos."}
      />
    </div>
  );
}

/* ───────────── Onboarding checklist ───────────── */

function Checklist({ account }: { account: Account }) {
  const steps = [
    { label: "Crear tu cuenta", done: true },
    { label: "Activar tu primer agente", done: account.activatedAgents.length > 0 },
    { label: "Probar un agente con tu caso", done: account.testedAgents.length > 0 },
    { label: "Agendar tu sesión estratégica", done: account.bookedCall },
  ];
  const done = steps.filter((s) => s.done).length;

  return (
    <div className="rounded-2xl border border-line bg-surface p-6">
      <div className="flex items-center justify-between">
        <p className="eyebrow">Primeros pasos</p>
        <span className="font-mono text-[11px] text-ink-3">{done}/{steps.length}</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${(done / steps.length) * 100}%` }} />
      </div>
      <ol className="mt-5 space-y-3">
        {steps.map((s) => (
          <li key={s.label} className="flex items-center gap-3 text-[14px]">
            <span className={cn("inline-flex size-5 items-center justify-center rounded-full border", s.done ? "border-accent bg-accent text-accent-ink" : "border-line-strong")}>
              {s.done && <Check className="size-3" strokeWidth={3} />}
            </span>
            <span className={s.done ? "text-ink-3 line-through" : "text-ink"}>{s.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ───────────── Sales agents ───────────── */

function AgentsPanel({ account }: { account: Account }) {
  const { authedFetch, setAccount } = useAuth();
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const expired = account.status === "expired";
  const activeCount = account.activatedAgents.length;

  const toggle = async (agent: SalesAgent, active: boolean) => {
    setPending(agent.id);
    setError(null);
    try {
      const res = await authedFetch("/api/account/agents", { method: "POST", body: JSON.stringify({ agentId: agent.id, active }) });
      const data = (await res.json()) as { account?: Account; error?: string };
      if (!res.ok || !data.account) throw new Error(data.error ?? "No se pudo actualizar el agente");
      setAccount(data.account);
      track(active ? "agent_activated" : "agent_deactivated", { agent: agent.id });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setPending(null);
    }
  };

  const test = (agent: SalesAgent) => {
    track("agent_tested", { agent: agent.id });
    void authedFetch("/api/account/event", { method: "POST", body: JSON.stringify({ type: "agent_tested", agentId: agent.id }) }).catch(() => undefined);
    router.push(`/intelligence?q=${encodeURIComponent(agent.testPrompt)}`);
  };

  return (
    <section aria-labelledby="agents-title">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 id="agents-title" className="text-xl font-semibold tracking-tight text-ink">Agentes de Ventas</h2>
          <p className="mt-1 text-[14px] text-ink-3">
            {account.status === "trial" ? `${activeCount}/${growthConfig.maxDemoAgents} activos en tu demo` : expired ? "Disponibles con un plan" : `${activeCount} activos`}
          </p>
        </div>
      </div>
      {error && <p role="alert" className="mt-4 rounded-xl bg-danger/5 px-4 py-3 text-[13.5px] text-danger">{error}</p>}

      <ul className="mt-5 grid gap-4 sm:grid-cols-2">
        {salesAgents.map((agent) => {
          const active = account.activatedAgents.includes(agent.id);
          const locked = expired || (account.status === "trial" && agent.tier === "pro");
          const Icon = agent.icon;
          return (
            <li
              key={agent.id}
              className={cn(
                "flex flex-col rounded-2xl border bg-surface p-5 transition-all",
                active ? "border-accent shadow-soft" : "border-line",
                locked && "bg-surface-2/40",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <span className={cn("inline-flex size-10 items-center justify-center rounded-xl", active ? "bg-accent text-accent-ink" : "bg-accent-soft text-accent")}>
                  <Icon className="size-[18px]" strokeWidth={1.7} />
                </span>
                {agent.tier === "pro" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-ink px-2 py-0.5 font-mono text-[10px] tracking-wider text-bg">
                    <Sparkles className="size-3" /> PRO
                  </span>
                ) : active ? (
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] tracking-wider text-success">
                    <span className="size-1.5 animate-pulse rounded-full bg-success" /> ACTIVO
                  </span>
                ) : null}
              </div>
              <h3 className="mt-4 text-[16px] font-semibold text-ink">{agent.name}</h3>
              <p className="text-[13.5px] text-ink-2">{agent.tagline}</p>
              <ul className="mt-3 space-y-1 text-[12.5px] text-ink-3">
                {agent.tasks.map((t) => (
                  <li key={t}>· {t}</li>
                ))}
              </ul>

              <div className="mt-auto flex flex-wrap gap-2 pt-5">
                {locked ? (
                  <SalesCTA
                    label={expired ? "Reactivar" : "Desbloquear"}
                    variant="secondary"
                    size="sm"
                    message={`Hola TRIAL, quiero activar el agente ${agent.name}.`}
                  />
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant={active ? "secondary" : "accent"}
                      disabled={pending === agent.id}
                      onClick={() => void toggle(agent, !active)}
                    >
                      {pending === agent.id && <Loader2 className="size-3.5 animate-spin" />}
                      {active ? "Desactivar" : "Activar"}
                    </Button>
                    {active && (
                      <Button size="sm" variant="ghost" onClick={() => test(agent)}>
                        <Play className="size-3.5" /> Probar
                      </Button>
                    )}
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-[13px] text-ink-3">
        ¿Necesitas un agente distinto?{" "}
        <Link href="/contact" className="font-medium text-ink underline-offset-4 hover:underline">
          Diseñamos uno para tu proceso
        </Link>
      </p>
    </section>
  );
}
