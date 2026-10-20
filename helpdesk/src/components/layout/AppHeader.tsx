import { Container, Navbar } from 'react-bootstrap'

export function AppHeader() {
  return (
    <Navbar bg="dark" data-bs-theme="dark" className="app-header">
      <Container fluid>
        <Navbar.Brand href="#">Helpdesk</Navbar.Brand>
      </Container>
    </Navbar>
  )
}
