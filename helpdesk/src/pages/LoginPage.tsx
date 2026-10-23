import { useState } from 'react'
import { Alert, Card, Col, Row } from 'react-bootstrap'
import { LoginForm } from '../components/auth/LoginForm'
import type { LoginCredentials } from '../components/auth/LoginForm'
import { PageHeader } from '../components/layout/PageHeader'

/**
 * No auth yet — a real login replaces this handler later.
 * Today the page only proves the form hands over clean, typed data.
 */
export function LoginPage() {
  // Keep only what the page shows: the password stops at the form's edge.
  const [submitted, setSubmitted] = useState<Omit<LoginCredentials, 'password'> | null>(null)

  return (
    <>
      <PageHeader
        title="Sign in"
        description="Validated with the field library and a zod schema."
      />
      <Row>
        <Col md={8} lg={5}>
          <Card body>
            <LoginForm onSubmit={({ email, remember }) => setSubmitted({ email, remember })} />
          </Card>
          {submitted && (
            <Alert variant="info" className="mt-3 mb-0" dismissible onClose={() => setSubmitted(null)}>
              Would sign in as <strong>{submitted.email}</strong>
              {submitted.remember ? ' and remember this device' : ''}. Real authentication comes later.
            </Alert>
          )}
        </Col>
      </Row>
    </>
  )
}
