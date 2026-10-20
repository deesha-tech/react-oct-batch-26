import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  hint?: string
  /** A way out ("Clear filters"). An empty list with no next step looks like a bug. */
  action?: ReactNode
}

export function EmptyState({ title, hint, action }: EmptyStateProps) {
  return (
    <div className="empty-state" role="status">
      <p className="fw-medium mb-1">{title}</p>
      {hint && <p className="small text-body-secondary mb-0">{hint}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
