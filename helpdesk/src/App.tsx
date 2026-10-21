import { useState } from "react";
import { AppHeader } from "./components/layout/AppHeader";
import { Sidebar } from "./components/layout/Sidebar";
import { agents } from "./data/agents";
import { draftToTicket, nextTicketId, tickets as initialTickets } from "./data/tickets";
import { byId, toggleInSet } from "./lib/tickets";
import { InboxPage } from "./pages/InboxPage";
import ControlledForm from "./pages/ControlledForm";
import UnControlledForm from "./pages/UnControlledForm";
import type { CreateOptions, Ticket, TicketDraft } from "./types";

// Built once at module scope: agents never change while the app runs.
const agentsById = byId(agents);

function App() {
  // Starred ids live HERE, the nearest common parent of the two readers: the header
  // (count) and the inbox (stars, "starred only").
  //
  // Why a Set, not an array? The question every card asks is "am I starred?":
  // `set.has(id)` is O(1) and duplicates are impossible by construction. The cost:
  // updates must copy (`toggleInSet` → `new Set(prev)`), and a Set is not JSON.
  // Lazy initialiser `() => new Set()`: built once, not thrown away on every render.
  const [starredIds, setStarredIds] = useState<ReadonlySet<number>>(
    () => new Set(),
  );

  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);

  function toggleStar(id: number) {
    // Updater form: computed FROM the previous Set, so two quick clicks never read a stale one.
    setStarredIds((prev) => toggleInSet(prev, id));
  }

  function createTicket(draft: TicketDraft, { star }: CreateOptions): Ticket {
  
    const ticket = draftToTicket(draft, nextTicketId(tickets),new Date().toISOString());

    setTickets((prev) => [ticket, ...prev]); // a NEW array: never push into state

    if (star) setStarredIds((prev) => new Set(prev).add(ticket.id));
    
    return ticket;
  }

  return (
    <div className="app-shell">
      <AppHeader starredCount={starredIds.size} />
      <Sidebar />
      <main className="app-main">
        
        <InboxPage
          tickets={tickets}
          agentsById={agentsById}
          starredIds={starredIds}
          onToggleStar={toggleStar}
          onCreateTicket={createTicket}
        />

        {/* <ControlledForm /> */}

        {/* <UnControlledForm /> */}
      </main>
    </div>
  );
}

export default App;
