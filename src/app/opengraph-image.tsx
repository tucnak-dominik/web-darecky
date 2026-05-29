import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Dárečky pro Dominika';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 80,
        fontWeight: 700,
        background:
          'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fca5a5 100%)',
        color: '#1f2937',
      }}
    >
      <div style={{ fontSize: 120, marginBottom: 24 }}>🎁</div>
      <div>Dárečky pro Dominika</div>
      <div
        style={{
          fontSize: 36,
          fontWeight: 400,
          marginTop: 12,
          opacity: 0.8,
        }}
      >
        Tipy na dárky · Rodinný wishlist
      </div>
    </div>,
    { ...size },
  );
}
