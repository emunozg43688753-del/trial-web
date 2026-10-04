import { dispatchLead } from "@/lib/contact/dispatch";
import { createRateLimiter, getClientIp, isSameOrigin } from "@/lib/utils/rate-limit";
import { contactSchema } from "@/lib/validation/schemas";

export const runtime = "nodejs";

const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60_000 });

export async function POST(request: Request) {
  if (!isSameOrigin(request.headers)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const rate = await limiter(getClientIp(request.headers));
  if (!rate.ok) {
    return Response.json(
      { error: "Has enviado varias solicitudes. Intenta más tarde." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return Response.json({ error: "Revisa los campos marcados.", fieldErrors }, { status: 422 });
  }

  // Honeypot filled → silently accept without processing.
  if (parsed.data.website) return Response.json({ ok: true });

  const { website: _honeypot, ...lead } = parsed.data;
  void _honeypot;

  try {
    await dispatchLead(lead);
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { error: "No pudimos enviar tu mensaje. Escríbenos directamente por email." },
      { status: 502 },
    );
  }
}
