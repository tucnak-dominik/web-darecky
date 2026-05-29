'use client';

import { Switch } from '@/components/ui/switch';
import { categories } from '@/lib/categories';
import type { PriceCategory } from '@/types/product';

type Props = {
  activeCategory: PriceCategory | 'all';
  onCategoryChange: (c: PriceCategory | 'all') => void;
  hideClaimed: boolean;
  onHideClaimedChange: (v: boolean) => void;
};

const ORDER: PriceCategory[] = ['small', 'medium', 'large', 'premium'];

export function FilterBar({
  activeCategory,
  onCategoryChange,
  hideClaimed,
  onHideClaimedChange,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex flex-wrap gap-2">
        <PillButton
          active={activeCategory === 'all'}
          onClick={() => onCategoryChange('all')}
        >
          Vše
        </PillButton>
        {ORDER.map((c) => (
          <PillButton
            key={c}
            active={activeCategory === c}
            onClick={() => onCategoryChange(c)}
          >
            {categories[c].emoji} {categories[c].label}
          </PillButton>
        ))}
      </div>
      <div className="inline-flex items-center gap-2 text-sm">
        <Switch
          checked={hideClaimed}
          onCheckedChange={onHideClaimedChange}
          aria-label="Skrýt zamluvené"
        />
        <span>Skrýt zamluvené</span>
      </div>
    </div>
  );
}

function PillButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'px-3 py-1.5 rounded-full text-sm border transition-colors',
        active
          ? 'bg-foreground text-background border-foreground'
          : 'bg-transparent border-border/60 hover:bg-muted',
      ].join(' ')}
    >
      {children}
    </button>
  );
}
