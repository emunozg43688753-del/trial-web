import "server-only";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

const FROM = () => process.env.EMAIL_FROM ?? process.env.CONTACT_FROM_EMAIL ?? "TRIAL <onboarding@resend.dev>";

/** Sends a transactional email through Resend's HTTP API. Returns false when not configured. */
export async function sendEmail(input: { to: string; subject: string; html: string; replyTo?: string }): Promise<boolean> {
  if (!isEmailConfigured() || !input.to) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM(),
      to: [input.to],
      subject: input.subject,
      html: input.html,
      reply_to: input.replyTo ?? process.env.CONTACT_TO_EMAIL,
    }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}`);
  return true;
}
