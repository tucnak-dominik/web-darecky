import { NextResponse } from 'next/server';
import { getAllClaims } from '@/lib/claims-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const claims = await getAllClaims();
  return NextResponse.json(claims, {
    headers: {
      'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
    },
  });
}
