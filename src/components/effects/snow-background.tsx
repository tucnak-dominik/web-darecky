'use client';

const FLAKES = Array.from({ length: 50 }, (_, i) => i);

export function SnowBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-30"
    >
      {FLAKES.map((i) => {
        const left = (i * 41) % 100;
        const delay = (i % 12) * 0.7;
        const duration = 10 + (i % 11);
        const size = 3 + (i % 7);
        const opacity = 0.25 + ((i * 7) % 35) / 100;
        const drift = ((i * 13) % 60) - 30;
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
            className="absolute rounded-full bg-white shadow-[0_0_3px_rgba(255,255,255,0.4)]"
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
