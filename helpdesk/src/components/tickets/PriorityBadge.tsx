import { Badge } from 'react-bootstrap'
import type { Priority } from '../../types'

interface PriorityBadgeProps {
  priority: Priority
}

// Record<Priority, …>: add a priority to the union and the compiler asks for its colour.
const PRIORITY_BG: Record<Priority, string> = {
  low: 'secondary',
  medium: 'info',
  high: 'warning',
  urgent: 'danger',
}

/** Takes the narrowest data it needs — a priority, not a whole ticket. */
export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <Badge bg={PRIORITY_BG[priority]} text={priority === 'high' ? 'dark' : undefined} className="text-capitalize">
      {priority}
    </Badge>
  )
}
