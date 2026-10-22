import { Nav } from 'react-bootstrap'

const VIEWS = ['inbox', 'login'] as const
export type View = (typeof VIEWS)[number]

interface SidebarProps {
  active: View
  onNavigate: (view: View) => void
}

const isView = (key: string | null): key is View => (VIEWS as readonly (string | null)[]).includes(key)

export function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <aside className="app-sidebar p-3">
      <Nav
        className="sidebar-nav flex-column gap-1"
        activeKey={active}
        onSelect={(key) => {
          if (isView(key)) onNavigate(key)
        }}
      >
        <Nav.Link eventKey="inbox">Inbox</Nav.Link>
        <Nav.Link eventKey="login">Sign in</Nav.Link>
      </Nav>
    </aside>
  )
}
