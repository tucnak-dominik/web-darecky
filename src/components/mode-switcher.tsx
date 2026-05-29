'use client';

import { ChevronDown } from 'lucide-react';
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
      <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
        {label} <ChevronDown className="size-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setOverride(null)}>
          Auto (dle data)
        </DropdownMenuItem>
        {ORDER.map((m) => (
          <DropdownMenuItem key={m} onClick={() => setOverride(m)}>
            {modeConfig[m].emoji} {modeConfig[m].label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
