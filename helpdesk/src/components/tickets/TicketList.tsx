import type { ReactNode } from 'react'
import { Col, Row } from 'react-bootstrap'
import type { Agent, Ticket } from '../../types'
import { EmptyState } from '../common/EmptyState'
import { StarToggle } from './StarToggle'
import { TicketCard } from './TicketCard'

interface TicketListProps {
  tickets: readonly Ticket[]
  /** Lookup built once by the parent (`byId`) — the list resolves each ticket's assignee. */
  agentsById: ReadonlyMap<string, Agent>
  /** A Set: each of N cards asks "am I starred?" — `has` is O(1), `includes` would scan. */
  starredIds: ReadonlySet<number>
  onToggleStar: (id: number) => void
  /** What to say when the list is empty — the parent knows WHY it is empty. */
  empty: { title: string; hint?: string; action?: ReactNode }
}

export function TicketList({ tickets, agentsById, starredIds, onToggleStar, empty }: TicketListProps) {
  // Early return: an empty list is a whole different view, not a variation on the grid.
  if (tickets.length === 0) {
    return <EmptyState title={empty.title} hint={empty.hint} action={empty.action} />
  }

  return (
    <Row xs={1} md={2} xl={3} className="g-3">
      {tickets.map((ticket) => (
        // key = the ticket's id, on the OUTERMOST element of each item (the Col). Not the
        // index: filter, sort or "show more" and every card must keep its own identity.
        <Col key={ticket.id}>
          <TicketCard
            ticket={ticket}
            assignee={ticket.assigneeId === undefined ? undefined : agentsById.get(ticket.assigneeId)}
            actions={
              <StarToggle
                starred={starredIds.has(ticket.id)}
                ticketTitle={ticket.title}
                onToggle={() => onToggleStar(ticket.id)}
              />
            }
          />
        </Col>
      ))}
    </Row>
  )
}
