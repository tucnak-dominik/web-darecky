'use client';

const FLAKES = Array.from({ length: 90 }, (_, i) => i);

export function SnowBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-30"
    >
      {FLAKES.map((i) => {
        const left = (i * 41) % 100;
        const delay = (i % 12) * 0.6;
        const duration = 7 + (i % 9);
        const size = 5 + (i % 11);
        const opacity = 0.5 + ((i * 7) % 50) / 100;
        const drift = ((i * 13) % 80) - 40;
        return (
          <span
            key={i}
            style={{
              left: `${left}%`,
              top: '-5%',
              width: size,
              height: size,
              opacity,
              animation: `snowfall ${duration}s linear ${delay}s infinite`,
              ['--drift' as string]: `${drift}px`,
            }}
            className="absolute rounded-full bg-white shadow-[0_0_4px_rgba(255,255,255,0.7)]"
          />
        );
      })}
      <style>{`
        @keyframes snowfall {
          0%   { transform: translateY(0) translateX(0) rotate(0deg); }
          100% { transform: translateY(110vh) translateX(var(--drift, 0)) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
