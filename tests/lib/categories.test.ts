import { describe, expect, it } from 'vitest';
import { categories, categoryFor } from '@/lib/categories';

describe('categories', () => {
  it('returns small for price < 500', () => {
    expect(categoryFor(0)).toBe('small');
    expect(categoryFor(499)).toBe('small');
  });

  it('returns medium for 500–1999', () => {
    expect(categoryFor(500)).toBe('medium');
    expect(categoryFor(1999)).toBe('medium');
  });

  it('returns large for 2000–4999', () => {
    expect(categoryFor(2000)).toBe('large');
    expect(categoryFor(4999)).toBe('large');
  });

  it('returns premium for >= 5000', () => {
    expect(categoryFor(5000)).toBe('premium');
    expect(categoryFor(100000)).toBe('premium');
  });

  it('exposes label and emoji for all categories', () => {
    for (const cat of ['small', 'medium', 'large', 'premium'] as const) {
      expect(categories[cat].label).toBeTruthy();
      expect(categories[cat].emoji).toBeTruthy();
    }
  });
});
