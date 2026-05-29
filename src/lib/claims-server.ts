import 'server-only';
import { redis } from './redis';

export type ClaimState = { claimedAt: string };
export type AllClaims = Record<string, ClaimState>;

const keyFor = (productId: string) => `claim:${productId}`;

export async function isClaimed(productId: string): Promise<boolean> {
  const v = await redis.get<ClaimState>(keyFor(productId));
  return v !== null && v !== undefined;
}

export async function claimProduct(productId: string): Promise<ClaimState> {
  const state: ClaimState = { claimedAt: new Date().toISOString() };
  await redis.set(keyFor(productId), state);
  return state;
}

export async function unclaimProduct(productId: string): Promise<void> {
  await redis.del(keyFor(productId));
}

export async function getAllClaims(): Promise<AllClaims> {
  const keys = await redis.keys('claim:*');
  if (keys.length === 0) return {};
  const values = await redis.mget<ClaimState[]>(...keys);
  const out: AllClaims = {};
  keys.forEach((k, i) => {
    const id = k.slice('claim:'.length);
    const v = values[i];
    if (v) out[id] = v;
  });
  return out;
}
