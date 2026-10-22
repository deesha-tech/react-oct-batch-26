import type { ComponentProps } from 'react'
import { FieldShell } from './FieldShell'
import type { BaseFieldProps } from './FieldShell'

/** An <option>. The same shape for selects, pickers and checkbox groups. */
export interface Option<T extends string = string> {
  value: T
  label: string
}

export interface SelectFieldProps extends BaseFieldProps, Omit<ComponentProps<'select'>, 'id' | 'children'> {
  id?: string
  options: readonly Option[]
  /** Rendered as <option value="">, so "nothing chosen" is the empty string. */
  placeholder?: string
}

export function SelectField({
  id,
  label,
  error,
  hint,
  className,
  options,
  placeholder,
  ...selectProps
}: SelectFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      {(a11y) => (
        <select
          {...selectProps}
          {...a11y}
          className={['form-select', error && 'is-invalid', className].filter(Boolean).join(' ')}
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </FieldShell>
  )
}
