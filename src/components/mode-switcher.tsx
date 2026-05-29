'use client';

import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Mode } from '@/lib/mode';
import { modeConfig } from '@/lib/mode-config';
import { useMode } from './mode-provider';

const ORDER: Mode[] = ['birthday', 'nameday', 'christmas'];

export function ModeSwitcher() {
  const { effectiveMode, override, setOverride } = useMode();
  const label = override
    ? `${modeConfig[effectiveMode].emoji} ${modeConfig[effectiveMode].label}`
    : `Auto: ${modeConfig[effectiveMode].emoji} ${modeConfig[effectiveMode].label}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1 text-xs">
          {label} <ChevronDown className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => setOverride(null)}>
          Auto (dle data)
        </DropdownMenuItem>
        {ORDER.map((m) => (
          <DropdownMenuItem key={m} onSelect={() => setOverride(m)}>
            {modeConfig[m].emoji} {modeConfig[m].label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
