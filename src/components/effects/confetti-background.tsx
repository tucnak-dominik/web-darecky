'use client';

import confetti from 'canvas-confetti';
import { useEffect } from 'react';

export function ConfettiBackground() {
  useEffect(() => {
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      confetti({
        particleCount: 3,
        startVelocity: 25,
        spread: 60,
        ticks: 120,
        origin: { x: Math.random(), y: 0 },
        colors: ['#f9a8d4', '#67e8f9', '#fde68a', '#bbf7d0'],
        gravity: 0.6,
        scalar: 0.7,
        disableForReducedMotion: true,
      });
      setTimeout(tick, 600);
    };
    tick();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
