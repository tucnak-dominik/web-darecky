'use client';

import { useEffect, useState } from 'react';
import { useMode } from '@/components/mode-provider';
import { modeConfig } from '@/lib/mode-config';
import { ConfettiBackground } from './confetti-background';
import { SnowBackground } from './snow-background';
import { SparklesBackground } from './sparkles-background';

export function EffectHost() {
  const { effectiveMode } = useMode();
  const effect = modeConfig[effectiveMode].effect;
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  if (reduced) return null;

  switch (effect) {
    case 'confetti':
      return <ConfettiBackground />;
    case 'sparkles':
      return <SparklesBackground />;
    case 'snow':
      return <SnowBackground />;
  }
}
