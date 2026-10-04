import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Agent } from "@/types";

/** Agents are presented as system "spec sheets", not marketing cards. */
export function AgentCard({ agent }: { agent: Agent }) {
  const Icon = agent.icon;
  return (
    <Link
      href={`/agents/${agent.slug}`}
      className="reveal group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift"
    >
      <div className="flex items-center justify-between border-b border-line bg-surface-2/50 px-5 py-3">
        <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-ink-3">
          <span aria-hidden className="size-1.5 rounded-full bg-success" />
          AGENT · {agent.slug.replace("-agent", "").toUpperCase()}
        </span>
        <Icon aria-hidden className="size-4 text-ink-3 transition-colors group-hover:text-accent" strokeWidth={1.6} />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-semibold tracking-tight text-ink">{agent.name}</h3>
        <p className="text-[13px] text-ink-3">{agent.role}</p>
        <p className="mt-4 text-[14.5px] leading-relaxed text-ink-2">{agent.objective}</p>

        <div className="mt-6">
          <p className="eyebrow mb-2.5">Tareas</p>
          <ul className="space-y-1.5 text-[13px] text-ink-2">
            {agent.tasks.slice(0, 3).map((t) => (
              <li key={t} className="flex gap-2">
                <span aria-hidden className="mt-[0.55em] h-px w-2 shrink-0 bg-ink-3" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 mb-7">
          <p className="eyebrow mb-2.5">Integraciones</p>
          <ul className="flex flex-wrap gap-1.5">
            {agent.integrations.slice(0, 4).map((i) => (
              <li key={i} className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-ink-2">
                {i}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-line pt-5">
          <p className="text-[13px] leading-snug text-ink">{agent.benefit}</p>
          <ArrowUpRight aria-hidden className="size-4 shrink-0 text-ink-3 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
        </div>
      </div>
    </Link>
  );
}
