import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

// Initialize Redis client (uses UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN env vars)
const redis = Redis.fromEnv();

/**
 * Rate limiter for login attempts
 * 5 attempts per 15 minutes per IP
 */
export const loginRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  analytics: true,
  prefix: "ratelimit:login",
});

/**
 * Rate limiter for contact form submissions
 * 3 submissions per hour per IP
 */
export const contactRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  analytics: true,
  prefix: "ratelimit:contact",
});

/**
 * Rate limiter for general API requests
 * 100 requests per minute per IP
 */
export const apiRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"),
  analytics: true,
  prefix: "ratelimit:api",
});

/**
 * Get client IP from request headers
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback for development
  return "127.0.0.1";
}

/**
 * Check if rate limiting is enabled (Upstash configured)
 */
export function isRateLimitEnabled(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

/**
 * Rate limit response with retry-after header
 */
export function rateLimitResponse(resetTime: number): NextResponse {
  const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);

  return NextResponse.json(
    {
      success: false,
      error: "Too many requests. Please try again later.",
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Reset": String(resetTime),
      },
    }
  );
}

/**
 * Apply rate limiting to a request
 * Returns null if allowed, or a Response if rate limited
 */
export async function checkRateLimit(
  ratelimit: Ratelimit,
  identifier: string
): Promise<NextResponse | null> {
  // Skip rate limiting if Upstash is not configured
  if (!isRateLimitEnabled()) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Rate limiting disabled: Upstash not configured");
    }
    return null;
  }

  const { success, reset } = await ratelimit.limit(identifier);

  if (!success) {
    return rateLimitResponse(reset);
  }

  return null;
}
