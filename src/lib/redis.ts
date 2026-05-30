import 'server-only';
import { Redis } from '@upstash/redis';

let cached: Redis | null = null;

function buildRedis(): Redis {
  // Falls back to a dummy when env vars are missing — callers must check
  // `redisConfigured()` before invoking any real method during local dev
  // without an Upstash instance.
  return Redis.fromEnv();
}

export const redis = new Proxy({} as Redis, {
  get(_target, prop) {
    if (!cached) cached = buildRedis();
    return Reflect.get(cached, prop, cached);
  },
});
