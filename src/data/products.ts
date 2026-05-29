import type { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: 'placeholder-1',
    name: 'Příklad: Krásná knížka',
    description:
      'Tohle je ukázkový produkt — nahraď ho v `src/data/products.ts` reálnými dárky.',
    price: 399,
    category: 'small',
    images: ['/products/_placeholder.png'],
    buyUrl: 'https://example.com',
    addedAt: '2026-05-29',
  },
  {
    id: 'placeholder-2',
    name: 'Příklad: Pohodová mikina',
    description: 'Druhý ukázkový produkt v kategorii Hezký dárek.',
    price: 1290,
    category: 'medium',
    images: ['/products/_placeholder.png'],
    buyUrl: 'https://example.com',
    addedAt: '2026-05-29',
  },
  {
    id: 'placeholder-3',
    name: 'Příklad: Designový stojánek',
    description: 'Třetí ukázkový produkt v kategorii Větší radost.',
    price: 2900,
    category: 'large',
    images: ['/products/_placeholder.png'],
    buyUrl: 'https://example.com',
    addedAt: '2026-05-28',
  },
  {
    id: 'placeholder-4',
    name: 'Příklad: Luxusní sluchátka',
    description: 'Čtvrtý ukázkový produkt v kategorii Splněné přání.',
    price: 8990,
    category: 'premium',
    images: ['/products/_placeholder.png'],
    buyUrl: 'https://example.com',
    addedAt: '2026-05-25',
  },
];
