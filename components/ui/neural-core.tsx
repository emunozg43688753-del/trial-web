import { cn } from "@/lib/utils/cn";

/**
 * TRIAL's signature "intelligence" indicator.
 * Calm when idle, pulses while the brain is thinking.
 */
export function NeuralCore({ active = false, size = "md", className }: { active?: boolean; size?: "sm" | "md"; className?: string }) {
  const dim = size === "sm" ? "size-6" : "size-8";
  return (
    <span aria-hidden className={cn("relative inline-flex shrink-0 items-center justify-center", dim, className)}>
      <span className="absolute inset-0 rounded-full border border-line-strong" />
      <span
        className={cn(
          "absolute inset-[3px] rounded-full border border-dashed border-accent/50",
          active && "animate-[orbit_6s_linear_infinite]",
        )}
      />
      {active && <span className="absolute inset-1 rounded-full bg-accent/30 animate-[pulse-ring_1.6s_ease-out_infinite]" />}
      <span className={cn("relative rounded-full bg-accent transition-transform", size === "sm" ? "size-1.5" : "size-2", active && "scale-125")} />
    </span>
  );
}
