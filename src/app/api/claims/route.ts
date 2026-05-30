import { NextResponse } from 'next/server';
import { getAllClaims } from '@/lib/claims-server';
import { claimReadLimiter, getClientIp } from '@/lib/ratelimit';

export const dynamic = 'force-dynamic';

function redisConfigured() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

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
      'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
    },
  });
}
