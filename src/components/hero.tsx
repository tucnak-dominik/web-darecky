'use client';

import { modeConfig } from '@/lib/mode-config';
import { useMode } from './mode-provider';

export function Hero() {
  const { effectiveMode } = useMode();
  const cfg = modeConfig[effectiveMode];

  return (
    <section
      id="top"
      className="mx-auto max-w-6xl px-4 pt-12 pb-8 sm:pt-20 sm:pb-12 text-center"
    >
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-balance">
        {cfg.heroTitle}
      </h1>
      <p className="mt-4 text-lg sm:text-xl text-muted-foreground text-balance">
        {cfg.heroSubtitle}
      </p>
    </section>
  );
}
