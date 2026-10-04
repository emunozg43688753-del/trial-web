import { cn } from "@/lib/utils/cn";
import type { BrainStatus, IntelligenceMode } from "@/types";

const LABELS: Record<BrainStatus, string> = {
  empty: "Listo",
  idle: "En espera",
  typing: "Escuchando",
  loading: "Analizando",
  streaming: "Generando",
  success: "Respuesta lista",
  error: "Interrumpido",
};

export function BrainStatusIndicator({ status, className }: { status: BrainStatus; className?: string }) {
  const working = status === "loading" || status === "streaming";
  return (
    <span role="status" aria-live="polite" className={cn("inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em]", className)}>
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full transition-colors",
          working && "bg-accent animate-pulse",
          status === "error" && "bg-danger",
          status === "success" && "bg-success",
          status === "typing" && "bg-ink-2",
          (status === "empty" || status === "idle") && "bg-ink-3",
        )}
      />
      <span className={cn("text-ink-3", working && "shimmer-text")}>{LABELS[status]}</span>
    </span>
  );
}

export function ModeBadge({ mode }: { mode: IntelligenceMode }) {
  if (mode === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-3">
        <span aria-hidden className="size-1.5 rounded-full bg-success" />
        Live
      </span>
    );
  }
  return (
    <span
      title="Respuestas de demostración. Conecta un proveedor LLM para activar inteligencia en vivo."
      className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-3"
    >
      <span className="sm:hidden">Demo</span>
      <span className="hidden sm:inline">Demo Intelligence</span>
    </span>
  );
}
