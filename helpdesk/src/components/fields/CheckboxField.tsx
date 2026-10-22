import { useId } from 'react'
import type { ComponentProps, ReactNode } from 'react'

export interface CheckboxFieldProps extends Omit<ComponentProps<'input'>, 'type' | 'id'> {
  id?: string
  label: ReactNode
  error?: string
}

/**
 * A checkbox carries its label AFTER the box, so it doesn't use FieldShell's
 * label-above layout — but the wiring (useId, aria-invalid, aria-describedby) is the same.
 * Controlled use reads `checked` / `e.target.checked`, never `value`.
 */
export function CheckboxField({ id, label, error, className, ...inputProps }: CheckboxFieldProps) {
  const generated = useId()
  const controlId = id ?? generated
  const errorId = `${controlId}-error`
  return (
    <div className={['form-check', className ?? 'mb-3'].join(' ')}>
      <input
        {...inputProps}
        type="checkbox"
        id={controlId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={['form-check-input', error && 'is-invalid'].filter(Boolean).join(' ')}
      />
      <label htmlFor={controlId} className="form-check-label small">
        {label}
      </label>
      {error && (
        <div id={errorId} className="invalid-feedback d-block">
          {error}
        </div>
      )}
    </div>
  )
}
