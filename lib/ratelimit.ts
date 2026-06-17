import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { HttpError } from "@/lib/api";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

// Without Upstash credentials (e.g. local dev), `redis` is null and every check
// fails open — the app keeps working, just unthrottled. Set both env vars in
// production to switch limiting on. See docs/deployment-guide.md.
const redis = url && token ? new Redis({ url, token }) : null;

// Shared in-memory cache so bursts from a single instance short-circuit before
// hitting Redis. Must live outside any request handler.
const cache = new Map<string, number>();

type Algorithm = ReturnType<typeof Ratelimit.slidingWindow>;
type Limiter = Ratelimit | null;

function make(limiter: Algorithm, prefix: string): Limiter {
  return redis
    ? new Ratelimit({ redis, limiter, prefix, analytics: true, ephemeralCache: cache })
    : null;
}

export const leadsLimiter = make(Ratelimit.slidingWindow(5, "10 m"), "rl:leads");
export const registerLimiter = make(Ratelimit.slidingWindow(5, "1 h"), "rl:register");
export const loginLimiter = make(Ratelimit.slidingWindow(10, "1 h"), "rl:login");
export const endorsementLimiter = make(
  Ratelimit.slidingWindow(10, "1 h"),
  "rl:endorse",
);
export const quoteLimiter = make(Ratelimit.slidingWindow(5, "1 h"), "rl:quote");

/**
 * Throws HttpError(429) when `identifier` has exhausted `limiter`. No-ops when
 * the limiter is null (Upstash not configured). Use inside route try-blocks so
 * the centralized errorResponse maps it to a 429.
 */
export async function enforceLimit(
  limiter: Limiter,
  identifier: string,
): Promise<void> {
  if (!limiter) return;
  const { success } = await limiter.limit(identifier);
  if (!success) {
    throw new HttpError(429, "Too many requests. Please slow down and try again later.");
  }
}

/** Best-effort client IP from proxy headers (Vercel sets `x-forwarded-for`). */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}
