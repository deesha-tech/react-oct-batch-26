import { Children, type ComponentProps } from 'react'
import { FieldShell } from './FieldShell'
import type { BaseFieldProps } from './FieldShell'

/**
 * Everything an <input> accepts (`ComponentProps<'input'>`: name, type, value,
 * defaultValue, onChange, onBlur, ref, autoComplete, required, …) plus the shell's
 * label/error/hint. Because the native props pass straight through, the SAME field
 * works with every form approach:
 *   controlled      → value + onChange
 *   FormData/Actions → name + defaultValue (+ required, minLength… for native validation)
 *   react-hook-form → {...register('title')} (name, onChange, onBlur, ref)
 *   Conform         → {...getInputProps(fields.title, { type: 'text' })}
 * In React 19 `ref` is an ordinary prop, so no forwardRef is needed for RHF to focus it.
 */
export interface TextFieldProps extends BaseFieldProps, Omit<ComponentProps<'input'>, 'id'> {
  id?: string
}

export function TextField({ id, label, error, hint, className, ...inputProps }: TextFieldProps) {
  return (
    <FieldShell label={label} error={error} hint={hint}>
      {(a11y) => (
        <input
          {...inputProps}
          {...a11y} // after the spread: the shell owns id / aria-*, a caller can't half-override them
          className={['form-control', error && 'is-invalid', className].filter(Boolean).join(' ')}
        />
      )}
    </FieldShell>
  )
}

