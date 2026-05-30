import 'server-only';
import { Redis } from '@upstash/redis';

let cached: Redis | null = null;

function getCreds(): { url: string; token: string } | null {
  // Support both Upstash-native (UPSTASH_*) and Vercel-legacy (KV_REST_API_*)
  // env var names so the same code works regardless of which integration
  // shape the Marketplace provisioned.
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}

export function redisConfigured(): boolean {
  return getCreds() !== null;
}

function buildRedis(): Redis {
  const creds = getCreds();
  if (!creds) throw new Error('Upstash/KV env vars not configured');
  return new Redis(creds);
}

export const redis = new Proxy({} as Redis, {
  get(_target, prop) {
    if (!cached) cached = buildRedis();
    return Reflect.get(cached, prop, cached);
  },
});
