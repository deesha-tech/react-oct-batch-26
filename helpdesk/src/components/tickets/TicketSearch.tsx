import type { KeyboardEvent } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'

interface TicketSearchProps {
  /** The query lives in the PARENT (InboxPage): the list, the counts and the header all read it. */
  value: string
  /** Reports the new text — a string, not the event. The parent never sees DOM details. */
  onChange: (query: string) => void
}

/**
 * A controlled search box with no state of its own. `value` + `onChange` always
 * travel together: `value` alone is a frozen field, `onChange` alone is a field
 * the parent can never clear.
 */
export function TicketSearch({ value, onChange }: TicketSearchProps) {
  // The event object, typed: KeyboardEvent<HTMLInputElement> gives `key`, modifiers, `currentTarget`.
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') onChange('')
  }

  return (
    <InputGroup size="sm" className="ticket-search">
      <Form.Control
        type="search"
        placeholder="Search title, customer, HD-id or tag…"
        aria-label="Search tickets"
        value={value}
        // Extract the string HERE. `onChange={onChange}` would hand the parent the event object.
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {value !== '' && (
        // type="button": not inside a form today, but a button's default type is "submit".
        <Button type="button" variant="outline-secondary" onClick={() => onChange('')}>
          Clear
        </Button>
      )}
    </InputGroup>
  )
}
