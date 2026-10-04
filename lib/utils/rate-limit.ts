/**
 * Fixed-window rate limiter.
 *
 * The in-memory store protects against basic abuse and works on a single
 * instance. Serverless platforms run many instances, so for production
 * implement `RateLimitStore` with a shared backend (Upstash Redis, Vercel KV…)
 * and pass it to `createRateLimiter`.
 */
export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetAt: number;
}

export interface RateLimitStore {
  hit(key: string, windowMs: number): Promise<{ count: number; resetAt: number }>;
}

class MemoryStore implements RateLimitStore {
  private buckets = new Map<string, { count: number; resetAt: number }>();

  async hit(key: string, windowMs: number) {
    const now = Date.now();
    const bucket = this.buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      const fresh = { count: 1, resetAt: now + windowMs };
      this.buckets.set(key, fresh);
      this.sweep(now);
      return fresh;
    }
    bucket.count += 1;
    return bucket;
  }

  private sweep(now: number) {
    if (this.buckets.size < 5_000) return;
    for (const [k, v] of this.buckets) if (v.resetAt <= now) this.buckets.delete(k);
  }
}

export function createRateLimiter(options: {
  limit: number;
  windowMs: number;
  store?: RateLimitStore;
}) {
  const store = options.store ?? new MemoryStore();
  return async (key: string): Promise<RateLimitResult> => {
    const { count, resetAt } = await store.hit(key, options.windowMs);
    return {
      ok: count <= options.limit,
      remaining: Math.max(0, options.limit - count),
      resetAt,
    };
  };
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "anonymous";
}

/** Rejects cross-site browser requests. Non-browser clients send no Origin and pass. */
export function isSameOrigin(headers: Headers): boolean {
  const origin = headers.get("origin");
  if (!origin) return true;
  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
