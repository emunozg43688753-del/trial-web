"use client";

import { ArrowUpRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import { buttonStyles } from "@/components/ui/button";
import { salesLink } from "@/config/growth";
import { track } from "@/lib/growth/client";

interface SalesCTAProps {
  label: string;
  message?: string;
  variant?: "primary" | "accent" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
}

/** "Talk to sales" button. Records the buying signal so the lead gets prioritised. */
export function SalesCTA({ label, message, variant = "accent", size = "md", className }: SalesCTAProps) {
  const { authedFetch, user } = useAuth();
  const { href, external } = salesLink(message);
  const isWhatsapp = href.includes("wa.me");

  const onClick = () => {
    const type = isWhatsapp ? "whatsapp_clicked" : "booking_clicked";
    track("sales_cta_click", { channel: isWhatsapp ? "whatsapp" : external ? "booking" : "contact" });
    if (user) void authedFetch("/api/account/event", { method: "POST", body: JSON.stringify({ type }) }).catch(() => undefined);
  };

  const content = (
    <>
      {isWhatsapp && <MessageCircle className="size-4" />}
      {label}
      <ArrowUpRight className="size-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
    </>
  );

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={buttonStyles(variant, size, className)}>
      {content}
    </a>
  ) : (
    <Link href={href} onClick={onClick} className={buttonStyles(variant, size, className)}>
      {content}
    </Link>
  );
}
