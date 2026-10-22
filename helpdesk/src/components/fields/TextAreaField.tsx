import type { ComponentProps } from 'react'
import { FieldShell } from './FieldShell'
import type { BaseFieldProps } from './FieldShell'

export interface TextAreaFieldProps extends BaseFieldProps, Omit<ComponentProps<'textarea'>, 'id'> {
  id?: string
}

/** Same contract as TextField, for a <textarea> (which takes `value`, never children). */
export function TextAreaField({ id, label, error, hint, className, rows = 3, ...textareaProps }: TextAreaFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      {(a11y) => (
        <textarea
          rows={rows}
          {...textareaProps}
          {...a11y}
          className={['form-control', error && 'is-invalid', className].filter(Boolean).join(' ')}
        />
      )}
    </FieldShell>
  )
}
