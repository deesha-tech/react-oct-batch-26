// Domain types shared across the app.
// Shaped like the JSON the API will serve, so code written against them
// never changes when the network arrives.

/** `as const` keeps the literals; the type is DERIVED so list and type can never drift. */
export const PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const
export type Priority = (typeof PRIORITIES)[number]

export const STATUSES = ['open', 'in-progress', 'resolved', 'closed'] as const
export type Status = (typeof STATUSES)[number]

export interface Ticket {
  readonly id: number
  title: string
  description: string
  customer: string
  priority: Priority
  status: Status
  /** Unassigned tickets have no key at all — hence optional, not `null`. */
  assigneeId?: string
  tags?: string[]
  /** ISO-8601 strings, exactly as JSON delivers them. Parse at the edge, not here. */
  createdAt: string
  updatedAt: string
}

export interface Agent {
  readonly id: string
  name: string
  email: string
  team: string
  avatarUrl?: string
}

export interface Comment {
  readonly id: number
  ticketId: number
  author: string
  body: string
  createdAt: string
}

/**
 * What a person types to open a ticket. The app adds the rest —
 * id, status, timestamps — so the form cannot get them wrong. Derived with
 * `Pick`, so a renamed Ticket field breaks the form at compile time.
 */
export type TicketDraft = Pick<Ticket, 'title' | 'description' | 'customer' | 'priority' | 'assigneeId' | 'tags'>
