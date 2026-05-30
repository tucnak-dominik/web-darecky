'use client';

import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { categories } from '@/lib/categories';
import type { Product } from '@/types/product';
import { ClaimButton } from './claim-button';

type Props = {
  product: Product | null;
  onClose: () => void;
};

const priceFmt = new Intl.NumberFormat('cs-CZ');

export function ProductModal({ product, onClose }: Props) {
  const open = product !== null;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent
        className="
          p-0 overflow-hidden gap-0
          sm:!max-w-2xl sm:rounded-xl
          max-sm:!left-0 max-sm:!right-0 max-sm:!top-auto max-sm:!bottom-0
          max-sm:!translate-x-0 max-sm:!translate-y-0
          max-sm:!w-full max-sm:!max-w-none
          max-sm:!rounded-t-2xl max-sm:!rounded-b-none
        "
      >
        {product && (
          <>
            <div
              className={[
                'relative aspect-[4/3] w-full',
                product.imageFit === 'cover' ? 'bg-muted' : 'bg-zinc-100 p-4',
              ].join(' ')}
            >
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(min-width:640px) 640px, 100vw"
                className={
                  product.imageFit === 'cover'
                    ? 'object-cover'
                    : 'object-contain'
                }
                priority
              />
            </div>
            <div className="p-6 space-y-4">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-xs border border-border/60">
                    {categories[product.category].emoji}{' '}
                    {categories[product.category].label}
                  </span>
                </div>
                <DialogTitle className="text-2xl">{product.name}</DialogTitle>
                <DialogDescription className="font-mono text-lg text-foreground">
                  {priceFmt.format(product.price)} Kč
                </DialogDescription>
              </DialogHeader>
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
              <div className="flex flex-wrap gap-2 justify-end pt-2">
                <ClaimButton productId={product.id} />
                <Button variant="ghost" onClick={onClose}>
                  Zavřít
                </Button>
                <a
                  href={product.buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  🛒 Koupit u prodejce <ExternalLink className="size-4" />
                </a>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
