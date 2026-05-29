'use client';

const SPARKLES = Array.from({ length: 30 }, (_, i) => i);

export function SparklesBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
    >
      {SPARKLES.map((i) => {
        const left = (i * 53) % 100;
        const top = (i * 31) % 100;
        const delay = (i % 8) * 0.4;
        const duration = 3 + (i % 4);
        return (
          <span
            key={i}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              animation: `twinkle ${duration}s ease-in-out ${delay}s infinite`,
            }}
            className="absolute size-1.5 rounded-full bg-amber-300/80 shadow-[0_0_8px_2px_rgba(251,191,36,0.6)]"
          />
        );
      })}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(0.6); }
          50%      { opacity: 1;   transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
