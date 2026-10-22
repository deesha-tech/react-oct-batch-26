import { useId } from 'react'
import type { ReactNode } from 'react'
import { FieldShell, TextField } from '.'

/** What FieldShell hands its control: everything the label/hint/error wiring needs. */
export interface ControlA11yProps {
  id: string
  /** `undefined`, not `false`: React then omits the attribute entirely. */
  'aria-invalid': true | undefined
  /** Points at the hint and/or the error — screen readers read them after the label. */
  'aria-describedby': string | undefined
}

/** The props every field component shares, on top of its native element's props. */
export interface BaseFieldProps {
  label: ReactNode
  /** Displayed, never decided: the FORM decides whether there is an error and when to show it. */
  error?: string
  hint?: ReactNode
}

interface FieldShellProps extends BaseFieldProps {
  /** Use the caller's id when given (rare); otherwise a generated one. */
  id?: string
  /** A group of controls (radios, toggle buttons) → <fieldset> + <legend> instead of <label>. */
  group?: boolean
  className?: string
  /** Render prop: the shell owns the ids, the field owns the control. */
  children: (a11y: ControlA11yProps) => ReactNode
}

/**
 * Label + control + hint + error, decided ONCE for every field in the app.
 *
 * Why `useId` and not a hard-coded id or `Math.random()`? Ids must be unique per
 * INSTANCE (two TextFields on a page must not share one, or every label focuses the
 * first input) and stable between renders and between server and client (hydration).
 * `useId` is exactly that — and it is why callers never pass ids any more.
 */
export function FieldShell({ id, label, error, hint, group = false, className = 'mb-3', children }: FieldShellProps) {
  const generated = useId()
  const controlId = id ?? generated
  const hintId = `${controlId}-hint`
  const errorId = `${controlId}-error`

  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined
  const a11y: ControlA11yProps = {
    id: controlId,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
  }

  const messages = (
    <>
      {hint && (
        <div id={hintId} className="form-text">
          {hint}
        </div>
      )}
      {/* d-block: Bootstrap only shows .invalid-feedback next to an .is-invalid sibling; we decide here. */}
      {error && (
        <div id={errorId} className="invalid-feedback d-block">
          {error}
        </div>
      )}
    </>
  )

  if (group) {
    return (
      <fieldset className={className} aria-describedby={describedBy}>
        <legend className="form-label small fw-semibold mb-1">{label}</legend>
        {children(a11y)}
        {messages}
      </fieldset>
    )
  }

  return (
    <div className={className}>
      <label htmlFor={controlId} className="form-label small fw-semibold">
        {label}
      </label>
      {children(a11y)}
      {messages}
    </div>
  )
}
