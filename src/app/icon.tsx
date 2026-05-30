import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(circle, #2a1f3d 0%, #14101c 60%, #0a0a0a 100%)',
        fontSize: 48,
        borderRadius: 12,
      }}
    >
      🎁
    </div>,
    { ...size },
  );
}
