import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Dárečky pro Dominika — rodinný wishlist';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'radial-gradient(ellipse at top, #2a1f3d 0%, #14101c 40%, #0a0a0a 100%)',
          color: '#fafafa',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Decorative sparkles in the background */}
        {Array.from({ length: 28 }).map((_, i) => {
          const left = (i * 53) % 100;
          const top = (i * 31) % 100;
          const size = 4 + (i % 6);
          const opacity = 0.25 + ((i * 11) % 60) / 100;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${left}%`,
                top: `${top}%`,
                width: size,
                height: size,
                borderRadius: '50%',
                background: '#fde68a',
                opacity,
                boxShadow: '0 0 10px 2px rgba(253, 230, 138, 0.5)',
              }}
            />
          );
        })}

        {/* Soft accent halo behind the gift */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 280,
            height: 280,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(244,114,182,0.35) 0%, rgba(244,114,182,0) 70%)',
          }}
        />

        {/* Gift emoji */}
        <div
          style={{
            fontSize: 180,
            lineHeight: 1,
            marginBottom: 16,
            filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.6))',
            zIndex: 1,
          }}
        >
          🎁
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 88,
            fontWeight: 700,
            letterSpacing: '-0.025em',
            color: '#ffffff',
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          Dárečky pro Dominika
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 32,
            fontWeight: 400,
            marginTop: 16,
            color: '#a3a3a3',
            zIndex: 1,
          }}
        >
          rodinný wishlist · darečky se nezdvojí
        </div>

        {/* Category emoji row */}
        <div
          style={{
            display: 'flex',
            gap: 28,
            marginTop: 48,
            fontSize: 56,
            zIndex: 1,
          }}
        >
          <span>🍬</span>
          <span>🎁</span>
          <span>🎀</span>
          <span>✨</span>
        </div>

        {/* Domain at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            fontSize: 24,
            fontFamily: 'monospace',
            color: '#6b7280',
            letterSpacing: '0.05em',
            zIndex: 1,
          }}
        >
          dareckyprodominika.cz
        </div>
      </div>
    ),
    { ...size },
  );
}
