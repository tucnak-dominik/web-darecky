export type Mode = 'birthday' | 'nameday' | 'christmas';

const EVENTS: { mode: Mode; month: number; day: number }[] = [
  { mode: 'nameday', month: 8, day: 4 },
  { mode: 'birthday', month: 11, day: 9 },
  { mode: 'christmas', month: 12, day: 24 },
];

function toPragueDate(date: Date): { y: number; m: number; d: number } {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Prague',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(date).map((p) => [p.type, p.value]),
  );
  return {
    y: Number(parts.year),
    m: Number(parts.month),
    d: Number(parts.day),
  };
}

const dayOfYear = (m: number, d: number) => m * 31 + d;

export function resolveMode(date: Date): Mode {
  const { m, d } = toPragueDate(date);
  const today = dayOfYear(m, d);

  const sorted = [...EVENTS].sort(
    (a, b) => dayOfYear(a.month, a.day) - dayOfYear(b.month, b.day),
  );

  for (const event of sorted) {
    if (today <= dayOfYear(event.month, event.day)) return event.mode;
  }
  return sorted[0].mode;
}
