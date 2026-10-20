import { Container, Navbar } from 'react-bootstrap'

export function Header() {
  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container fluid>
        <Navbar.Brand href="#">Helpdesk</Navbar.Brand>
      </Container>
    </Navbar>
  )
}