import { Badge, Container, Navbar } from 'react-bootstrap'

// From .env: a public, build-time value. `??` keeps the app working without one.
const appTitle = import.meta.env.VITE_APP_TITLE ?? 'Helpdesk'

interface AppHeaderProps {
  /** Lives in App, not in the cards: the header and the list both need it. */
  starredCount: number
}

export function AppHeader({ starredCount }: AppHeaderProps) {
  return (
    <Navbar bg="dark" data-bs-theme="dark" className="app-header">
      <Container fluid>
        <Navbar.Brand href="#">{appTitle}</Navbar.Brand>
        {/* `starredCount > 0 &&`, never `starredCount &&` — that renders a stray "0". */}
        {starredCount > 0 && (
          <Badge bg="warning" text="dark" pill>
            ★ {starredCount} starred
          </Badge>
        )}
      </Container>
    </Navbar>
  )
}
