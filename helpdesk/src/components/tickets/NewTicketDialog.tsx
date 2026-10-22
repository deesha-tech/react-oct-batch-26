import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { PRIORITIES } from '../../types'
import type { Agent, Priority, TicketDraft } from '../../types'

/**
 * The form's OWN shape. Inputs deal in strings, so "unassigned" is '' here and
 * an absent key in the TicketDraft that leaves the form. `star` is a UI choice,
 * not ticket data, so it is not in the draft at all.
 */
interface NewTicketValues {
  title: string
  customer: string
  description: string
  priority: Priority
  assigneeId: string
  tags: string[]
  star: boolean
}

const EMPTY: NewTicketValues = {
  title: '',
  customer: '',
  description: '',
  priority: 'medium',
  assigneeId: '',
  tags: [],
  star: false,
}

const TITLE_MAX = 80
const TITLE_MIN = 5

export interface CreateOptions {
  /** "★ Star it for me" — the parent owns the starred ids, so it does the starring. */
  star: boolean
}

interface NewTicketFormProps {
  agents: readonly Agent[]
  tagOptions: readonly string[]
  onCreate: (draft: TicketDraft, options: CreateOptions) => void
  onCancel: () => void
}

/**
 * CONTROLLED, one state object, every input type: text, textarea, radio group,
 * select, multi-select, checkbox. Each keystroke re-renders the form — which is
 * what lets the title counter and the submit button react while you type.
 */
function NewTicketForm({ agents, tagOptions, onCreate, onCancel }: NewTicketFormProps) {
  const [values, setValues] = useState<NewTicketValues>(EMPTY)

  // Generic setter: `set('priority', 'urgnet')` and `set('star', 'yes')` are compile errors.
  function set<K extends keyof NewTicketValues>(field: K, value: NewTicketValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value })) // updater + spread: copy, override one key
  }

  // DERIVED, not stored: there is no `isValid` state to forget to update.
  const titleLength = values.title.trim().length
  const isValid = titleLength >= TITLE_MIN && values.customer.trim() !== ''

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault() // first line, always: a native submit reloads the page and wipes all state
    if (!isValid) return

    // Convert at the boundary — trimmed strings out, '' → no key at all.
    const draft: TicketDraft = {
      title: values.title.trim(),
      customer: values.customer.trim(),
      description: values.description.trim(),
      priority: values.priority,
      tags: values.tags,
      ...(values.assigneeId !== '' && { assigneeId: values.assigneeId }),
    }
    onCreate(draft, { star: values.star })
  }

  return (
    // noValidate: we decide what "valid" means, not the browser's bubbles.
    <Form noValidate onSubmit={handleSubmit}>
      <Modal.Body>
        <Row className="g-3">
          <Col xs={12}>
            {/* controlId wires <label htmlFor> to the input: clicking the label focuses the field. */}
            <Form.Group controlId="new-ticket-title">
              <Form.Label className="small fw-semibold">Title</Form.Label>
              <Form.Control
                autoFocus
                maxLength={TITLE_MAX}
                value={values.title}
                onChange={(e) => set('title', e.target.value)}
              />
              {/* A value that drives other UI immediately — the reason to choose controlled. */}
              <Form.Text className={titleLength > 0 && titleLength < TITLE_MIN ? 'text-danger' : undefined}>
                {values.title.length}/{TITLE_MAX} · at least {TITLE_MIN} characters
              </Form.Text>
            </Form.Group>
          </Col>

          <Col sm={6}>
            <Form.Group controlId="new-ticket-customer">
              <Form.Label className="small fw-semibold">Customer</Form.Label>
              <Form.Control value={values.customer} onChange={(e) => set('customer', e.target.value)} />
            </Form.Group>
          </Col>

          <Col sm={6}>
            <Form.Group controlId="new-ticket-assignee">
              <Form.Label className="small fw-semibold">Assignee</Form.Label>
              <Form.Select value={values.assigneeId} onChange={(e) => set('assigneeId', e.target.value)}>
                <option value="">Unassigned</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} · {agent.team}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col xs={12}>
            {/* A radio group is ONE state value and many inputs; the shared `name` makes arrow keys work. */}
            <fieldset>
              <legend className="small fw-semibold mb-1 fs-6">Priority</legend>
              {PRIORITIES.map((p) => (
                <Form.Check
                  key={p}
                  inline
                  type="radio"
                  id={`new-ticket-priority-${p}`}
                  name="priority"
                  label={p}
                  className="text-capitalize"
                  value={p}
                  checked={values.priority === p}
                  // The closure already holds `p` as a Priority — no string to parse.
                  onChange={() => set('priority', p)}
                />
              ))}
            </fieldset>
          </Col>

          <Col xs={12}>
            <Form.Group controlId="new-ticket-description">
              <Form.Label className="small fw-semibold">Description</Form.Label>
              {/* <textarea> takes `value`, not children — same contract as every other input. */}
              <Form.Control
                as="textarea"
                rows={3}
                value={values.description}
                onChange={(e) => set('description', e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col sm={6}>
            <Form.Group controlId="new-ticket-tags">
              <Form.Label className="small fw-semibold">Tags</Form.Label>
              <Form.Select
                multiple
                htmlSize={4}
                value={values.tags} // an ARRAY for a multi-select
                onChange={(e) => set('tags', [...e.target.selectedOptions].map((o) => o.value))}
              >
                {tagOptions.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </Form.Select>
              <Form.Text>Ctrl/⌘-click to pick several.</Form.Text>
            </Form.Group>
          </Col>

          <Col sm={6} className="d-flex align-items-end">
            {/* Checkbox: `checked` + `e.target.checked`, never `value`. */}
            <Form.Check
              type="checkbox"
              id="new-ticket-star"
              label="★ Star it for me"
              checked={values.star}
              onChange={(e) => set('star', e.target.checked)}
            />
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        {!isValid && <span className="small text-body-secondary me-auto">Title and customer are required.</span>}
        {/* type="button": inside a <form>, a plain <button> SUBMITS. */}
        <Button type="button" variant="outline-secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!isValid}>
          Create ticket
        </Button>
      </Modal.Footer>
    </Form>
  )
}

interface NewTicketDialogProps extends NewTicketFormProps {
  show: boolean
}

/**
 * The form lives INSIDE the Modal, so it unmounts when the dialog closes — and its
 * state goes with it. Reopening starts from EMPTY without a single reset line.
 */

export function NewTicketDialog({ show, onCancel, ...formProps }: NewTicketDialogProps) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title className="h6">New ticket</Modal.Title>
      </Modal.Header>
      <NewTicketForm 
        {...formProps}
         onCancel={onCancel} />
    </Modal>
  )
}
