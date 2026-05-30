'use client';

import type { ReactNode } from 'react';
import { ClaimsProvider } from '@/components/claims-provider';
import { ModeProvider } from '@/components/mode-provider';
import { OwnerProvider } from '@/components/owner-provider';
import type { Mode } from '@/lib/mode';

export function Providers({
  children,
  serverMode,
}: {
  children: ReactNode;
  serverMode: Mode;
}) {
  return (
    <ModeProvider serverMode={serverMode}>
      <OwnerProvider>
        <ClaimsProvider>{children}</ClaimsProvider>
      </OwnerProvider>
    </ModeProvider>
  );
}
