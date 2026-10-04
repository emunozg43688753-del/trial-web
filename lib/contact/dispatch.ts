import "server-only";
import type { ContactPayload } from "@/types";

/**
 * Lead delivery channels. Each channel activates only when its env vars exist,
 * so new destinations (CRM, Supabase…) plug in without touching the route.
 */
interface ContactChannel {
  name: string;
  enabled: () => boolean;
  send: (lead: ContactPayload) => Promise<void>;
}

const webhookChannel: ContactChannel = {
  name: "webhook",
  enabled: () => Boolean(process.env.CONTACT_WEBHOOK_URL),
  async send(lead) {
    const res = await fetch(process.env.CONTACT_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "trial-web", receivedAt: new Date().toISOString(), lead }),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  },
};

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const resendChannel: ContactChannel = {
  name: "resend",
  enabled: () => Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL),
  async send(lead) {
    const rows = Object.entries(lead)
      .map(([k, v]) => `<p><strong>${escapeHtml(k)}:</strong> ${escapeHtml(String(v))}</p>`)
      .join("");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? "TRIAL <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO_EMAIL],
        reply_to: lead.email,
        subject: `Nuevo contacto — ${lead.company} (${lead.area})`,
        html: rows,
      }),
    });
    if (!res.ok) throw new Error(`Resend responded ${res.status}`);
  },
};

const channels: ContactChannel[] = [webhookChannel, resendChannel];

export async function dispatchLead(lead: ContactPayload): Promise<{ delivered: string[] }> {
  const active = channels.filter((c) => c.enabled());

  if (active.length === 0) {
    // No channel configured yet: keep the form functional and log server-side only.
    console.info("[contact] lead received (no channel configured):", lead.company, lead.area);
    return { delivered: [] };
  }

  const results = await Promise.allSettled(active.map((c) => c.send(lead)));
  const delivered = active.filter((_, i) => results[i]!.status === "fulfilled").map((c) => c.name);

  results.forEach((r, i) => {
    if (r.status === "rejected") console.error(`[contact] ${active[i]!.name} failed:`, r.reason);
  });

  if (delivered.length === 0) throw new Error("All contact channels failed");
  return { delivered };
}
