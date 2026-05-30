import type { Mode } from './mode';

export type ModeConfig = {
  emoji: string;
  label: string;
  heroTitle: string;
  heroSubtitle: string;
  cssClass: `mode-${Mode}`;
  effect: 'confetti' | 'sparkles' | 'snow';
  /** Month (1-12) of the event in this mode. */
  eventMonth: number;
  /** Day of the month (1-31) of the event. */
  eventDay: number;
};

export const modeConfig: Record<Mode, ModeConfig> = {
  birthday: {
    emoji: '🎂',
    label: 'Narozeniny',
    heroTitle: 'Dominik má narozky! 🎂 Tady je inspirace…',
    heroSubtitle: '…na to, co by mu udělalo radost.',
    cssClass: 'mode-birthday',
    effect: 'confetti',
    eventMonth: 11,
    eventDay: 9,
  },
  nameday: {
    emoji: '🎉',
    label: 'Svátek',
    heroTitle: 'Dominik má svátek! 🎉',
    heroSubtitle: 'Tradice je tradice — drobnost potěší.',
    cssClass: 'mode-nameday',
    effect: 'sparkles',
    eventMonth: 8,
    eventDay: 4,
  },
  christmas: {
    emoji: '🎄',
    label: 'Vánoce',
    heroTitle: 'Ho ho ho! 🎄 Vánoce klepou na dveře',
    heroSubtitle: 'Ať se ti tipy hodí pod stromeček.',
    cssClass: 'mode-christmas',
    effect: 'snow',
    eventMonth: 12,
    eventDay: 24,
  },
};
