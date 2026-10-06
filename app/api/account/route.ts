import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import { getOrCreateAccount, jsonError, requireUser, USERS } from "@/lib/account/server";
import { sendEmail } from "@/lib/email/send";
import { welcomeEmail } from "@/lib/email/templates";
import { unsubscribeUrl } from "@/lib/email/unsubscribe";
import { adminDb } from "@/lib/firebase/admin";
import { notifyOwner } from "@/lib/growth/notify";

export const runtime = "nodejs";

const str = (max: number) => z.string().max(max).optional();

const bootstrapSchema = z.object({
  profile: z.object({ name: str(120), company: str(160), phone: str(40), area: str(60) }).optional(),
  attribution: z.record(z.string(), z.string().max(300)).optional(),
});

/** GET /api/account — current user's account. */
export async function GET(request: Request) {
  try {
    const user = await requireUser(request);
    const { account } = await getOrCreateAccount(user);
    return Response.json({ account });
  } catch (error) {
    return jsonError(error);
  }
}

/**
 * POST /api/account — idempotent bootstrap after login/register.
 * On first call it starts the 3-day demo, sends the welcome email and alerts sales.
 */
export async function POST(request: Request) {
  try {
    const user = await requireUser(request);
    const body = bootstrapSchema.safeParse(await request.json().catch(() => ({})));
    const input = body.success ? body.data : {};

    const { account, created } = await getOrCreateAccount(user, input.profile, input.attribution);

    if (created) {
      const followUp = async () => {
        const mail = welcomeEmail({
          name: account.name,
          trialEndsAt: new Date(account.trialEndsAt),
          unsubscribeUrl: unsubscribeUrl(account.uid),
        });
        const sent = await sendEmail({ to: account.email, ...mail }).catch((e) => {
          console.error("[account] welcome email failed:", e);
          return false;
        });
        if (sent) {
          await adminDb().collection(USERS).doc(account.uid).update({ "emailsSent.welcome": FieldValue.serverTimestamp() });
        }
      };

      await Promise.allSettled([
        followUp(),
        notifyOwner("signup", {
          name: account.name,
          email: account.email,
          company: account.company,
          phone: account.phone,
          area: account.area,
          source: input.attribution?.utm_source ?? input.attribution?.referrer ?? "directo",
          campaign: input.attribution?.utm_campaign ?? "",
        }),
      ]);
    }

    return Response.json({ account, created });
  } catch (error) {
    return jsonError(error);
  }
}
