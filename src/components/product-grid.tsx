'use client';

import { useMemo, useState } from 'react';
import { products as allProducts } from '@/data/products';
import type { PriceCategory, Product } from '@/types/product';
import { FilterBar } from './filter-bar';
import { ProductCard } from './product-card';
import { ProductModal } from './product-modal';

export function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState<PriceCategory | 'all'>(
    'all',
  );
  const [hideClaimed, setHideClaimed] = useState(false);
  const [openProduct, setOpenProduct] = useState<Product | null>(null);

  const sorted = useMemo(
    () =>
      [...allProducts].sort((a, b) =>
        a.addedAt < b.addedAt ? 1 : a.addedAt > b.addedAt ? -1 : 0,
      ),
    [],
  );

  const filtered = useMemo(
    () =>
      sorted.filter(
        (p) => activeCategory === 'all' || p.category === activeCategory,
      ),
    [sorted, activeCategory],
  );

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <FilterBar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        hideClaimed={hideClaimed}
        onHideClaimedChange={setHideClaimed}
      />

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} onOpen={setOpenProduct} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          Tady je prázdno jak v penzijku 💸 — zkus jinou kategorii!
        </div>
      )}

      <ProductModal
        product={openProduct}
        onClose={() => setOpenProduct(null)}
      />
    </section>
  );
}
