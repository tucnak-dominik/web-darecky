'use client';

const SPARKLES = Array.from({ length: 32 }, (_, i) => i);

export function SparklesBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-30"
    >
      {SPARKLES.map((i) => {
        const left = (i * 53) % 100;
        const top = (i * 31) % 100;
        const delay = (i % 8) * 0.5;
        const duration = 3.5 + (i % 5) * 0.6;
        const size = 2 + (i % 5);
        return (
          <span
            key={i}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              animation: `twinkle ${duration}s ease-in-out ${delay}s infinite`,
            }}
            className="absolute rounded-full bg-amber-200/80 shadow-[0_0_6px_2px_rgba(251,191,36,0.35)]"
          />
        );
      })}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.05; transform: scale(0.4); }
          50%      { opacity: 0.7;  transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
