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

      // Side bursts — like party poppers from left + right edges
      confetti({
        particleCount: 8,
        angle: 60,
        spread: 70,
        startVelocity: 55,
        ticks: 250,
        origin: { x: 0, y: 0.6 },
        colors: COLORS,
        gravity: 0.8,
        scalar: 1.2,
        shapes: ['circle', 'square'],
        disableForReducedMotion: true,
      });
      confetti({
        particleCount: 8,
        angle: 120,
        spread: 70,
        startVelocity: 55,
        ticks: 250,
        origin: { x: 1, y: 0.6 },
        colors: COLORS,
        gravity: 0.8,
        scalar: 1.2,
        shapes: ['circle', 'square'],
        disableForReducedMotion: true,
      });

      // Every 5 ticks, do a top-of-page rain
      if (frame % 5 === 0) {
        confetti({
          particleCount: 40,
          startVelocity: 25,
          spread: 360,
          ticks: 300,
          origin: { x: 0.5, y: -0.05 },
          colors: COLORS,
          gravity: 0.6,
          scalar: 1.3,
          shapes: ['star', 'circle'],
          disableForReducedMotion: true,
        });
      }

      setTimeout(tick, 700);
    };
    tick();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
