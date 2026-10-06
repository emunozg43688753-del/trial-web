import "server-only";
import { sendEmail } from "@/lib/email/send";
import { ownerNewSignupEmail } from "@/lib/email/templates";

/**
 * Tells the business about high-intent events (new signup, booking click…)
 * through every configured channel. Never throws: growth signals must not
 * break the user's flow.
 */
export async function notifyOwner(event: string, lead: Record<string, string>) {
  const tasks: Promise<unknown>[] = [];

  if (process.env.CONTACT_WEBHOOK_URL) {
    tasks.push(
      fetch(process.env.CONTACT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "trial-web", event, at: new Date().toISOString(), lead }),
      }),
    );
  }

  if (event === "signup" && process.env.CONTACT_TO_EMAIL) {
    const mail = ownerNewSignupEmail(lead);
    tasks.push(sendEmail({ to: process.env.CONTACT_TO_EMAIL, ...mail, replyTo: lead.email }));
  }

  const results = await Promise.allSettled(tasks);
  results.forEach((r) => r.status === "rejected" && console.error(`[notify] ${event} failed:`, r.reason));
}
