import { USERS } from "@/lib/account/server";
import { verifyUnsubscribe } from "@/lib/email/unsubscribe";
import { adminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";

export const runtime = "nodejs";

const page = (title: string, body: string) =>
  new Response(
    `<!doctype html><html lang="es"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><body style="font-family:system-ui,sans-serif;background:#fafaf8;color:#0e0e0c;display:grid;place-items:center;min-height:100vh;margin:0;padding:16px"><main style="max-width:420px;text-align:center"><p style="font-family:monospace;letter-spacing:4px">TRIAL</p><h1 style="font-weight:500">${title}</h1><p style="color:#44443e">${body}</p><a href="/" style="color:#3442d9">Volver a TRIAL</a></main></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );

/** GET /api/unsubscribe?u=<uid>&t=<signature> — one-click opt-out from lifecycle emails. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const uid = url.searchParams.get("u") ?? "";
  const token = url.searchParams.get("t") ?? "";

  if (!isFirebaseAdminConfigured() || !verifyUnsubscribe(uid, token)) {
    return page("Enlace no válido", "Este enlace de baja no es válido o expiró.");
  }
  await adminDb().collection(USERS).doc(uid).set({ marketingOptOut: true }, { merge: true });
  return page("Listo, te diste de baja", "No volverás a recibir correos de seguimiento de la demo.");
}
