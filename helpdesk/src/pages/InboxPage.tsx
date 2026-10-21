import { useState } from 'react'
import { Button, ButtonGroup, Stack } from 'react-bootstrap'
import { PageHeader } from '../components/layout/PageHeader'
import { PrioritySelect } from '../components/tickets/PrioritySelect'
import { StatusFilter } from '../components/tickets/StatusFilter'
import { TicketList } from '../components/tickets/TicketList'
import { TicketSearch } from '../components/tickets/TicketSearch'
import {
  countByStatus,
  filterByPriority,
  filterByStatus,
  needsAttention,
  searchTickets,
  sortTickets,
} from '../lib/tickets'
import type { Filter, SortKey, SortOrder } from '../lib/tickets'
import type { Agent, Priority, Status, Ticket } from '../types'
import NewTicketDialog from '../components/tickets/NewTicketDialog'

/** Cards per "page" of the show-more button. */
const PAGE_SIZE = 9

type InboxSort = 'newest' | 'priority' | 'updated'

// A lookup object instead of an if/else chain: the branches are DATA, not markup.
const SORTS: Record<InboxSort, { label: string; key: SortKey; order: SortOrder }> = {
  newest: { label: 'Newest', key: 'createdAt', order: 'desc' },
  priority: { label: 'Priority', key: 'priority', order: 'desc' },
  updated: { label: 'Updated', key: 'updatedAt', order: 'desc' },
}
const SORT_IDS = Object.keys(SORTS) as InboxSort[]

interface InboxPageProps {
  tickets: readonly Ticket[]
  agentsById: ReadonlyMap<string, Agent>
  /** Owned by App: the header's starred count reads the same state. */
  starredIds: ReadonlySet<number>
  onToggleStar: (id: number) => void
}

export function InboxPage({ tickets, agentsById, starredIds, onToggleStar }: InboxPageProps) {
  // Only what the user CHOSE is state. `useState<…>` pins each one to its union.
  // `query` is LIFTED to here — the nearest common parent of the search box (writes it),
  // the list, the status counts and the header description (all read it). One source of truth.
  const [query, setQuery] = useState('')
  const [priority, setPriority] = useState<Filter<Priority>>('all')
  const [status, setStatus] = useState<Filter<Status>>('all')
  const [sort, setSort] = useState<InboxSort>('newest')
  const [starredOnly, setStarredOnly] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [showNewTicket, setShowNewTicket] = useState(false)

  // Everything else is DERIVED during render — no useState, so it can never disagree
  // with its source. 24 tickets filter + sort in microseconds; measure before you memo.
  // Search + priority first, so the status pills count what the search found — they update per keystroke.
  const searched = filterByPriority(searchTickets(tickets, query), priority)
  const counts = countByStatus(searched)
  const byStatus = filterByStatus(searched, status)
  const matching = sortTickets(
    starredOnly ? byStatus.filter((t) => starredIds.has(t.id)) : byStatus,
    SORTS[sort].key,
    SORTS[sort].order,
  )
  const shown = matching.slice(0, visibleCount)
  const remaining = matching.length - shown.length
  const attentionCount = tickets.filter((t) => needsAttention(t)).length

  // A new filter is a new list: start again from the first page. Two setters, ONE re-render (batching).
  function changeStatus(next: Filter<Status>) {
    setStatus(next)
    setVisibleCount(PAGE_SIZE)
  }

  function changeQuery(next: string) {
    setQuery(next)
    setVisibleCount(PAGE_SIZE)
  }

  function changePriority(next: Filter<Priority>) {
    setPriority(next)
    setVisibleCount(PAGE_SIZE)
  }

  function clearFilters() {
    setQuery('')
    setPriority('all')
    setStatus('all')
    setStarredOnly(false)
    setVisibleCount(PAGE_SIZE)
  }

  // Two different empties need two different messages.
  const empty =
    starredOnly && starredIds.size === 0
      ? { title: 'No starred tickets yet', hint: 'Click ☆ on a ticket to keep it here.' }
      : {
          title: query.trim() !== '' ? `No tickets match “${query.trim()}”` : 'No tickets match these filters',
          action: (
            <Button size="sm" variant="outline-primary" onClick={clearFilters}>
              Clear filters
            </Button>
          ),
        }

  return (
    <>
      <PageHeader
        title="Inbox"
        description={`${matching.length} of ${tickets.length} tickets · ${attentionCount} need attention`}
        actions={
          <>
            <Button variant="outline-secondary" size="sm">
              Export
            </Button>
            <Button onClick={ ()=> setShowNewTicket(true)} size="sm">New ticket</Button>
          </>
        }
      />

      <NewTicketDialog 
          show={showNewTicket}
          onCancel={ ()=> setShowNewTicket(false) }
      />

      <Stack direction="horizontal" gap={2} className="flex-wrap mb-3">
        <TicketSearch value={query} onChange={changeQuery} />
        <PrioritySelect value={priority} onChange={changePriority} />
      </Stack>

      <Stack direction="horizontal" gap={3} className="inbox-toolbar flex-wrap mb-3">
        <StatusFilter value={status} counts={counts} total={searched.length} onChange={changeStatus} />
        <Button
          size="sm"
          variant={starredOnly ? 'warning' : 'outline-secondary'}
          aria-pressed={starredOnly}
          onClick={() => {
            setStarredOnly((on) => !on) // updater: the next value depends on the previous one
            setVisibleCount(PAGE_SIZE)
          }}
        >
          ★ Starred only
        </Button>
        <ButtonGroup size="sm" aria-label="Sort tickets" className="ms-auto">
          {SORT_IDS.map((id) => (
            <Button
              key={id}
              variant={sort === id ? 'secondary' : 'outline-secondary'}
              aria-pressed={sort === id}
              onClick={() => setSort(id)}
            >
              {SORTS[id].label}
            </Button>
          ))}
        </ButtonGroup>
      </Stack>

      <TicketList
        tickets={shown}
        agentsById={agentsById}
        starredIds={starredIds}
        onToggleStar={onToggleStar}
        empty={empty}
      />

      {/* Render-or-nothing with a REAL boolean on the left: `remaining &&` would print 0. */}
      {remaining > 0 && (
        <div className="text-center mt-4">
          <Button variant="outline-primary" onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}>
            Show {Math.min(PAGE_SIZE, remaining)} more
          </Button>
          <p className="small text-body-secondary mt-2 mb-0">
            Showing {shown.length} of {matching.length}
          </p>
        </div>
      )}
    </>
  )
}
