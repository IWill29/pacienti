const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;

const buckets = new Map<string, number[]>();

/** Simple in-memory sliding-window rate limiter. Returns true when allowed. */
export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter(
    (timestamp) => now - timestamp < WINDOW_MS,
  );

  if (recent.length >= MAX_REQUESTS) {
    buckets.set(key, recent);
    return false;
  }

  recent.push(now);
  buckets.set(key, recent);
  return true;
}
