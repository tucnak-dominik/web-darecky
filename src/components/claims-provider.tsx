'use client';

import { createContext, useContext } from 'react';
import { useClaims } from '@/lib/claims-client';

type ClaimsCtx = ReturnType<typeof useClaims>;

const Ctx = createContext<ClaimsCtx | null>(null);

export function ClaimsProvider({ children }: { children: React.ReactNode }) {
  const value = useClaims();
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useClaimsContext() {
  const v = useContext(Ctx);
  if (!v)
    throw new Error('useClaimsContext must be used within ClaimsProvider');
  return v;
}
