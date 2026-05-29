import type { PriceCategory } from '@/types/product';

export const categories: Record<
  PriceCategory,
  { label: string; emoji: string; accentClass: string }
> = {
  small: { label: 'Drobnost', emoji: '🍬', accentClass: 'accent-mint' },
  medium: { label: 'Hezký dárek', emoji: '🎁', accentClass: 'accent-coral' },
  large: { label: 'Větší radost', emoji: '🎀', accentClass: 'accent-lavender' },
  premium: { label: 'Splněné přání', emoji: '✨', accentClass: 'accent-gold' },
};

export function categoryFor(price: number): PriceCategory {
  if (price < 500) return 'small';
  if (price < 2000) return 'medium';
  if (price < 5000) return 'large';
  return 'premium';
}
