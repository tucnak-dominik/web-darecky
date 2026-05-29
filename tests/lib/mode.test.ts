import { describe, expect, it } from 'vitest';
import { resolveMode } from '@/lib/mode';

const d = (yyyymmdd: string) => new Date(`${yyyymmdd}T12:00:00+02:00`);

describe('resolveMode', () => {
  it('returns "nameday" on 4.8. itself (event day = mode still active)', () => {
    expect(resolveMode(d('2026-08-04'))).toBe('nameday');
  });

  it('switches to "birthday" on 5.8. (day after nameday)', () => {
    expect(resolveMode(d('2026-08-05'))).toBe('birthday');
  });

  it('returns "birthday" on 9.11. (event day still active)', () => {
    expect(resolveMode(d('2026-11-09'))).toBe('birthday');
  });

  it('switches to "christmas" on 10.11.', () => {
    expect(resolveMode(d('2026-11-10'))).toBe('christmas');
  });

  it('returns "christmas" on 24.12.', () => {
    expect(resolveMode(d('2026-12-24'))).toBe('christmas');
  });

  it('switches to "nameday" on 25.12.', () => {
    expect(resolveMode(d('2026-12-25'))).toBe('nameday');
  });

  it('returns "nameday" deep in January (cycle wraps year)', () => {
    expect(resolveMode(d('2027-01-15'))).toBe('nameday');
  });

  it('returns "nameday" on 3.8. (still before nameday event)', () => {
    expect(resolveMode(d('2026-08-03'))).toBe('nameday');
  });
});
