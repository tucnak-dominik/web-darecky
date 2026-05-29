import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// `server-only` throws when imported outside a server runtime. Mock as no-op for tests.
vi.mock('server-only', () => ({}));
