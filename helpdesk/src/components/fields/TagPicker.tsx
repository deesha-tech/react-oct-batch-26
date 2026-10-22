import type { Ref } from 'react'
import { FieldShell } from './FieldShell'
import type { BaseFieldProps } from './FieldShell'

export interface TagPickerProps extends BaseFieldProps {
  options: readonly string[]
  /** An ARRAY — a set of tags is not one value. */
  value: readonly string[]
  onChange: (value: string[]) => void
  onBlur?: () => void
  ref?: Ref<HTMLButtonElement>
  disabled?: boolean
}

/** Toggle chips. Non-native like PriorityPicker: value in, onChange(value[]) out. */
export function TagPicker({ label, error, hint, options, value, onChange, onBlur, ref, disabled }: TagPickerProps) {
  function toggle(tag: string) {
    // a NEW array either way: never push into a value someone else owns
    onChange(value.includes(tag) ? value.filter((t) => t !== tag) : [...value, tag])
  }

  return (
    <FieldShell group label={label} error={error} hint={hint}>
      {(a11y) => (
        <div className="d-flex flex-wrap gap-1" aria-invalid={a11y['aria-invalid']}>
          {options.map((tag, i) => {
            const on = value.includes(tag)
            return (
              <button
                key={tag}
                ref={i === 0 ? ref : undefined}
                type="button"
                className={`btn btn-sm rounded-pill ${on ? 'btn-primary' : 'btn-outline-secondary'}`}
                aria-pressed={on}
                disabled={disabled}
                onClick={() => toggle(tag)}
                onBlur={onBlur}
              >
                {tag}
              </button>
            )
          })}
        </div>
      )}
    </FieldShell>
  )
}
