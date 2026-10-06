/**
 * Growth & conversion settings. Public values only — safe for the browser.
 */
export const growthConfig = {
  trialDays: 3,
  /** Agents a demo user can activate at once — the rest are a reason to upgrade. */
  maxDemoAgents: 3,
  /** Free TRIAL Brain messages before asking anonymous visitors to sign up. */
  anonChatLimit: 3,
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/[^\d]/g, ""),
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL ?? "",
} as const;

export function whatsappLink(message: string): string | null {
  if (!growthConfig.whatsappNumber) return null;
  return `https://wa.me/${growthConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Best available "talk to sales" destination: booking page → WhatsApp → contact form. */
export function salesLink(message = "Hola TRIAL, quiero activar mis agentes de ventas."): { href: string; external: boolean } {
  if (growthConfig.bookingUrl) return { href: growthConfig.bookingUrl, external: true };
  const wa = whatsappLink(message);
  if (wa) return { href: wa, external: true };
  return { href: "/contact", external: false };
}
