/**
 * Small, pure formatting helpers. No DOM, no React — data in, string out.
 * That is why any component can import these unchanged.
 */

// Expensive to create, cheap to use — build formatters ONCE at module scope,
// not inside the function (in React: not inside the component body).
const dateFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
const relativeFormat = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

/** 1042 → "HD-1042". Annotated boundary: a string id here is a compile error. */
export function formatTicketId(id: number): string {
  return `HD-${String(id).padStart(4, '0')}`
}

/** ISO string from the API → "20 Oct 2026, 09:00". */
export function formatDate(iso: string): string {
  return dateFormat.format(new Date(iso))
}

// `as const` + a readonly tuple of tuples: the unit names stay literal types,
// which is exactly what `Intl.RelativeTimeFormat#format` demands.
const UNITS = [
  ['year', 365 * 24 * 3600],
  ['month', 30 * 24 * 3600],
  ['week', 7 * 24 * 3600],
  ['day', 24 * 3600],
  ['hour', 3600],
  ['minute', 60],
] as const

/**
 * "3 hours ago", "yesterday". `now` is a PARAMETER (defaulting to the clock) so
 * the function stays pure and testable — pass a fixed time and the output is fixed.
 */
export function formatRelativeTime(iso: string, now: number = Date.now()): string {
  const seconds = Math.round((Date.parse(iso) - now) / 1000)
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return relativeFormat.format(Math.round(seconds / size), unit)
  }
  return 'just now'
}

/** Whole hours between an ISO timestamp and `now`. Used to derive SLA / "needs attention". */
export function ageInHours(iso: string, now: number = Date.now()): number {
  return Math.floor((now - Date.parse(iso)) / 3_600_000)
}
