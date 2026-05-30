'use client';

import { Switch } from '@/components/ui/switch';
import { useOwner } from './owner-provider';

export function Footer() {
  const { isOwner, setIsOwner, hasDecided } = useOwner();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border/40 py-8 text-center text-sm text-muted-foreground space-y-4">
      <div>Made with ❤️ by Dominik · {year}</div>
      {hasDecided && (
        <div className="inline-flex items-center gap-2 text-xs">
          <Switch
            checked={isOwner}
            onCheckedChange={setIsOwner}
            aria-label="Jsem Dominik (surprise mode)"
          />
          <span>
            {isOwner
              ? '🙈 Surprise mode — rezervace jsou skryté'
              : 'Surprise mode (skrýt rezervace) — pokud jsi Dominik'}
          </span>
        </div>
      )}
    </footer>
  );
}
