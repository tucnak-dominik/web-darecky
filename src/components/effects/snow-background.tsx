'use client';

const FLAKES = Array.from({ length: 40 }, (_, i) => i);

export function SnowBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
    >
      {FLAKES.map((i) => {
        const left = (i * 37) % 100;
        const delay = (i % 10) * 0.7;
        const duration = 8 + (i % 7);
        const size = 6 + (i % 8);
        return (
          <span
            key={i}
            style={{
              left: `${left}%`,
              top: `-10%`,
              width: size,
              height: size,
              animation: `snowfall ${duration}s linear ${delay}s infinite`,
            }}
            className="absolute rounded-full bg-white/70 dark:bg-white/40"
          />
        );
      })}
      <style>{`
        @keyframes snowfall {
          0%   { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          100% { transform: translateY(120vh) translateX(40px) rotate(360deg); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
