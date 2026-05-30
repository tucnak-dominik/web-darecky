'use client';

import { CalendarDays } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useMode } from '@/components/mode-provider';
import {
  daysBetween,
  daysLabel,
  formatLongDate,
  nextEventDate,
} from '@/lib/event-countdown';
import { modeConfig } from '@/lib/mode-config';

export function EventCountdown() {
  const { effectiveMode } = useMode();
  const cfg = modeConfig[effectiveMode];
  const [info, setInfo] = useState<{ date: string; label: string } | null>(
    null,
  );

  useEffect(() => {
    const target = nextEventDate(cfg.eventMonth, cfg.eventDay, new Date());
    const days = daysBetween(target, new Date());
    setInfo({ date: formatLongDate(target), label: daysLabel(days) });
  }, [cfg.eventMonth, cfg.eventDay]);

  if (!info) {
    // Reserve space on first paint to avoid layout shift after hydration.
    return <div className="mt-6 h-10" aria-hidden="true" />;
  }

  return (
    <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border/60 bg-card/60 backdrop-blur text-sm sm:text-base">
      <CalendarDays className="size-4 text-muted-foreground" />
      <span className="text-foreground font-medium">{info.date}</span>
      <span className="text-muted-foreground">·</span>
      <span className="font-mono text-amber-300">{info.label}</span>
    </div>
  );
}
