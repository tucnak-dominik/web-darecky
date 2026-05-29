'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = mounted ? (resolvedTheme ?? theme) : 'light';
  const next = current === 'dark' ? 'light' : 'dark';

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={`Přepnout na ${next === 'dark' ? 'tmavý' : 'světlý'} režim`}
      onClick={() => setTheme(next)}
    >
      {mounted && current === 'dark' ? <Sun /> : <Moon />}
    </Button>
  );
}
