import { useRef, useState } from 'react'
import type { ChangeEvent, FocusEvent, SubmitEvent } from 'react'
import { Button } from 'react-bootstrap'
import { CheckboxField, TextField } from '../fields'
import { firstErrors, loginSchema } from '../../lib/schemas'
import type { LoginCredentials } from '../../lib/schemas'

// The participants' original LoginForm, cleaned up and
// validated BY HAND on top of the field library, so the app shows both shapes:
// this form (manual: derived errors + touched), and NewTicketDialog (react-hook-form).
//
// The rules are not hand-written any more: `loginSchema` (lib/schemas.ts) holds them
// and LoginCredentials is DERIVED from it with z.infer — re-exported here so the
// page's import didn't change.
export type { LoginCredentials }

const INITIAL_DATA: LoginCredentials = { email: '', password: '', remember: false }

type Field = keyof LoginCredentials
type Touched = Partial<Record<Field, boolean>>

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => void
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [data, setData] = useState<LoginCredentials>(INITIAL_DATA)
  const [touched, setTouched] = useState<Touched>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  // 1. WHAT is wrong — derived every render, never stored (a stored copy lags a keystroke).
  const result = loginSchema.safeParse(data)
  const errors = result.success ? {} : firstErrors(result.error)

  // 2. WHEN to say so — only after the user has left the field, or tried to submit.
  function errorFor(field: Field): string | undefined {
    return touched[field] || submitAttempted ? errors[field] : undefined
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = event.target
    setData((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    const field = event.target.name as Field
    setTouched((current) => ({ ...current, [field]: true }))
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault() // without it the browser does a full-page GET to "?email=…&password=…"
    setSubmitAttempted(true)
    if (!result.success) {
      // Focus the first invalid field, or a keyboard user hears nothing and has no idea where to go.
      // (Its error message is wired to it with aria-describedby, so it is read out on focus.)
      const first = Object.keys(errors)[0]
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return // the ONE guard: only valid data leaves this form
    }
    onSubmit(result.data) // parsed by the schema — typed AND checked
    setData((current) => ({ ...current, password: '' })) // never leave a password sitting in state
    setTouched({})
    setSubmitAttempted(false)
  }

  const invalidCount = Object.keys(errors).length

  return (
    // noValidate: the schema decides, and our messages replace the browser's bubbles.
    <form ref={formRef} noValidate onSubmit={handleSubmit}>
      <TextField
        label="Email address"
        type="email"
        name="email"
        autoComplete="username"
        placeholder="name@example.com"
        value={data.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errorFor('email')}
      />
      <TextField
        label="Password"
        type="password"
        name="password"
        autoComplete="current-password"
        value={data.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errorFor('password')}
      />
      <CheckboxField label="Remember me" name="remember" checked={data.remember} onChange={handleChange} />

      {/* Live region: always in the DOM, so the text that appears inside it gets announced. */}
      <p className="small text-danger" role="status" aria-live="polite">
        {submitAttempted && invalidCount > 0
          ? `Fix ${invalidCount === 1 ? 'the highlighted field' : `${invalidCount} fields`} to sign in.`
          : ''}
      </p>

      {/* Not disabled while invalid: a disabled button can't tell anyone WHY. */}
      <Button type="submit">Sign in</Button>
    </form>
  )
}
