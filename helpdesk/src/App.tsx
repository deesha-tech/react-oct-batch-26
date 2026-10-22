import { useState } from 'react'
import { AppHeader } from './components/layout/AppHeader'
import { Sidebar } from './components/layout/Sidebar'
import type { View } from './components/layout/Sidebar'
import type { CreateOptions } from './components/tickets/NewTicketDialog'
import { agents } from './data/agents'
import { tickets as initialTickets } from './data/tickets'
import { byId, draftToTicket, nextTicketId, toggleInSet } from './lib/tickets'
import { InboxPage } from './pages/InboxPage'
import { LoginPage } from './pages/LoginPage'
import type { Ticket, TicketDraft } from './types'

// Built once at module scope: agents never change while the app runs.
const agentsById = byId(agents)

function App() {
  // No router yet: the sidebar switches the main view with plain state.
  const [view, setView] = useState<View>('inbox')

  // Tickets are STATE — the new-ticket form adds to them. They live here, not in
  // InboxPage, because they must outlive a trip to another view.
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets)

  // Starred ids live HERE, the nearest common parent of the two readers: the header
  // (count) and the inbox (stars, "starred only").
  //
  // Why a Set, not an array? The question every card asks is "am I starred?":
  // `set.has(id)` is O(1) and duplicates are impossible by construction. The cost:
  // updates must copy (`toggleInSet` → `new Set(prev)`), and a Set is not JSON.
  // Lazy initialiser `() => new Set()`: built once, not thrown away on every render.
  const [starredIds, setStarredIds] = useState<ReadonlySet<number>>(() => new Set())

  function toggleStar(id: number) {
    // Updater form: computed FROM the previous Set, so two quick clicks never read a stale one.
    setStarredIds((prev) => toggleInSet(prev, id))
  }

  /**
   * Called by the form (via InboxPage) — data flows DOWN as props, events flow UP as calls.
   * Handlers are where side effects belong: reading the clock is fine here, not in render.
   * Returns the created ticket so the caller can say what happened.
   */
  function createTicket(draft: TicketDraft, { star }: CreateOptions): Ticket {
    // `tickets` is this render's snapshot — fine for one submit per click.
    const ticket = draftToTicket(draft, nextTicketId(tickets), new Date().toISOString())
    setTickets((prev) => [ticket, ...prev]) // a NEW array: never push into state
    if (star) setStarredIds((prev) => new Set(prev).add(ticket.id))
    return ticket
  }

  return (
    <div className="app-shell">
      <AppHeader starredCount={starredIds.size} />
      <Sidebar active={view} onNavigate={setView} />
      <main className="app-main">
        {view === 'inbox' && (
          <InboxPage
            tickets={tickets}
            agents={agents}
            agentsById={agentsById}
            starredIds={starredIds}
            onToggleStar={toggleStar}
            onCreateTicket={createTicket}
          />
        )}
        {view === 'login' && <LoginPage />}
      </main>
    </div>
  )
}

export default App
