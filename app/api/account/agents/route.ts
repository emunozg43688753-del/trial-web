import { z } from "zod";
import { growthConfig } from "@/config/growth";
import { demoAgentIds } from "@/data/sales-agents";
import { jsonError, requireUser, serializeAccount, statusOf, USERS } from "@/lib/account/server";
import { adminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";

const schema = z.object({ agentId: z.string().max(60), active: z.boolean() });

/** POST /api/account/agents — activate/deactivate a sales agent within the demo rules. */
export async function POST(request: Request) {
  try {
    const user = await requireUser(request);
    const parsed = schema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return Response.json({ error: "Solicitud inválida" }, { status: 400 });
    const { agentId, active } = parsed.data;

    const ref = adminDb().collection(USERS).doc(user.uid);
    const result = await adminDb().runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) return { status: 404 as const, error: "Cuenta no encontrada" };
      const data = snap.data()!;
      const status = statusOf(data);
      const current: string[] = Array.isArray(data.activatedAgents) ? data.activatedAgents : [];

      if (status === "expired") return { status: 403 as const, error: "Tu demo terminó. Habla con ventas para reactivar tus agentes." };
      if (status === "trial" && active && !demoAgentIds.has(agentId)) {
        return { status: 403 as const, error: "Este agente está disponible en el plan completo." };
      }
      if (status === "trial" && active && !current.includes(agentId) && current.length >= growthConfig.maxDemoAgents) {
        return { status: 409 as const, error: `En la demo puedes tener ${growthConfig.maxDemoAgents} agentes activos a la vez.` };
      }

      const next = active ? Array.from(new Set([...current, agentId])) : current.filter((id) => id !== agentId);
      tx.update(ref, { activatedAgents: next });
      return { status: 200 as const, account: serializeAccount(user.uid, { ...data, activatedAgents: next }) };
    });

    if (result.status !== 200) return Response.json({ error: result.error }, { status: result.status });
    return Response.json({ account: result.account });
  } catch (error) {
    return jsonError(error);
  }
}
