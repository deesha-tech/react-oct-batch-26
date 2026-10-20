import type { ReactNode } from 'react'
import { Card } from 'react-bootstrap'
import { formatTicketId } from '../../lib/format'
import { isDone, needsAttention } from '../../lib/tickets'
import type { Agent, Ticket } from '../../types'
import { PriorityBadge } from './PriorityBadge'
import { StatusBadge } from './StatusBadge'
import { TicketMeta } from './TicketMeta'

interface TicketCardProps {
  /** Pass the domain thing, not six loose props: when the API adds a field, only the card changes. */
  ticket: Ticket
  assignee?: Agent
  /** A slot for per-card actions (e.g. the star). The card positions it; it never inspects it. */
  actions?: ReactNode
}

/**
 * The student's original card (commit 77337cb), cleaned up: badges and meta are
 * their own components, and "needs attention" is derived by a pure helper
 * instead of being re-implemented inline.
 */
export function TicketCard({ ticket, assignee, actions }: TicketCardProps) {
  // Plain JavaScript above the return: derived values, not props.
  const done = isDone(ticket)
  const attention = needsAttention(ticket)

  return (
    <Card className={`ticket-card h-100 ${done ? 'is-done' : ''}`}>
      <Card.Body className="d-flex flex-column gap-2">
        <div className="d-flex align-items-start gap-2">
          <Card.Title as="h2" className="h6 mb-0 flex-grow-1">
            <code className="text-body-secondary me-2">{formatTicketId(ticket.id)}</code>
            {ticket.title}
          </Card.Title>
          {actions}
        </div>

        <div className="d-flex gap-2">
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>

        <TicketMeta customer={ticket.customer} assignee={assignee} createdAt={ticket.createdAt} />

        {/* && for render-or-nothing (a real boolean on the left); a ternary inside for the either/or reason. */}
        {attention && (
          <p className="small text-danger mb-0 mt-auto">
            Needs attention: {ticket.assigneeId === undefined ? 'nobody is on this yet.' : 'urgent.'}
          </p>
        )}
      </Card.Body>
    </Card>
  )
}
