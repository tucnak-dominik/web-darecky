'use client';

import type { ReactNode } from 'react';
import { ClaimsProvider } from '@/components/claims-provider';
import { ModeProvider } from '@/components/mode-provider';
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
      <ClaimsProvider>{children}</ClaimsProvider>
    </ModeProvider>
  );
}
