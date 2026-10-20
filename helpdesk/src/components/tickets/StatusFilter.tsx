import { Badge, Nav } from 'react-bootstrap'
import { parseStatusFilter, statusLabel } from '../../lib/tickets'
import type { Filter } from '../../lib/tickets'
import { STATUSES } from '../../types'
import type { Status } from '../../types'

interface StatusFilterProps {
  value: Filter<Status>
  /** Derived by the parent from the full list — this component never sees tickets. */
  counts: Record<Status, number>
  total: number
  /** Reports the choice in the parent's vocabulary, not as an event. */
  onChange: (status: Filter<Status>) => void
}

/** Controlled: no useState in here. The parent owns the selection. */
export function StatusFilter({ value, counts, total, onChange }: StatusFilterProps) {
  return (
    <Nav
      variant="pills"
      className="status-filter flex-nowrap overflow-auto"
      activeKey={value}
      // react-bootstrap hands us `string | null`; parse it back into our union at the edge.
      onSelect={(key) => onChange(parseStatusFilter(key ?? 'all'))}
    >
      <Nav.Item>
        <Nav.Link eventKey="all">
          All <Badge bg="secondary" pill>{total}</Badge>
        </Nav.Link>
      </Nav.Item>
      {/* Keys: the status itself — a unique, stable primitive. */}
      {STATUSES.map((status) => (
        <Nav.Item key={status}>
          <Nav.Link eventKey={status} className="text-nowrap">
            {statusLabel(status)} <Badge bg="secondary" pill>{counts[status]}</Badge>
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  )
}
