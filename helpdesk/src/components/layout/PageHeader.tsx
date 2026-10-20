import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  /** Optional right-aligned area for page actions (buttons, filters). */
  actions?: ReactNode
}

export function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h1 className="h3 mb-0">{title}</h1>
      {actions}
    </div>
  )
}
