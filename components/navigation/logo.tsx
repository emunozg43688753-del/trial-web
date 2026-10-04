import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn("size-5", className)}>
      <circle cx="12" cy="12" r="10.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 1.75v6.5M12 15.75v6.5M1.75 12h6.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16.5" cy="12" r="2.75" fill="var(--accent)" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="TRIAL — inicio" className={cn("inline-flex items-center gap-2.5 text-ink", className)}>
      <LogoMark />
      <span className="font-mono text-[15px] font-semibold tracking-[0.28em]">TRIAL</span>
    </Link>
  );
}
