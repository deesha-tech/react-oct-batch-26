import { Nav } from 'react-bootstrap'

export function Sidebar() {
  return (
    <aside className="app-sidebar p-3">
      <Nav className="sidebar-nav flex-column gap-1" defaultActiveKey="inbox">
        <Nav.Link eventKey="inbox">Inbox</Nav.Link>
      </Nav>
    </aside>
  )
}
