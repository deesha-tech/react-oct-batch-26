import { useState } from "react";
import { Alert, Button, ButtonGroup, Stack } from "react-bootstrap";
import { PageHeader } from "../components/layout/PageHeader";
import { NewTicketDialog } from "../components/tickets/NewTicketDialog";
import type { CreateOptions } from "../components/tickets/NewTicketDialog";
import { PrioritySelect } from "../components/tickets/PrioritySelect";
import { StatusFilter } from "../components/tickets/StatusFilter";
import { TicketList } from "../components/tickets/TicketList";
import { TicketSearch } from "../components/tickets/TicketSearch";
import { formatTicketId } from "../lib/format";
import {
  allTags,
  countByStatus,
  filterByPriority,
  filterByStatus,
  needsAttention,
  searchTickets,
  sortTickets,
} from "../lib/tickets";
import type { Filter, SortKey, SortOrder } from "../lib/tickets";
import type { Agent, Priority, Status, Ticket, TicketDraft } from "../types";
import Counter from "../components/Counter";
import DemoForm from "../components/DemoForm";
import Products from "../components/Products";
import Products19 from "../components/Products19";
import DemoComponent from "../components/DemoComponent";

/** Cards per "page" of the show-more button. */
const PAGE_SIZE = 9;

type InboxSort = "newest" | "priority" | "updated";

// A lookup object instead of an if/else chain: the branches are DATA, not markup.
const SORTS: Record<
  InboxSort,
  { label: string; key: SortKey; order: SortOrder }
> = {
  newest: { label: "Newest", key: "createdAt", order: "desc" },
  priority: { label: "Priority", key: "priority", order: "desc" },
  updated: { label: "Updated", key: "updatedAt", order: "desc" },
};
const SORT_IDS = Object.keys(SORTS) as InboxSort[];

interface InboxPageProps {
  /** Owned by App: the new-ticket form adds to it, and it outlives this page. */
  tickets: readonly Ticket[];
  agents: readonly Agent[];
  agentsById: ReadonlyMap<string, Agent>;
  /** Owned by App: the header's starred count reads the same state. */
  starredIds: ReadonlySet<number>;
  onToggleStar: (id: number) => void;
  /** `onX` for the prop, `handleX`/a verb for the implementation (App's `createTicket`). */
  onCreateTicket: (draft: TicketDraft, options: CreateOptions) => Ticket;
}

