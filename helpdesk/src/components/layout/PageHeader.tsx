import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  /**
   * A SLOT: any renderable thing (one button, three, a dropdown, a count).
   * The header positions it and never needs a new prop for the next idea —
   * composition over configuration.
   */
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
      <div>
        <h1 className="h3 mb-0">{title}</h1>
        {description && <p className="text-body-secondary mb-0 mt-1">{description}</p>}
      </div>
      {actions && <div className="d-flex align-items-center gap-2">{actions}</div>}
    </div>
  )
}
