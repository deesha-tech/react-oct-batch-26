import { Form } from 'react-bootstrap'
import { parsePriorityFilter } from '../../lib/tickets'
import type { Filter } from '../../lib/tickets'
import { PRIORITIES } from '../../types'
import type { Priority } from '../../types'

interface PrioritySelectProps {
  value: Filter<Priority>
  onChange: (value: Filter<Priority>) => void
}

/** A controlled <select>: React puts `value` on the <select>, never `selected` on an <option>. */
export function PrioritySelect({ value, onChange }: PrioritySelectProps) {
  return (
    <Form.Select
      size="sm"
      className="w-auto"
      aria-label="Filter by priority"
      value={value}
      // The DOM hands back a string; parse it ONCE, here, into the union the parent wants.
      onChange={(e) => onChange(parsePriorityFilter(e.target.value))}
    >
      <option value="all">Any priority</option>
      {PRIORITIES.map((p) => (
        <option key={p} value={p}>
          {p.charAt(0).toUpperCase() + p.slice(1)}
        </option>
      ))}
    </Form.Select>
  )
}
