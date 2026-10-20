import { Col, Container, Row } from 'react-bootstrap'
import { Header } from './components/Header'
import { SideNav } from './components/SideNav'
import { MainPanel } from './components/MainPanel'
import { tickets } from './data/tickets'

function App() {
  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col>
          <Header />
        </Col>
      </Row>
      <Row className="g-0">
        <Col md={3} className="bg-white border-end min-vh-100">
          <SideNav />
        </Col>
        <Col md={9}>
          <MainPanel title="Inbox" tickets={tickets} />
        </Col>
      </Row>
    </Container>
  )
}

export default App