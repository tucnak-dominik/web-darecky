'use client';

import Image from 'next/image';
import { categories } from '@/lib/categories';
import type { Product } from '@/types/product';
import { ClaimButton } from './claim-button';
import { useClaimsContext } from './claims-provider';

type Props = {
  product: Product;
  onOpen: (product: Product) => void;
};

const priceFmt = new Intl.NumberFormat('cs-CZ');

export function ProductCard({ product, onOpen }: Props) {
  const cat = categories[product.category];
  const { claims } = useClaimsContext();
  const claimed = Boolean(claims[product.id]);

  return (
    <article
      className={[
        'group relative bg-card rounded-2xl overflow-hidden border border-border/40 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all',
        'flex flex-col h-full',
        claimed ? 'opacity-60' : '',
      ].join(' ')}
    >
      <div
        className={`absolute top-2 left-2 z-10 px-2.5 py-1 rounded-full text-xs font-medium text-white shadow-md ring-1 ring-black/10 ${cat.accentClass}`}
        style={{
          backgroundColor: 'hsl(var(--cat))',
          textShadow: '0 1px 2px rgba(0,0,0,0.35)',
        }}
      >
        {cat.emoji} {cat.label}
      </div>
      {claimed && (
        <div className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full text-xs bg-foreground text-background">
          💝 Zamluveno
        </div>
      )}

      {/* Single click target for opening the detail modal — image + name + price. */}
      <button
        type="button"
        onClick={() => onOpen(product)}
        className="block text-left grow"
      >
        <div
          className={[
            'aspect-[4/3] relative',
            product.imageFit === 'cover' ? 'bg-muted' : 'bg-zinc-100 p-2',
          ].join(' ')}
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            className={[
              product.imageFit === 'cover' ? 'object-cover' : 'object-contain',
              'group-hover:scale-105 transition-transform duration-500',
            ].join(' ')}
          />
        </div>
        <div className="p-4 pb-2 flex flex-col gap-2">
          <h3 className="font-medium text-base leading-snug line-clamp-3 hyphens-auto break-words">
            {product.name}
          </h3>
          <div className="font-mono text-sm text-muted-foreground">
            {priceFmt.format(product.price)} Kč
          </div>
        </div>
      </button>

      {/* Claim button lives outside the opener button to avoid nested <button>. */}
      <div className="px-4 pb-4 pt-1">
        <ClaimButton productId={product.id} className="w-full" />
      </div>
    </article>
  );
}
