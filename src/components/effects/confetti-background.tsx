'use client';

import confetti from 'canvas-confetti';
import { useEffect } from 'react';

export function ConfettiBackground() {
  useEffect(() => {
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      // Two simultaneous bursts from random horizontal positions, like
      // someone is popping party poppers all over the page.
      confetti({
        particleCount: 12,
        startVelocity: 35,
        spread: 70,
        ticks: 200,
        origin: { x: Math.random(), y: -0.05 },
        colors: ['#f472b6', '#22d3ee', '#fde047', '#86efac', '#c084fc'],
        gravity: 0.7,
        scalar: 1.1,
        shapes: ['circle', 'square', 'star'],
        disableForReducedMotion: true,
      });
      setTimeout(tick, 320);
    };
    tick();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
