import type { Ref } from 'react'
import { PRIORITIES } from '../../types'
import type { Priority } from '../../types'
import { FieldShell } from './FieldShell'
import type { BaseFieldProps } from './FieldShell'

export interface PriorityPickerProps extends BaseFieldProps {
  /** '' = nothing picked yet. */
  value: Priority | ''
  /** Reports a VALUE, not a DOM event — like most UI-kit components (date pickers, comboboxes…). */
  onChange: (value: Priority) => void
  onBlur?: () => void
  /** Lets a form library focus it on a failed submit (React 19: ref is a plain prop). */
  ref?: Ref<HTMLButtonElement>
  disabled?: boolean
}

/**
 * A NON-NATIVE input: a row of toggle buttons. There is no <input>, no `name`, no
 * `e.target.value` — so react-hook-form's `register` has nothing to attach to, and
 * FormData can't see it. This is what `<Controller>` (and TanStack's `field` API) exist for.
 */
export function PriorityPicker({ label, error, hint, value, onChange, onBlur, ref, disabled }: PriorityPickerProps) {
  return (
    <FieldShell group label={label} error={error} hint={hint}>
      {(a11y) => (
        <div
          role="group"
          aria-invalid={a11y['aria-invalid']}
          className={['btn-group btn-group-sm', error && 'is-invalid'].filter(Boolean).join(' ')}
        >
          {PRIORITIES.map((p, i) => (
            <button
              key={p}
              // the ref goes on the selected button, or the first one, so focus lands somewhere sensible
              ref={value === p || (value === '' && i === 0) ? ref : undefined}
              type="button" // inside a <form>, a bare <button> SUBMITS
              className={`btn text-capitalize ${value === p ? 'btn-secondary' : 'btn-outline-secondary'}`}
              aria-pressed={value === p}
              disabled={disabled}
              onClick={() => onChange(p)}
              onBlur={onBlur}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </FieldShell>
  )
}
