'use client';

import { useMemo, useState } from 'react';
import { products as allProducts } from '@/data/products';
import { categories } from '@/lib/categories';
import type { PriceCategory, Product } from '@/types/product';
import { useClaimsContext } from './claims-provider';
import { FilterBar } from './filter-bar';
import { ProductCard } from './product-card';
import { ProductModal } from './product-modal';

const ORDER: PriceCategory[] = ['small', 'medium', 'large', 'premium'];

export function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState<PriceCategory | 'all'>(
    'all',
  );
  const [hideClaimed, setHideClaimed] = useState(false);
  const [openProduct, setOpenProduct] = useState<Product | null>(null);
  const { claims } = useClaimsContext();

  const sections = useMemo(() => {
    return ORDER.map((cat) => ({
      category: cat,
      products: allProducts
        .filter((p) => {
          if (p.category !== cat) return false;
          if (activeCategory !== 'all' && activeCategory !== cat) return false;
          if (hideClaimed && claims[p.id]) return false;
          return true;
        })
        .sort((a, b) => a.price - b.price),
    })).filter((g) => g.products.length > 0);
  }, [activeCategory, hideClaimed, claims]);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <FilterBar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        hideClaimed={hideClaimed}
        onHideClaimedChange={setHideClaimed}
      />

      {sections.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          Tady je prázdno jak v penzijku 💸 — zkus jinou kategorii!
        </div>
      )}

      {sections.map((s) => {
        const c = categories[s.category];
        return (
          <div key={s.category} id={`cat-${s.category}`} className="mt-12 first:mt-8">
            <div className={`mb-5 ${c.accentClass}`}>
              <h2
                className="text-2xl sm:text-3xl font-semibold tracking-tight flex items-baseline gap-3"
                style={{ color: 'hsl(var(--cat))' }}
              >
                <span>
                  {c.emoji} {c.label}
                </span>
                <span className="text-sm font-normal text-muted-foreground">
                  ({s.products.length})
                </span>
              </h2>
              <div
                className="mt-2 h-px w-16"
                style={{ backgroundColor: 'hsl(var(--cat) / 0.6)' }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {s.products.map((p) => (
                <ProductCard key={p.id} product={p} onOpen={setOpenProduct} />
              ))}
            </div>
          </div>
        );
      })}

      <ProductModal
        product={openProduct}
        onClose={() => setOpenProduct(null)}
      />
    </section>
  );
}
