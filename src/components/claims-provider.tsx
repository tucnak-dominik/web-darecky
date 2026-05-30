'use client';

import { createContext, useContext, useMemo } from 'react';
import { useClaims } from '@/lib/claims-client';
import { useOwner } from './owner-provider';

type ClaimsCtx = ReturnType<typeof useClaims>;

const Ctx = createContext<ClaimsCtx | null>(null);

export function ClaimsProvider({ children }: { children: React.ReactNode }) {
  const raw = useClaims();
  const { isOwner } = useOwner();

  // In owner mode the recipient must not see who has claimed what — mask out
  // the claim map entirely so every product appears unclaimed.
  const value = useMemo<ClaimsCtx>(() => {
    if (!isOwner) return raw;
    return { ...raw, claims: {} };
  }, [isOwner, raw]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useClaimsContext() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useClaimsContext must be used within ClaimsProvider');
  return v;
}
