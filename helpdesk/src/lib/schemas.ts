import { z } from 'zod'
import { PRIORITIES } from '../types'
import type { TicketDraft } from '../types'

// schema-first validation. Each rule is written ONCE, here, and the TypeScript
// types are DERIVED from the schemas (`z.infer`) — so the rules and the types can never
// disagree. The same objects run in the browser (as a convenience for the user) and
// on the "server" (as the authority — never trust the client). Zod 4 syntax:
// `z.email()` at the top level, `{ error }` for custom messages.

export const TITLE_MIN = 5
export const TITLE_MAX = 80
export const DESCRIPTION_MAX = 500
export const TAGS_MAX = 3

/**
 * The building blocks every ticket-shaped form shares. The app's New ticket dialog
 * and any other ticket form compose their schema from these, so "a title needs 5
 * characters" is decided in exactly one place.
 */
export const ticketRules = {
  // `{ error }` on the base type covers "missing" (FormData/Conform send undefined for an empty box).
  title: z
    .string({ error: 'Give the ticket a title.' })
    .trim()
    .min(TITLE_MIN, `At least ${TITLE_MIN} characters, so an agent can tell what it is about.`)
    .max(TITLE_MAX, `Keep it under ${TITLE_MAX} characters.`),
  priority: z.enum(PRIORITIES, { error: 'Pick a priority.' }),
  // Optional: an empty textarea arrives as '' (controlled/RHF) or undefined (Conform).
  description: z.string().trim().max(DESCRIPTION_MAX, `Keep it under ${DESCRIPTION_MAX} characters.`).optional(),
  tags: z.array(z.string()).max(TAGS_MAX, `Pick at most ${TAGS_MAX} tags.`),
} as const

/** The app's New ticket dialog (NewTicketDialog.tsx). `star` is a UI choice, not ticket data. */
export const newTicketSchema = z.object({
  ...ticketRules,
  customer: z.string({ error: 'Who is the customer?' }).trim().min(2, 'Who is the customer?'),
  /** '' means unassigned — the boundary below turns it into "no key at all". */
  assigneeId: z.string(),
  star: z.boolean(),
})

/** What the form holds (input) vs what a successful parse returns (output, trimmed). */
export type NewTicketInput = z.input<typeof newTicketSchema>
export type NewTicketValues = z.output<typeof newTicketSchema>

export const NEW_TICKET_EMPTY: NewTicketInput = {
  title: '',
  customer: '',
  description: '',
  priority: 'medium',
  assigneeId: '',
  tags: [],
  star: false,
}

/** Parsed form values → the app's TicketDraft. Conversion happens at the boundary, once. */
export function toTicketDraft({ star: _star, assigneeId, description = '', ...rest }: NewTicketValues): TicketDraft {
  return { ...rest, description, ...(assigneeId !== '' && { assigneeId }) }
}

/** The Sign in form (LoginForm.tsx). Its type is derived, not hand-written. */
export const loginSchema = z.object({
  email: z.email({ error: 'Enter your email address, e.g. emily@helpdesk.dev.' }),
  password: z.string().min(1, 'Enter your password.').min(6, 'Passwords are at least 6 characters.'),
  remember: z.boolean(),
})

export type LoginCredentials = z.infer<typeof loginSchema>

/**
 * `{ email: ['…'], title: ['…'] }` → `{ email: '…', title: '…' }` — one message per
 * field, the shape every form in this app renders. Zod 4's `z.flattenError` does the walk.
 */
export function firstErrors<T>(error: z.ZodError<T>): Partial<Record<keyof T & string, string>> {
  const { fieldErrors } = z.flattenError(error)
  const out: Partial<Record<string, string>> = {}
  for (const [key, messages] of Object.entries(fieldErrors) as [string, string[] | undefined][]) {
    if (messages?.[0]) out[key] = messages[0]
  }
  return out as Partial<Record<keyof T & string, string>>
}
