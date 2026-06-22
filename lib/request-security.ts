import "server-only";

type RateLimit = { limit: number; windowMs: number };

const buckets = new Map<string, { count: number; resetAt: number }>();

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return Boolean(origin && origin === new URL(request.url).origin);
}

export function getClientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export function checkRateLimit(request: Request, scope: string, { limit, windowMs }: RateLimit) {
  const now = Date.now();
  const key = `${scope}:${getClientIp(request)}`;
  const existing = buckets.get(key);
  const bucket = !existing || existing.resetAt <= now
    ? { count: 0, resetAt: now + windowMs }
    : existing;

  bucket.count += 1;
  buckets.set(key, bucket);

  return {
    allowed: bucket.count <= limit,
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  };
}

export async function readJsonBody<T>(request: Request, maxBytes = 12_000): Promise<T> {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > maxBytes) throw new Error("Request body is too large.");

  const text = await request.text();
  if (new TextEncoder().encode(text).length > maxBytes) {
    throw new Error("Request body is too large.");
  }

  return JSON.parse(text) as T;
}
