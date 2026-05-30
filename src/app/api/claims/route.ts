import { NextResponse } from 'next/server';
import { getAllClaims } from '@/lib/claims-server';
import { claimReadLimiter, getClientIp } from '@/lib/ratelimit';
import { redisConfigured } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (redisConfigured()) {
    const ip = getClientIp(req);
    const { success } = await claimReadLimiter.limit(ip);
    if (!success) {
      return NextResponse.json({ error: 'rate-limited' }, { status: 429 });
    }
  }

  const claims = await getAllClaims();
  return NextResponse.json(claims, {
    headers: {
      // No caching: family wishlist needs near-real-time state, and a stale
      // claim makes someone buy a duplicate gift. Read latency is fine here.
      'Cache-Control': 'no-store',
    },
  });
}
