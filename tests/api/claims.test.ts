import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const store = new Map<string, unknown>();

vi.mock('@/lib/redis', () => ({
  redis: {
    get: vi.fn(async (key: string) => store.get(key) ?? null),
    set: vi.fn(async (key: string, value: unknown) => {
      store.set(key, value);
      return 'OK';
    }),
    del: vi.fn(async (key: string) => {
      const had = store.delete(key);
      return had ? 1 : 0;
    }),
    keys: vi.fn(async (pattern: string) => {
      const prefix = pattern.replace('*', '');
      return [...store.keys()].filter((k) => k.startsWith(prefix));
    }),
    mget: vi.fn(async (...keys: string[]) =>
      keys.map((k) => store.get(k) ?? null),
    ),
  },
}));

import {
  claimProduct,
  getAllClaims,
  isClaimed,
  unclaimProduct,
} from '@/lib/claims-server';

describe('claims server helpers', () => {
  beforeEach(() => store.clear());
  afterEach(() => vi.clearAllMocks());

  it('returns empty object when nothing is claimed', async () => {
    expect(await getAllClaims()).toEqual({});
  });

  it('claims a product', async () => {
    await claimProduct('p1');
    expect(await isClaimed('p1')).toBe(true);
    const all = await getAllClaims();
    expect(all.p1).toBeDefined();
    expect(typeof all.p1.claimedAt).toBe('string');
  });

  it('unclaims a product', async () => {
    await claimProduct('p2');
    await unclaimProduct('p2');
    expect(await isClaimed('p2')).toBe(false);
  });

  it('lists multiple claims', async () => {
    await claimProduct('p1');
    await claimProduct('p2');
    const all = await getAllClaims();
    expect(Object.keys(all).sort()).toEqual(['p1', 'p2']);
  });
});
