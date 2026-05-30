import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// `server-only` throws when imported outside a server runtime. Mock as no-op for tests.
vi.mock('server-only', () => ({}));

// Pretend Upstash is configured so server-side helpers exercise the real code path.
// The `redis` import is itself mocked per-test, so these values are never used to connect.
process.env.UPSTASH_REDIS_REST_URL = 'http://test-redis';
process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
