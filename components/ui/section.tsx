import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  inverse?: boolean;
  labelledBy?: string;
}

export function Section({ id, children, className, inverse, labelledBy }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("relative py-24 sm:py-32", inverse && "tone-inverse", className)}
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
  as?: "h1" | "h2";
}

export function SectionHeader({ id, eyebrow, title, description, align = "left", action, as: Tag = "h2" }: SectionHeaderProps) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "reveal mb-14 flex flex-col gap-6 sm:mb-16",
        centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
      )}
    >
      <div className={cn("max-w-2xl", centered && "mx-auto")}>
        <p className="eyebrow mb-5 flex items-center gap-2">
          <span aria-hidden className="inline-block size-1.5 rounded-full bg-accent" />
          {eyebrow}
        </p>
        <Tag id={id} className="editorial text-balance text-[2.5rem] text-ink sm:text-6xl">
          {title}
        </Tag>
        {description && (
          <p className="mt-5 max-w-xl text-pretty text-[17px] leading-relaxed text-ink-2">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function PageHero({ eyebrow, title, description, children }: { eyebrow: string; title: ReactNode; description?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-line pt-36 pb-20 sm:pt-44 sm:pb-24">
      <div aria-hidden className="grid-field pointer-events-none absolute inset-0 opacity-70" />
      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <p className="eyebrow mb-6 flex items-center gap-2 animate-fade-in">
          <span aria-hidden className="inline-block size-1.5 rounded-full bg-accent" />
          {eyebrow}
        </p>
        <h1 className="editorial max-w-4xl text-balance text-5xl text-ink animate-fade-up sm:text-7xl">{title}</h1>
        {description && (
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-ink-2 animate-fade-up [animation-delay:80ms]">
            {description}
          </p>
        )}
        {children && <div className="mt-10 animate-fade-up [animation-delay:160ms]">{children}</div>}
      </div>
    </section>
  );
}
