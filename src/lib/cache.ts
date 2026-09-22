/**
 * In-memory SWR (stale-while-revalidate) cache with single-flight dedupe.
 *
 * - Fresh entry  -> returned immediately, no fetch.
 * - Stale entry  -> returned immediately, ONE background refresh is queued.
 * - No entry     -> callers await the same in-flight promise (no stampede).
 * - Fetch failure -> stale value keeps being served (soft-fail), error logged.
 *
 * On Vercel this lives per warm lambda; combined with the CDN `s-maxage`
 * headers in next.config.mjs it keeps origin traffic (Banguat SOAP, scraper
 * API) to roughly one request per TTL regardless of visitor count.
 */

type CacheEntry<T> = {
  value: T;
  expiresAt: number; // fresh until here
  staleUntil: number; // servable-as-stale until here
};

const store = new Map<string, CacheEntry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

export type CacheOptions = {
  /** How long the value is considered fresh (ms). */
  ttlMs: number;
  /** How long past expiry the value can still be served while revalidating (ms). */
  staleMs?: number;
};

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  { ttlMs, staleMs = ttlMs }: CacheOptions,
): Promise<T> {
  const now = Date.now();
  const entry = store.get(key) as CacheEntry<T> | undefined;

  if (entry && now < entry.expiresAt) {
    return entry.value; // fresh hit
  }

  if (entry && now < entry.staleUntil) {
    // stale hit: serve now, refresh once in the background
    void revalidate(key, fetcher, ttlMs, staleMs).catch(() => {});
    return entry.value;
  }

  // miss (or too stale): await the single-flight fetch
  return revalidate(key, fetcher, ttlMs, staleMs);
}

function revalidate<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number,
  staleMs: number,
): Promise<T> {
  const existing = inflight.get(key) as Promise<T> | undefined;
  if (existing) return existing; // queue onto the in-flight fetch

  const promise = fetcher()
    .then((value) => {
      const now = Date.now();
      store.set(key, {
        value,
        expiresAt: now + ttlMs,
        staleUntil: now + ttlMs + staleMs,
      });
      return value;
    })
    .catch((error) => {
      // On failure, extend the current stale window so we keep serving the
      // last good value instead of erroring every request.
      const entry = store.get(key) as CacheEntry<T> | undefined;
      if (entry) {
        entry.staleUntil = Date.now() + staleMs;
        console.warn(`[cache] revalidate failed for "${key}", serving stale:`, error);
        return entry.value;
      }
      throw error;
    })
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, promise);
  return promise;
}

/** Test/ops helper: drop one key or the whole cache. */
export function invalidateCache(key?: string) {
  if (key) store.delete(key);
  else store.clear();
}
