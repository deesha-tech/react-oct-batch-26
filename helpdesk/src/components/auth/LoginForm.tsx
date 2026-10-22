import { useState } from 'react'
import type { ChangeEvent, SubmitEvent } from 'react'
import { Button, Form } from 'react-bootstrap'

// The participants' original LoginForm, cleaned up:
//  - INITAL_DATA → INITIAL_DATA, "passwrod" → "password"
//  - `ChangeEvent` → `ChangeEvent<HTMLInputElement>`: the bare type's target is an
//    `Element`, which has no `.value` — that line could not compile under `strict`
//  - a real submit: `onSubmit` on the <form> + `preventDefault`, and type="submit" on the button
//  - a "remember me" checkbox, so the one handler has to deal with `checked`
//  - a named export, and the page layout (Container/Row/Col/h1) moved out to LoginPage
//
// The approach it shows: ONE STATE OBJECT + ONE `[name]: value` HANDLER for every field.

export interface LoginCredentials {
  email: string
  password: string
  remember: boolean
}

const INITIAL_DATA: LoginCredentials = { email: '', password: '', remember: false }

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => void
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [data, setData] = useState<LoginCredentials>(INITIAL_DATA)

  // Derived, not stored: nothing to keep in sync.
  const canSubmit = data.email.trim() !== '' && data.password !== ''

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = event.target
    // The input's `name` IS the state key (a computed key). The cost of the pattern:
    // name="emial" silently adds a NEW key and the field stops updating — TS can't see it.
    setData((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault() // without it the browser does a full-page GET to "?email=…&password=…"
    onSubmit({ ...data, email: data.email.trim() })
    setData((current) => ({ ...current, password: '' })) // never leave a password sitting in state
  }

  return (
    // The handler goes on the FORM, not the button: Enter in either field submits too.
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="loginForm.email">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          value={data.email}
          onChange={handleChange}
          type="email"
          name="email"
          autoComplete="username"
          placeholder="name@example.com"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="loginForm.password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          value={data.password}
          onChange={handleChange}
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Enter your password"
        />
      </Form.Group>

      <Form.Check
        className="mb-3"
        id="loginForm.remember"
        type="checkbox"
        name="remember"
        label="Remember me"
        checked={data.remember}
        onChange={handleChange}
      />

      <Button type="submit" disabled={!canSubmit}>
        Sign in
      </Button>
    </Form>
  )
}
