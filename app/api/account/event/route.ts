import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import { jsonError, requireUser, USERS } from "@/lib/account/server";
import { adminDb } from "@/lib/firebase/admin";
import { notifyOwner } from "@/lib/growth/notify";

export const runtime = "nodejs";

const schema = z.object({
  type: z.enum(["agent_tested", "booking_clicked", "whatsapp_clicked", "upgrade_viewed"]),
  agentId: z.string().max(60).optional(),
});

/**
 * POST /api/account/event — records buying signals on the user profile so
 * sales can prioritise follow-up (and alerts the owner on booking intent).
 */
export async function POST(request: Request) {
  try {
    const user = await requireUser(request);
    const parsed = schema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return Response.json({ error: "Solicitud inválida" }, { status: 400 });
    const { type, agentId } = parsed.data;

    const ref = adminDb().collection(USERS).doc(user.uid);
    const update: Record<string, unknown> = {
      [`intents.${type}`]: FieldValue.increment(1),
      lastIntentAt: FieldValue.serverTimestamp(),
    };
    if (type === "agent_tested" && agentId) update.testedAgents = FieldValue.arrayUnion(agentId);
    if (type === "booking_clicked" || type === "whatsapp_clicked") update["intents.booking"] = FieldValue.increment(1);
    await ref.update(update);

    if (type === "booking_clicked" || type === "whatsapp_clicked") {
      await notifyOwner("high_intent", { email: user.email ?? "", uid: user.uid, action: type });
    }
    return Response.json({ ok: true });
  } catch (error) {
    return jsonError(error);
  }
}
