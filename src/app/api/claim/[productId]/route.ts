import { NextResponse } from 'next/server';
import { products } from '@/data/products';
import {
  claimProduct,
  isClaimed,
  unclaimProduct,
} from '@/lib/claims-server';
import { claimWriteLimiter, getClientIp } from '@/lib/ratelimit';
import { redisConfigured } from '@/lib/redis';

const validIds = new Set(products.map((p) => p.id));

function validate(id: string) {
  if (!validIds.has(id)) {
    return NextResponse.json({ error: 'Unknown product' }, { status: 404 });
  }
  return null;
}

async function gate(req: Request) {
  // Rate-limit only — BotID is intentionally disabled until enabled in the
  // Vercel dashboard. Family wishlist relies on rate-limit + obscure URL.
  if (!redisConfigured()) return null;

  const ip = getClientIp(req);
  const { success, reset } = await claimWriteLimiter.limit(ip);
  if (!success) {
    return NextResponse.json(
      { error: 'Moc rychlé! Zkus to znovu za chvilku.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
        },
      },
    );
  }
  return null;
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ productId: string }> },
) {
  const blocked = await gate(req);
  if (blocked) return blocked;

  const { productId } = await ctx.params;
  const invalid = validate(productId);
  if (invalid) return invalid;

  if (!redisConfigured()) {
    return NextResponse.json(
      { error: 'Reservation backend not configured' },
      { status: 503 },
    );
  }

  if (await isClaimed(productId)) {
    return NextResponse.json({ error: 'Already claimed' }, { status: 409 });
  }
  const state = await claimProduct(productId);
  return NextResponse.json({ productId, ...state });
}

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ productId: string }> },
) {
  const blocked = await gate(req);
  if (blocked) return blocked;

  const { productId } = await ctx.params;
  const invalid = validate(productId);
  if (invalid) return invalid;

  if (!redisConfigured()) {
    return NextResponse.json(
      { error: 'Reservation backend not configured' },
      { status: 503 },
    );
  }

  await unclaimProduct(productId);
  return NextResponse.json({ productId, claimedAt: null });
}
