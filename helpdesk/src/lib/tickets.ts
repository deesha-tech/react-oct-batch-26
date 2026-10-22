/**
 * Pure functions over the ticket catalogue. No DOM, no fetch, no React — data
 * in, NEW data out. Nothing here mutates its input, which is the rule React's
 * state model is built on and why these are trivial to test.
 */
import { PRIORITIES, STATUSES } from '../types'
import type { Agent, Priority, Status, Ticket, TicketDraft } from '../types'
import { ageInHours, formatTicketId } from './format'

// ------------------------------------------------------------ unions & narrowing

export const SORT_ORDERS = ['asc', 'desc'] as const
export type SortOrder = (typeof SORT_ORDERS)[number]

/** A hand-picked subset of `keyof Ticket` — the fields a user may sort by. */
export const SORT_KEYS = ['createdAt', 'updatedAt', 'priority', 'title'] as const
export type SortKey = (typeof SORT_KEYS)[number] & keyof Ticket

/** Indexed access: "whatever type `customer` has on Ticket". If that changes, this follows. */
export type Customer = Ticket['customer']

export type Filter<T extends string> = T | 'all'

/** A `<select>` hands you a `string`; the rest of the code wants a `SortOrder`. `===` narrows. */
export function parseSortOrder(value: string): SortOrder {
  return value === 'desc' ? 'desc' : 'asc'
}

/** Same boundary pattern, generalised: a wide string in, one of a known set out. */
export function parseOneOf<T extends string>(allowed: readonly T[], value: string, fallback: T): T {
  // `.includes` on `readonly T[]` wants a `T`; widening the array to `string[]` is the honest move.
  return (allowed as readonly string[]).includes(value) ? (value as T) : fallback
}

export const parseStatusFilter = (value: string): Filter<Status> =>
  parseOneOf<Filter<Status>>(['all', ...STATUSES], value, 'all')
export const parsePriorityFilter = (value: string): Filter<Priority> =>
  parseOneOf<Filter<Priority>>(['all', ...PRIORITIES], value, 'all')
export const parseSortKey = (value: string): SortKey => parseOneOf(SORT_KEYS, value, 'createdAt')

/** `Record<Priority, number>`: forget a priority and this object is a compile error. */
export const PRIORITY_RANK: Record<Priority, number> = { low: 0, medium: 1, high: 2, urgent: 3 }

export type StatusLabel = 'Open' | 'In progress' | 'Resolved' | 'Closed'

/** A literal-union return type: a typo in a branch is a compile error, not a wrong badge. */
export function statusLabel(status: Status): StatusLabel {
  switch (status) {
    case 'open':
      return 'Open'
    case 'in-progress':
      return 'In progress'
    case 'resolved':
      return 'Resolved'
    case 'closed':
      return 'Closed'
  }
}

/** `??` defaults for null/undefined ONLY. `||` would also swallow '' — and 0. */
export function assigneeLabel(ticket: Ticket, agentsById: ReadonlyMap<string, Agent>): string {
  if (ticket.assigneeId === undefined) return 'Unassigned'
  // `.get` returns `Agent | undefined`; `?.` reads through it, `??` supplies the fallback.
  return agentsById.get(ticket.assigneeId)?.name ?? 'Unknown agent'
}

/** `?.` then `??`: tags may be absent entirely. */
export function tagLine(ticket: Ticket): string {
  return ticket.tags?.join(', ') ?? ''
}

export function isDone(ticket: Ticket): boolean {
  return ticket.status === 'resolved' || ticket.status === 'closed'
}

// ------------------------------------------------------- shapes & immutability

/** What a list row needs — `Pick` names the subset once, derived from the source of truth. */
export type TicketPreview = Pick<Ticket, 'id' | 'title' | 'priority' | 'status'>

/** What an edit form may send: any subset of these fields (NOT `Partial<Ticket>` — that allows `{ id: 99 }`). */
export type TicketPatch = Partial<Pick<Ticket, 'priority' | 'status' | 'assigneeId' | 'tags'>>

/** The list shape without the long text. */
export type TicketSummary = Omit<Ticket, 'description'>

/** Destructure in the parameter list; shorthand properties on the way out. */
export function toPreview({ id, title, priority, status }: Readonly<Ticket>): TicketPreview {
  return { id, title, priority, status }
}

/** A default INSIDE the destructuring pattern — `tags` is optional. */
export function describeTicket({ id, title, customer, tags = [] }: Ticket): string {
  return `${formatTicketId(id)} ${title} (${customer})${tags.length > 0 ? ` [${tags.join(', ')}]` : ''}`
}

/** Rest in the pattern; the leading underscore says "unused on purpose". */
export function toSummary({ description: _description, ...rest }: Ticket): TicketSummary {
  return rest
}

// The four updates you will write constantly. None touches its input:
// each returns a NEW array — which is what a React state setter needs to see.

export function addTicket(tickets: readonly Ticket[], ticket: Ticket): Ticket[] {
  return [...tickets, ticket]
}

export function removeTicket(tickets: readonly Ticket[], id: number): Ticket[] {
  return tickets.filter((t) => t.id !== id)
}

/** Spread, then the patch: later keys win. Untouched items are the SAME objects. */
export function updateTicket(tickets: readonly Ticket[], id: number, patch: TicketPatch): Ticket[] {
  return tickets.map((t) => (t.id === id ? { ...t, ...patch } : t))
}

