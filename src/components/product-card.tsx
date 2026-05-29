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
    <button
      type="button"
      onClick={() => onOpen(product)}
      className={[
        'group relative text-left bg-card rounded-2xl overflow-hidden border border-border/40 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all',
        claimed ? 'opacity-60' : '',
      ].join(' ')}
    >
      <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-xs bg-background/80 backdrop-blur-sm border border-border/40">
        {cat.emoji} {cat.label}
      </div>
      {claimed && (
        <div className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full text-xs bg-foreground text-background">
          💝 Zamluveno
        </div>
      )}
      <div className="aspect-[4/3] relative bg-muted">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-medium text-base line-clamp-2">{product.name}</h3>
          <div className="font-mono text-sm text-muted-foreground">
            {priceFmt.format(product.price)} Kč
          </div>
        </div>
        <ClaimButton productId={product.id} />
      </div>
    </button>
  );
}