export function InboxPage({
  tickets,
  agents,
  agentsById,
  starredIds,
  onToggleStar,
  onCreateTicket,
}: InboxPageProps) {
  // Only what the user CHOSE is state. `useState<…>` pins each one to its union.
  // `query` is LIFTED to here — the nearest common parent of the search box (writes it),
  // the list, the status counts and the header description (all read it). One source of truth.
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState<Filter<Priority>>("all");
  const [status, setStatus] = useState<Filter<Status>>("all");
  const [sort, setSort] = useState<InboxSort>("newest");
  const [starredOnly, setStarredOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showNewTicket, setShowNewTicket] = useState(false);
  /** The last ticket the form created — drives the success alert. */
  const [created, setCreated] = useState<Ticket | null>(null);

  // Everything else is DERIVED during render — no useState, so it can never disagree
  // with its source. 24 tickets filter + sort in microseconds; measure before you memo.
  // Search + priority first, so the status pills count what the search found — they update per keystroke.
  const searched = filterByPriority(searchTickets(tickets, query), priority);
  const counts = countByStatus(searched);
  const byStatus = filterByStatus(searched, status);
  const matching = sortTickets(
    starredOnly ? byStatus.filter((t) => starredIds.has(t.id)) : byStatus,
    SORTS[sort].key,
    SORTS[sort].order,
  );
  const shown = matching.slice(0, visibleCount);
  const remaining = matching.length - shown.length;
  const attentionCount = tickets.filter((t) => needsAttention(t)).length;
  const tagOptions = allTags(tickets);
  const createdIsHidden =
    created !== null && !matching.some((t) => t.id === created.id);

  // A new filter is a new list: start again from the first page. Two setters, ONE re-render (batching).
  function changeStatus(next: Filter<Status>) {
    setStatus(next);
    setVisibleCount(PAGE_SIZE);
  }

  function changeQuery(next: string) {
    setQuery(next);
    setVisibleCount(PAGE_SIZE);
  }

  function changePriority(next: Filter<Priority>) {
    setPriority(next);
    setVisibleCount(PAGE_SIZE);
  }

  function clearFilters() {
    setQuery("");
    setPriority("all");
    setStatus("all");
    setStarredOnly(false);
    setVisibleCount(PAGE_SIZE);
  }

  function handleCreate(draft: TicketDraft, options: CreateOptions) {
    setCreated(onCreateTicket(draft, options));
    setShowNewTicket(false);
  }

  // Two different empties need two different messages.
  const empty =
    starredOnly && starredIds.size === 0
      ? {
          title: "No starred tickets yet",
          hint: "Click ☆ on a ticket to keep it here.",
        }
      : {
          title:
            query.trim() !== ""
              ? `No tickets match “${query.trim()}”`
              : "No tickets match these filters",
          action: (
            <Button size="sm" variant="outline-primary" onClick={clearFilters}>
              Clear filters
            </Button>
          ),
        };

  return (
    // <Counter />

    // <Products19 />

    <DemoComponent />

    // <>

    //   <PageHeader
    //     title="Inbox"
    //     description={`${matching.length} of ${tickets.length} tickets · ${attentionCount} need attention`}
    //     actions={
    //       <>
    //         <Button variant="outline-secondary" size="sm">
    //           Export
    //         </Button>
    //         {/* PASS a function. `onClick={setShowNewTicket(true)}` would CALL it during render. */}
    //         <Button size="sm" onClick={() => setShowNewTicket(true)}>
    //           New ticket
    //         </Button>
    //       </>
    //     }
    //   />

    //   {created && (
    //     <Alert variant="success" dismissible onClose={() => setCreated(null)}>
    //       {formatTicketId(created.id)} “{created.title}” created.
    //       {createdIsHidden && (
    //         <>
    //           {' '}
    //           The current filters hide it —{' '}
    //           <Button variant="link" className="alert-link p-0 align-baseline" onClick={clearFilters}>
    //             clear filters
    //           </Button>
    //           .
    //         </>
    //       )}
    //     </Alert>
    //   )}

    //   <Stack direction="horizontal" gap={2} className="flex-wrap mb-3">
    //     <TicketSearch value={query} onChange={changeQuery} />
    //     <PrioritySelect value={priority} onChange={changePriority} />
    //   </Stack>

    //   <Stack direction="horizontal" gap={3} className="inbox-toolbar flex-wrap mb-3">
    //     <StatusFilter value={status} counts={counts} total={searched.length} onChange={changeStatus} />
    //     <Button
    //       size="sm"
    //       variant={starredOnly ? 'warning' : 'outline-secondary'}
    //       aria-pressed={starredOnly}
    //       onClick={() => {
    //         setStarredOnly((on) => !on) // updater: the next value depends on the previous one
    //         setVisibleCount(PAGE_SIZE)
    //       }}
    //     >
    //       ★ Starred only
    //     </Button>
    //     <ButtonGroup size="sm" aria-label="Sort tickets" className="ms-auto">
    //       {SORT_IDS.map((id) => (
    //         <Button
    //           key={id}
    //           variant={sort === id ? 'secondary' : 'outline-secondary'}
    //           aria-pressed={sort === id}
    //           onClick={() => setSort(id)}
    //         >
    //           {SORTS[id].label}
    //         </Button>
    //       ))}
    //     </ButtonGroup>
    //   </Stack>

    //   <TicketList
    //     tickets={shown}
    //     agentsById={agentsById}
    //     starredIds={starredIds}
    //     onToggleStar={onToggleStar}
    //     empty={empty}
    //   />

    //   <NewTicketDialog
    //     show={showNewTicket}
    //     agents={agents}
    //     tagOptions={tagOptions}
    //     onCreate={handleCreate}
    //     onCancel={() => setShowNewTicket(false)}

    //   />

    //   {/* Render-or-nothing with a REAL boolean on the left: `remaining &&` would print 0. */}
    //   {remaining > 0 && (
    //     <div className="text-center mt-4">
    //       <Button variant="outline-primary" onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}>
    //         Show {Math.min(PAGE_SIZE, remaining)} more
    //       </Button>
    //       <p className="small text-body-secondary mt-2 mb-0">
    //         Showing {shown.length} of {matching.length}
    //       </p>
    //     </div>
    //   )}
    // </>
  );
}
