'use client';

import confetti from 'canvas-confetti';
import { useEffect } from 'react';

const COLORS = ['#f472b6', '#22d3ee', '#fde047', '#86efac', '#c084fc', '#fb923c'];

export function ConfettiBackground() {
  useEffect(() => {
    let cancelled = false;
    let frame = 0;

    const tick = () => {
      if (cancelled) return;
      frame++;

      // Gentle side bursts — like distant party poppers
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 60,
        startVelocity: 40,
        ticks: 200,
        origin: { x: 0, y: 0.7 },
        colors: COLORS,
        gravity: 0.8,
        scalar: 0.9,
        shapes: ['circle', 'square'],
        disableForReducedMotion: true,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 60,
        startVelocity: 40,
        ticks: 200,
        origin: { x: 1, y: 0.7 },
        colors: COLORS,
        gravity: 0.8,
        scalar: 0.9,
        shapes: ['circle', 'square'],
        disableForReducedMotion: true,
      });

      // Occasional top rain — sparser & calmer
      if (frame % 10 === 0) {
        confetti({
          particleCount: 18,
          startVelocity: 20,
          spread: 360,
          ticks: 280,
          origin: { x: 0.5, y: -0.05 },
          colors: COLORS,
          gravity: 0.55,
          scalar: 1,
          shapes: ['star', 'circle'],
          disableForReducedMotion: true,
        });
      }

      setTimeout(tick, 1200);
    };
    tick();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
