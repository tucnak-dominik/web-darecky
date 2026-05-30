import { ModeSwitcher } from './mode-switcher';

export function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/40">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-2">
        <a href="#top" className="font-semibold text-lg sm:text-xl">
          🎁 Dárečky pro Dominika
        </a>
        <div className="flex items-center gap-1">
          <ModeSwitcher />
        </div>
      </div>
    </header>
  );
}
