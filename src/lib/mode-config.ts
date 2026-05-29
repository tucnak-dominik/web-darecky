import type { Mode } from './mode';

export type ModeConfig = {
  emoji: string;
  label: string;
  heroTitle: string;
  heroSubtitle: string;
  cssClass: `mode-${Mode}`;
  effect: 'confetti' | 'sparkles' | 'snow';
};

export const modeConfig: Record<Mode, ModeConfig> = {
  birthday: {
    emoji: '🎂',
    label: 'Narozeniny',
    heroTitle: 'Dominik má narozky! 🎂 Tady je inspirace…',
    heroSubtitle: '…na to, co by mu udělalo radost.',
    cssClass: 'mode-birthday',
    effect: 'confetti',
  },
  nameday: {
    emoji: '🎉',
    label: 'Svátek',
    heroTitle: 'Dominik má svátek! 🎉',
    heroSubtitle: 'Tradice je tradice — drobnost potěší.',
    cssClass: 'mode-nameday',
    effect: 'sparkles',
  },
  christmas: {
    emoji: '🎄',
    label: 'Vánoce',
    heroTitle: 'Ho ho ho! 🎄 Vánoce klepou na dveře',
    heroSubtitle: 'Ať se ti tipy hodí pod stromeček.',
    cssClass: 'mode-christmas',
    effect: 'snow',
  },
};
