import { Badge } from 'react-bootstrap'
import { statusLabel } from '../../lib/tickets'
import type { Status } from '../../types'

interface StatusBadgeProps {
  status: Status
}

const STATUS_BG: Record<Status, string> = {
  open: 'primary-subtle',
  'in-progress': 'warning-subtle',
  resolved: 'success-subtle',
  closed: 'secondary-subtle',
}

const STATUS_TEXT: Record<Status, string> = {
  open: 'primary-emphasis',
  'in-progress': 'warning-emphasis',
  resolved: 'success-emphasis',
  closed: 'secondary-emphasis',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  // The label is DERIVED from the status (statusLabel), never passed in as a second prop.
  return (
    <Badge bg={STATUS_BG[status]} text={STATUS_TEXT[status]}>
      {statusLabel(status)}
    </Badge>
  )
}
