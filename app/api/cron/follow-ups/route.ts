import { FieldValue, type Timestamp } from "firebase-admin/firestore";
import { USERS } from "@/lib/account/server";
import { isEmailConfigured, sendEmail } from "@/lib/email/send";
import { day1Email, day2Email, day3Email } from "@/lib/email/templates";
import { unsubscribeUrl } from "@/lib/email/unsubscribe";
import { adminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const maxDuration = 60;

const HOUR = 3_600_000;
type Step = "day1" | "day2" | "day3";

/** Picks the most advanced step that is due and not sent yet (never sends stale steps). */
function dueStep(createdAt: number, trialEndsAt: number, sent: Record<string, unknown>, now: number): Step | null {
  if (now >= trialEndsAt) return sent.day3 ? null : "day3";
  if (now - createdAt >= 44 * HOUR) return sent.day2 ? null : "day2";
  if (now - createdAt >= 20 * HOUR) return sent.day1 || sent.day2 ? null : "day1";
  return null;
}

const templates = { day1: day1Email, day2: day2Email, day3: day3Email };

/**
 * GET /api/cron/follow-ups — runs daily via Vercel Cron (see vercel.json).
 * Sends the demo lifecycle sequence: day 1 tips → day 2 last day → day 3 offer.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isFirebaseAdminConfigured() || !isEmailConfigured()) {
    return Response.json({ skipped: "Firebase Admin o Resend no configurados" });
  }

  const now = Date.now();
  const snap = await adminDb().collection(USERS).where("plan", "==", "trial").limit(500).get();
  const summary = { checked: snap.size, sent: 0, failed: 0 };

  for (const doc of snap.docs) {
    const d = doc.data();
    if (d.marketingOptOut || !d.email) continue;
    const created = (d.createdAt as Timestamp | undefined)?.toMillis() ?? now;
    const ends = (d.trialEndsAt as Timestamp | undefined)?.toMillis() ?? now;
    const step = dueStep(created, ends, d.emailsSent ?? {}, now);
    if (!step) continue;

    try {
      const mail = templates[step]({ name: d.name ?? "", trialEndsAt: new Date(ends), unsubscribeUrl: unsubscribeUrl(doc.id) });
      await sendEmail({ to: d.email, ...mail });
      const update: Record<string, unknown> = { [`emailsSent.${step}`]: FieldValue.serverTimestamp() };
      // Mark skipped earlier steps so they are never sent late.
      if (step !== "day1" && !d.emailsSent?.day1) update["emailsSent.day1"] = "skipped";
      if (step === "day3" && !d.emailsSent?.day2) update["emailsSent.day2"] = "skipped";
      await doc.ref.update(update);
      summary.sent++;
    } catch (error) {
      summary.failed++;
      console.error(`[cron] ${step} for ${doc.id} failed:`, error);
    }
  }

  return Response.json(summary);
}
