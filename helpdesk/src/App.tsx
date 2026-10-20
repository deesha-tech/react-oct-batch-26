import { AppHeader } from './components/layout/AppHeader'
import { PageHeader } from './components/layout/PageHeader'
import { Sidebar } from './components/layout/Sidebar'
import { tickets } from './data/tickets'

function App() {
  return (
    <div className="app-shell">
      <AppHeader />
      <Sidebar />
      <main className="app-main">
        <PageHeader title="Inbox" />
        <p className="text-body-secondary">{tickets.length} tickets</p>
      </main>
    </div>
  )
}

export default App
