import { Fragment } from 'react'
import type { ReactNode } from 'react'
import { Badge } from 'react-bootstrap'
import { formatDate, formatRelativeTime } from '../../lib/format'
import type { Agent } from '../../types'

interface TicketMetaProps {
  customer: string
  /** `undefined` = nobody owns the ticket yet. */
  assignee?: Agent
  createdAt: string
}

/**
 * A description list laid out as a two-column CSS grid (`.ticket-meta`).
 * Each row is a <dt>/<dd> PAIR: wrapping the pair in a <div> would add a third
 * grid child per row and break the columns, so each pair is a Fragment — it
 * groups without adding a DOM node. Inside .map() it needs a key, so it is the
 * long form <Fragment key>; the short form <>…</> cannot take attributes.
 */
export function TicketMeta({ customer, assignee, createdAt }: TicketMetaProps) {
  const rows: { label: string; value: ReactNode }[] = [
    { label: 'Customer', value: customer },
    {
      label: 'Assignee',
      value: assignee ? (
        assignee.name
      ) : (
        <Badge bg="warning" text="dark">
          Unassigned
        </Badge>
      ),
    },
    { label: 'Opened', value: <time dateTime={createdAt} title={formatDate(createdAt)}>{formatRelativeTime(createdAt)}</time> },
  ]

  return (
    <dl className="ticket-meta">
      {rows.map((row) => (
        <Fragment key={row.label}>
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </Fragment>
      ))}
    </dl>
  )
}
