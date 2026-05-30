'use client';

import { createContext, useContext, useMemo } from 'react';
import { useClaims } from '@/lib/claims-client';
import { useOwner } from './owner-provider';

type ClaimsCtx = ReturnType<typeof useClaims>;

const Ctx = createContext<ClaimsCtx | null>(null);

export function ClaimsProvider({ children }: { children: React.ReactNode }) {
  const raw = useClaims();
  const { isOwner, hasDecided } = useOwner();

  // Mask the claim map when:
  //   1. The visitor opted into surprise mode (`isOwner = true`), OR
  //   2. They haven't decided yet — the popup is overlaid but the page
  //      is rendered behind it and would leak the reservation state.
  const value = useMemo<ClaimsCtx>(() => {
    if (isOwner || !hasDecided) return { ...raw, claims: {} };
    return raw;
  }, [isOwner, hasDecided, raw]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useClaimsContext() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useClaimsContext must be used within ClaimsProvider');
  return v;
}
