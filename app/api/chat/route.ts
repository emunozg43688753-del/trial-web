import { getProvider, isDemoMode } from "@/lib/ai/provider";
import { createDemoProvider } from "@/lib/ai/providers/demo";
import { TRIAL_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import type { LLMProvider } from "@/lib/ai/types";
import { createRateLimiter, getClientIp, isSameOrigin } from "@/lib/utils/rate-limit";
import { CHAT_LIMITS, chatRequestSchema } from "@/lib/validation/schemas";

export const runtime = "nodejs";
export const maxDuration = 60;

const limiter = createRateLimiter({ limit: 20, windowMs: 60_000 });

function jsonError(message: string, status: number, extra?: HeadersInit) {
  return Response.json({ error: message }, { status, headers: extra });
}

/** Health check — lets you verify the endpoint after deploying. */
export async function GET() {
  return Response.json({
    status: "ok",
    mode: isDemoMode() ? "demo" : "live",
  });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request.headers)) return jsonError("Forbidden", 403);

  const rate = await limiter(getClientIp(request.headers));
  if (!rate.ok) {
    const retryAfter = Math.ceil((rate.resetAt - Date.now()) / 1000);
    return jsonError("Demasiadas solicitudes. Intenta de nuevo en unos segundos.", 429, {
      "Retry-After": String(retryAfter),
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Solicitud inválida.", 400);
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) return jsonError("Solicitud inválida.", 400);

  const messages = parsed.data.messages.slice(-CHAT_LIMITS.maxMessages);

  // Resolve the first chunk before committing to a response so an upstream
  // failure can degrade gracefully to demo intelligence instead of an error.
  const start = async (provider: LLMProvider) => {
    const iterator = provider
      .streamChat({ system: TRIAL_SYSTEM_PROMPT, messages, signal: request.signal })
      [Symbol.asyncIterator]();
    const first = await iterator.next();
    return { iterator, first };
  };

  let provider = getProvider();
  let session: Awaited<ReturnType<typeof start>>;
  try {
    session = await start(provider);
  } catch (error) {
    console.error("[chat] provider failed, falling back to demo:", error instanceof Error ? error.message : error);
    provider = createDemoProvider();
    session = await start(provider);
  }

  const encoder = new TextEncoder();
  const { iterator, first } = session;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        if (!first.done && first.value) controller.enqueue(encoder.encode(first.value));
        if (!first.done) {
          while (true) {
            const { value, done } = await iterator.next();
            if (done) break;
            controller.enqueue(encoder.encode(value));
          }
        }
        controller.close();
      } catch (error) {
        if (request.signal.aborted) return controller.close();
        console.error("[chat] stream interrupted:", error instanceof Error ? error.message : error);
        controller.error(error);
      }
    },
    async cancel() {
      await iterator.return?.();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Trial-Mode": provider.mode,
      "X-RateLimit-Remaining": String(rate.remaining),
    },
  });
}
