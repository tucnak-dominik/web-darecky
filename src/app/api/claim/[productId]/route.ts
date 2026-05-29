import { NextResponse } from 'next/server';
import { products } from '@/data/products';
import { claimProduct, isClaimed, unclaimProduct } from '@/lib/claims-server';

const validIds = new Set(products.map((p) => p.id));

function validate(id: string) {
  if (!validIds.has(id)) {
    return NextResponse.json({ error: 'Unknown product' }, { status: 404 });
  }
  return null;
}

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ productId: string }> },
) {
  const { productId } = await ctx.params;
  const invalid = validate(productId);
  if (invalid) return invalid;

  if (await isClaimed(productId)) {
    return NextResponse.json({ error: 'Already claimed' }, { status: 409 });
  }
  const state = await claimProduct(productId);
  return NextResponse.json({ productId, ...state });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ productId: string }> },
) {
  const { productId } = await ctx.params;
  const invalid = validate(productId);
  if (invalid) return invalid;

  await unclaimProduct(productId);
  return NextResponse.json({ productId, claimedAt: null });
}
