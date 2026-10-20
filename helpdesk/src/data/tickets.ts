import type { Ticket } from '../types'

export const tickets: Ticket[] = [
  {
    id: 1042,
    title: 'Cannot log in after password reset',
    customer: 'Northwind Traders',
    priority: 'high',
    status: 'open',
    assignee: 'Priya',
  },
  {
    id: 1043,
    title: 'Invoice shows wrong VAT rate',
    customer: 'Contoso Ltd',
    priority: 'medium',
    status: 'open',
  },
  {
    id: 1044,
    title: 'CSV export times out for large reports',
    customer: 'Fabrikam Inc',
    priority: 'high',
    status: 'in-progress',
    assignee: 'Marco',
  },
  {
    id: 1045,
    title: 'Feature request: dark mode',
    customer: 'Adventure Works',
    priority: 'low',
    status: 'open',
  },
  {
    id: 1046,
    title: 'Update billing address',
    customer: 'Tailspin Toys',
    priority: 'low',
    status: 'resolved',
    assignee: 'Aisha',
  },
]
