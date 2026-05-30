/**
 * Compute the next future occurrence of an annual event (e.g. birthday)
 * in Europe/Prague timezone.
 */
export function nextEventDate(
  eventMonth: number,
  eventDay: number,
  now: Date,
): Date {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Prague',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(now).map((p) => [p.type, p.value]),
  );
  const y = Number(parts.year);
  const m = Number(parts.month);
  const d = Number(parts.day);

  // If the event has not happened yet this year, target this year. Otherwise
  // next year. Equality (today === event) counts as "today".
  const isFuture = m < eventMonth || (m === eventMonth && d <= eventDay);
  const targetYear = isFuture ? y : y + 1;
  return new Date(Date.UTC(targetYear, eventMonth - 1, eventDay));
}

/**
 * Days from `now` to `target` (rounded up so the same-day case returns 0).
 */
export function daysBetween(target: Date, now: Date): number {
  // Anchor both to UTC midnight to avoid DST / timezone drift.
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Prague',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(now).map((p) => [p.type, p.value]),
  );
  const todayUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
  );
  const targetUtc = Date.UTC(
    target.getUTCFullYear(),
    target.getUTCMonth(),
    target.getUTCDate(),
  );
  return Math.round((targetUtc - todayUtc) / (24 * 60 * 60 * 1000));
}

const longDateFmt = new Intl.DateTimeFormat('cs-CZ', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function formatLongDate(date: Date): string {
  return longDateFmt.format(date);
}

/** Czech plural of "den". */
export function daysLabel(days: number): string {
  if (days === 0) return 'dnes!';
  if (days === 1) return 'zítra';
  if (days >= 2 && days <= 4) return `za ${days} dny`;
  return `za ${days} dní`;
}
