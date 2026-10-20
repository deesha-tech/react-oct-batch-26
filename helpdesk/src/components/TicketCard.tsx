import { Badge, Card } from 'react-bootstrap'
import type { Priority, Ticket } from '../data/tickets'

interface TicketCardProps {
  ticket: Ticket
}

const priorityColor: Record<Priority, string> = {
  low: 'secondary',
  medium: 'primary',
  high: 'danger',
}

export function TicketCard({ ticket }: TicketCardProps) {
 
  const isResolved = ticket.status === 'resolved'
  const needsAttention = ticket.priority === 'high' && !ticket.assignee

  return (
    <Card className={`mb-3 ${isResolved ? 'opacity-50' : ''}`}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <Card.Title className="mb-1">
            #{ticket.id} · {ticket.title}
          </Card.Title>
          <Badge bg={priorityColor[ticket.priority]}>{ticket.priority}</Badge>
        </div>

        <Card.Subtitle className="text-muted mb-2">{ticket.customer}</Card.Subtitle>

        <div className="d-flex gap-2 align-items-center">
          <Badge bg="light" text="dark">
            {ticket.status}
          </Badge>

          {ticket.assignee ? (
            <span>Assigned to {ticket.assignee}</span>
          ) : (
            <Badge bg="warning" text="dark">
              Unassigned
            </Badge>
          )}
        </div>

        {needsAttention && (
          <Card.Text className="text-danger mt-2 mb-0">
            High priority and nobody owns it yet.
          </Card.Text>
        )}
      </Card.Body>
    </Card>
  )
}