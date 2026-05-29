'use client';

import { useCallback, useEffect, useState } from 'react';

export type ClaimMap = Record<string, { claimedAt: string }>;

export function useClaims() {
  const [claims, setClaims] = useState<ClaimMap>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/claims', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load claims');
      const data = (await res.json()) as ClaimMap;
      setClaims(data);
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
      const res = await fetch(`/api/claim/${productId}`, { method: 'POST' });
      if (!res.ok) await refresh();
    },
    [refresh],
  );

  const unclaim = useCallback(
    async (productId: string) => {
      setClaims((c) => {
        const { [productId]: _removed, ...rest } = c;
        return rest;
      });
      const res = await fetch(`/api/claim/${productId}`, { method: 'DELETE' });
      if (!res.ok) await refresh();
    },
    [refresh],
  );

  return { claims, loading, refresh, claim, unclaim };
}
