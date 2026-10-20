// Domain types shared across the app.

export type Priority = 'low' | 'medium' | 'high'

export type Status = 'open' | 'in-progress' | 'resolved'

export interface Ticket {
  id: number
  title: string
  customer: string
  priority: Priority
  status: Status
  assignee?: string
}
