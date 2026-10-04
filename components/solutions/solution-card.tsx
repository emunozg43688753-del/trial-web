import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Solution } from "@/types";

export function SolutionCard({ solution, index }: { solution: Solution; index: number }) {
  const Icon = solution.icon;
  return (
    <Link
      href={`/solutions/${solution.slug}`}
      className="reveal group relative flex h-full flex-col bg-surface p-7 transition-colors duration-300 hover:bg-surface-2/60 sm:p-8"
    >
      <div className="flex items-start justify-between">
        <span className="inline-flex size-10 items-center justify-center rounded-xl border border-line text-ink transition-all duration-300 group-hover:border-accent-line group-hover:bg-accent-soft group-hover:text-accent">
          <Icon className="size-[18px]" strokeWidth={1.6} />
        </span>
        <span className="font-mono text-[11px] text-ink-3 tabular-nums">{String(index + 1).padStart(2, "0")}</span>
      </div>

      <h3 className="mt-8 text-lg font-semibold tracking-tight text-ink">{solution.name}</h3>
      <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">{solution.description}</p>

      <dl className="mt-6 space-y-3 border-t border-line pt-5 text-[13px] leading-relaxed">
        <div>
          <dt className="eyebrow mb-1">Problema</dt>
          <dd className="text-ink-3">{solution.problem}</dd>
        </div>
        <div>
          <dt className="eyebrow mb-1">Beneficio</dt>
          <dd className="text-ink-2">{solution.benefit}</dd>
        </div>
      </dl>

      <span className="mt-auto inline-flex items-center gap-1.5 pt-7 text-[13.5px] font-medium text-ink">
        {solution.cta}
        <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
      </span>
    </Link>
  );
}

/** Hairline grid: cards share borders for an editorial, non-template look. */
export function SolutionsGrid({ items }: { items: Solution[] }) {
  return (
    <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
      {items.map((s, i) => (
        <li key={s.slug} className="bg-surface">
          <SolutionCard solution={s} index={i} />
        </li>
      ))}
    </ul>
  );
}
