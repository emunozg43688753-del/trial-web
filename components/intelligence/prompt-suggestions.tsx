import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { PromptSuggestion } from "@/types";

interface PromptSuggestionsProps {
  suggestions: PromptSuggestion[];
  onSelect: (prompt: string) => void;
  disabled?: boolean;
  className?: string;
}

export function PromptSuggestions({ suggestions, onSelect, disabled, className }: PromptSuggestionsProps) {
  return (
    <ul aria-label="Sugerencias" className={cn("flex flex-wrap gap-2", className)}>
      {suggestions.map((s, i) => (
        <li key={s.label} className="animate-fade-up" style={{ animationDelay: `${120 + i * 50}ms` }}>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onSelect(s.prompt)}
            className="group inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-2 text-left text-[13px] text-ink-2 transition-all duration-200 hover:-translate-y-px hover:border-accent-line hover:text-ink hover:shadow-soft disabled:opacity-50"
          >
            {s.label}
            <ArrowUpRight aria-hidden className="size-3 text-ink-3 transition-colors group-hover:text-accent" />
          </button>
        </li>
      ))}
    </ul>
  );
}
