import { processSteps } from "@/data/content";

export function ProcessTimeline() {
  return (
    <ol className="relative grid gap-0 lg:grid-cols-5">
      {/* Connecting line */}
      <span aria-hidden className="absolute top-0 bottom-0 left-[11px] w-px bg-line lg:top-[11px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto" />
      {processSteps.map((step, i) => (
        <li key={step.index} className="reveal relative pb-12 pl-12 last:pb-0 lg:pb-0 lg:pl-0 lg:pr-8" style={{ animationDelay: `${i * 60}ms` }}>
          <span aria-hidden className="absolute top-0 left-0 flex size-[23px] items-center justify-center rounded-full border border-line-strong bg-bg lg:relative">
            <span className="size-[7px] rounded-full bg-accent" />
          </span>
          <p className="font-mono text-[11px] tracking-[0.14em] text-ink-3 lg:mt-8">
            {step.index} — <span className="text-ink">{step.title.toUpperCase()}</span>
          </p>
          <h3 className="editorial mt-3 text-2xl text-ink">{step.headline}</h3>
          <p className="mt-3 text-[14px] leading-relaxed text-ink-2">{step.description}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {step.outputs.map((o) => (
              <li key={o} className="rounded-md bg-surface-2 px-2 py-0.5 text-[11.5px] text-ink-2">
                {o}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