/** Toggle membership in a list of ids — the starred tickets. */
export function toggleId(ids: readonly number[], id: number): number[] {
  return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
}

/**
 * The same toggle for a Set. Copy, then
 * change the COPY — `set.add()` on the Set in state mutates it in place, React
 * sees the same reference and skips the re-render.
 */
export function toggleInSet<T>(set: ReadonlySet<T>, value: T): Set<T> {
  const next = new Set(set)
  if (next.has(value)) next.delete(value)
  else next.add(value)
  return next
}

/** Ids are numbers the client hands out until the server does: one more than the largest. */
export function nextTicketId(tickets: readonly Ticket[]): number {
  return tickets.reduce((max, t) => Math.max(max, t.id), 0) + 1
}

/**
 * The form's output → a whole Ticket. `now` is a parameter (not `new Date()` in
 * here) so the function stays pure; the event handler that calls it reads the clock.
 */
export function draftToTicket(draft: TicketDraft, id: number, nowIso: string): Ticket {
  return { ...draft, id, status: 'open', createdAt: nowIso, updatedAt: nowIso }
}

// ------------------------------------------------------------- the array toolbox

export function filterByStatus(tickets: readonly Ticket[], status: Filter<Status>): Ticket[] {
  return status === 'all' ? [...tickets] : tickets.filter((t) => t.status === status)
}

export function filterByPriority(tickets: readonly Ticket[], priority: Filter<Priority>): Ticket[] {
  return priority === 'all' ? [...tickets] : tickets.filter((t) => t.priority === priority)
}

export function searchTickets(tickets: readonly Ticket[], query: string): Ticket[] {
  const q = query.trim().toLowerCase()
  if (q === '') return [...tickets]
  return tickets.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.customer.toLowerCase().includes(q) ||
      formatTicketId(t.id).toLowerCase().includes(q) ||
      (t.tags ?? []).some((tag) => tag.includes(q)),
  )
}

/** Turn any sortable field into something comparable. Each `if` narrows `key`. */
function sortValue(ticket: Ticket, key: SortKey): string | number {
  if (key === 'priority') return PRIORITY_RANK[ticket.priority]
  if (key === 'title') return ticket.title.toLowerCase()
  return Date.parse(ticket[key]) // createdAt | updatedAt — narrowed by the two ifs above
}

/** `.sort()` MUTATES. Copy first — the caller's array is not ours to reorder. */
export function sortTickets(tickets: readonly Ticket[], key: SortKey, order: SortOrder = 'asc'): Ticket[] {
  const direction = order === 'asc' ? 1 : -1
  return [...tickets].sort((a, b) => {
    const left = sortValue(a, key)
    const right = sortValue(b, key)
    return (left < right ? -1 : left > right ? 1 : 0) * direction
  })
}

/** `reduce` into a Record. `??=` creates the bucket on first sight — and satisfies `noUncheckedIndexedAccess`. */
export function groupByStatus(tickets: readonly Ticket[]): Partial<Record<Status, Ticket[]>> {
  return tickets.reduce<Partial<Record<Status, Ticket[]>>>((groups, ticket) => {
    // The accumulator is mutated — it was created by this call and nobody else holds it.
    const bucket = (groups[ticket.status] ??= [])
    bucket.push(ticket)
    return groups
  }, {})
}

/** One pass, every status present (zeros included) — the filter pills show a count each. */
export function countByStatus(tickets: readonly Ticket[]): Record<Status, number> {
  const counts: Record<Status, number> = { open: 0, 'in-progress': 0, resolved: 0, closed: 0 }
  for (const t of tickets) counts[t.status] += 1
  return counts
}

/** Counting instead of grouping: every key present, so a full `Record` (start from all zeros). A plain loop is fine too. */
export function countByPriority(tickets: readonly Ticket[]): Record<Priority, number> {
  const counts: Record<Priority, number> = { low: 0, medium: 0, high: 0, urgent: 0 }
  for (const t of tickets) counts[t.priority] += 1
  return counts
}

/** `flatMap` = map + flatten one level; a Set dedupes; spread turns it back into an array. */
export function allTags(tickets: readonly Ticket[]): string[] {
  return [...new Set(tickets.flatMap((t) => t.tags ?? []))].sort()
}

export function customersOf(tickets: readonly Ticket[]): Customer[] {
  return [...new Set(tickets.map((t) => t.customer))].sort()
}

/** A Map for O(1) lookup by id — what every normalised store looks like. */
export function byId<T extends { readonly id: PropertyKey }>(items: readonly T[]): Map<T['id'], T> {
  return new Map(items.map((item) => [item.id, item]))
}

/** `[0]` is `Ticket | undefined` under `noUncheckedIndexedAccess` — the type says what the runtime always did. */
export function oldestOpen(tickets: readonly Ticket[]): Ticket | undefined {
  return sortTickets(
    tickets.filter((t) => t.status === 'open'),
    'createdAt',
  )[0]
}

/**
 * DERIVED state: never store "needs attention" — compute it from the ticket.
 * Not done AND (urgent, OR high and unassigned, OR open, unassigned and older than a day).
 */
export function needsAttention(ticket: Ticket, now: number = Date.now()): boolean {
  if (isDone(ticket)) return false
  if (ticket.priority === 'urgent') return true
  const unassigned = ticket.assigneeId === undefined
  if (ticket.priority === 'high' && unassigned) return true
  return ticket.status === 'open' && unassigned && ageInHours(ticket.createdAt, now) > 24
}
