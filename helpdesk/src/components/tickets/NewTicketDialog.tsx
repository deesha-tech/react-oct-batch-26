import { Button, Form, Modal } from "react-bootstrap";

interface NewTicketDialogProps {
  show: boolean;
  onCancel: () => void;
}

function NewTicketForm({onCancel}) {
  return (
    <Form>
      <Modal.Body>
        <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control 
                value=''
                onChange={ (e)=> console.log(e.target.value) }
            />
        </Form.Group>

         <Form.Group>
            <Form.Label>Customer</Form.Label>
            <Form.Control 
                value=''
                onChange={ (e)=> console.log(e.target.value) }
            />
        </Form.Group>

         <Form.Group>
            <Form.Label>Assignee</Form.Label>
            <Form.Select>
                <option>Makarand</option>
                 <option>Khushi</option>
                  <option>Sumit</option>
            </Form.Select>
        </Form.Group>


      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onCancel}>Cancel</Button>
        Submit button as well
      </Modal.Footer>
    </Form>
  );
}

function NewTicketDialog({ show, onCancel }: NewTicketDialogProps) {
  return (
    <Modal show={show}>
      <Modal.Header>
        <Modal.Title>New Ticket</Modal.Title>
      </Modal.Header>
      <NewTicketForm onCancel={onCancel}/>
    </Modal>
  );
}

export default NewTicketDialog;
