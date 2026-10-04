"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { automationAreas } from "@/data/automation-areas";
import { cn } from "@/lib/utils/cn";

/** Accessible tabs (WAI-ARIA pattern) showing automation opportunities per business area. */
export function IndustrySelector() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const area = automationAreas[activeIndex]!;
  const Icon = area.icon;

  const focusTab = (index: number) => {
    const next = (index + automationAreas.length) % automationAreas.length;
    setActiveIndex(next);
    tabsRef.current[next]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const keys: Record<string, () => void> = {
      ArrowRight: () => focusTab(activeIndex + 1),
      ArrowDown: () => focusTab(activeIndex + 1),
      ArrowLeft: () => focusTab(activeIndex - 1),
      ArrowUp: () => focusTab(activeIndex - 1),
      Home: () => focusTab(0),
      End: () => focusTab(automationAreas.length - 1),
    };
    const action = keys[e.key];
    if (action) {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:gap-10">
      {/* Tabs: horizontal scroller on mobile, vertical list on desktop */}
      <div
        role="tablist"
        aria-label="Áreas de negocio"
        onKeyDown={onKeyDown}
        className="scroll-quiet -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0"
      >
        {automationAreas.map((a, i) => {
          const selected = i === activeIndex;
          const TabIcon = a.icon;
          return (
            <button
              key={a.id}
              ref={(el) => {
                tabsRef.current[i] = el;
              }}
              id={`${baseId}-tab-${a.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "group flex shrink-0 items-center gap-3 rounded-full border px-4 py-2.5 text-left text-sm transition-all duration-200 lg:rounded-xl lg:border-transparent lg:px-4 lg:py-3",
                selected
                  ? "border-ink bg-ink text-bg lg:border-line lg:bg-surface lg:text-ink lg:shadow-soft"
                  : "border-line text-ink-2 hover:text-ink lg:hover:bg-surface-2",
              )}
            >
              <TabIcon aria-hidden className={cn("hidden size-4 lg:block", selected ? "text-accent" : "text-ink-3")} strokeWidth={1.6} />
              <span className="whitespace-nowrap">{a.label}</span>
              <span aria-hidden className={cn("ml-auto hidden font-mono text-[11px] lg:block", selected ? "text-ink-3" : "text-transparent")}>
                {String(a.automations.length).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </div>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${area.id}`}
        tabIndex={0}
        className="relative overflow-hidden rounded-2xl border border-line bg-surface"
      >
        <div aria-hidden className="dot-field pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,#000,transparent_60%)]" />
        <div key={area.id} className="relative p-6 sm:p-10">
          <div className="flex items-center gap-3 animate-fade-in">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <Icon className="size-[18px]" strokeWidth={1.6} />
            </span>
            <p className="eyebrow">{area.label}</p>
          </div>
          <p className="editorial mt-6 max-w-xl text-3xl text-ink animate-fade-up sm:text-4xl">{area.summary}</p>

          <ul className="mt-10 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
            {area.automations.map((item, i) => (
              <li key={item.title} className="flex gap-4 bg-surface p-5 animate-fade-up sm:last:odd:col-span-2" style={{ animationDelay: `${80 + i * 55}ms` }}>
                <span className="mt-0.5 font-mono text-[11px] text-accent">→</span>
                <div>
                  <p className="text-[14.5px] font-medium text-ink">{item.title}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink-3">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>

          <Link
            href={`/intelligence?q=${encodeURIComponent(`¿Qué procesos de ${area.label.toLowerCase()} puedo automatizar con IA en mi empresa?`)}`}
            className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-accent"
          >
            Analizar {area.label.toLowerCase()} con TRIAL Brain
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
