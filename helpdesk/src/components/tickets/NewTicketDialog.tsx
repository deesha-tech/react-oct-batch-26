import { Button, Form, Modal } from "react-bootstrap";
import type { Agent, CreateOptions, Priority, Ticket, TicketDraft } from "../../types";
import { agents } from '../../data/agents';
import { useState, type SubmitEvent } from "react";

interface NewTicketDialogProps {
  show: boolean;
  onCancel: () => void;
  onCreate: (draft:TicketDraft, options:CreateOptions) => Ticket
}

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

EMPTY['priority']

interface NewTicketFormProps {
  agents: readonly Agent[]
  tagOptions: readonly string[]
  onCreate: (draft: TicketDraft, options: CreateOptions) => Ticket
  onCancel: () => void
}


function NewTicketForm({onCancel, onCreate}: NewTicketFormProps) {

  const [values, setValues] = useState<NewTicketValues>(EMPTY);

  function set<K extends keyof NewTicketValues>(field: K, value: NewTicketValues[K]){
    setValues( (prev)=> ({...prev,  [field]: value })  )
  }

  const isValid = values.title.trim.length >= 5 && values.customer.trim() != ''

  function handleSubmit(event: SubmitEvent<HTMLFormElement>){

    alert('creating a new ticket')
    event.preventDefault();

    // if(!isValid) return;

    const draft: TicketDraft = {
      title: values.title.trim(),
      customer: values.customer.trim(),
      description: values.description.trim(), 
      priority: values.priority,
      tags: values.tags,
      ...(values.assigneeId != '' && { assignedId: values.assigneeId})
    }

    onCreate(draft, {star: values.star})
    console.log(draft)

    console.log('form is submitted')
  }

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Modal.Body>
        <Form.Group className="mb-3" controlId="new-ticket-title">
          <Form.Label>Title</Form.Label>
          <Form.Control autoFocus value={values.title} onChange={(e) => set('title', e.target.value)} />
        </Form.Group>
        <Form.Group controlId="new-ticket-customer">
          <Form.Label>Customer</Form.Label>
          <Form.Control value={values.customer} onChange={(e) => set('customer', e.target.value)} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant="outline-secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create ticket
        </Button>
      </Modal.Footer>
    </Form>
  );
}

function NewTicketDialog({ show, onCreate, onCancel }: NewTicketDialogProps) {
  return (
    <Modal show={show}>
      <Modal.Header>
        <Modal.Title>New Ticket</Modal.Title>
      </Modal.Header>
      <NewTicketForm onCreate={onCreate} onCancel={onCancel}/>
    </Modal>
  );
}

export default NewTicketDialog;
