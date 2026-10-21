// Domain types shared across the app.
// Shaped like the JSON an API would serve, so code written against them
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

export type TicketDraft = Pick<Ticket, 'title' | 'description' | 'customer' | 'priority' | 'assigneeId' | 'tags'> // ← NEW

export interface CreateOptions  {
  star: boolean
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
