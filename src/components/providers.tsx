'use client';

import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
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
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ModeProvider serverMode={serverMode}>{children}</ModeProvider>
    </ThemeProvider>
  );
}
