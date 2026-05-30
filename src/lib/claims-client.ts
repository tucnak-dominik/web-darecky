'use client';

import { useCallback, useEffect, useState } from 'react';

export type ClaimMap = Record<string, { claimedAt: string }>;

export function useClaims() {
  const [claims, setClaims] = useState<ClaimMap>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/claims', { cache: 'no-store' });
      if (!res.ok) {
        // 500 (Redis not configured locally) or 429 — non-fatal, keep current state.
        return;
      }
      const data = (await res.json()) as ClaimMap;
      setClaims(data);
    } catch (err) {
      console.warn('[claims] refresh failed', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const onFocus = () => refresh();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refresh]);

  const claim = useCallback(
    async (productId: string) => {
      setClaims((c) => ({
        ...c,
        [productId]: { claimedAt: new Date().toISOString() },
      }));
      try {
        const res = await fetch(`/api/claim/${productId}`, { method: 'POST' });
        if (!res.ok) await refresh();
      } catch (err) {
        console.warn('[claims] claim failed', err);
      }
    },
    [refresh],
  );

  const unclaim = useCallback(
    async (productId: string) => {
      setClaims((c) => {
        const { [productId]: _removed, ...rest } = c;
        return rest;
      });
      try {
        const res = await fetch(`/api/claim/${productId}`, {
          method: 'DELETE',
        });
        if (!res.ok) await refresh();
      } catch (err) {
        console.warn('[claims] unclaim failed', err);
      }
    },
    [refresh],
  );

  return { claims, loading, refresh, claim, unclaim };
}
