import { Button } from 'react-bootstrap'

interface StarToggleProps {
  starred: boolean
  /** Used in the accessible label — "Star Cannot log in…" beats twenty buttons called "Star". */
  ticketTitle: string
  onToggle: () => void
}

/**
 * CONTROLLED: it holds no state. The parent says whether it is starred and is
 * told when it is clicked — so the parent can count stars, filter by them and
 * keep them when this card unmounts.
 */
export function StarToggle({ starred, ticketTitle, onToggle }: StarToggleProps) {
  return (
    <Button
      variant="link"
      className="star-btn"
      aria-pressed={starred}
      aria-label={starred ? `Unstar ${ticketTitle}` : `Star ${ticketTitle}`}
      title={starred ? 'Unstar' : 'Star'}
      // PASS the function. `onClick={onToggle()}` would CALL it during render → "Too many re-renders".
      onClick={onToggle}
    >
      {starred ? '★' : '☆'}
    </Button>
  )
}
