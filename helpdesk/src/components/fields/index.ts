// The field library. One contract for every field:
//   native props pass through (value/onChange OR name/defaultValue OR {...register()})
//   error is DISPLAYED, never decided · the shell owns label, hint, error and their ids.
// Non-native pickers report values (onChange(value)) — the shape <Controller> adapts.
export { FieldShell } from './FieldShell'
export type { BaseFieldProps, ControlA11yProps } from './FieldShell'
export { TextField } from './TextField'
export type { TextFieldProps } from './TextField'
export { TextAreaField } from './TextAreaField'
export type { TextAreaFieldProps } from './TextAreaField'
export { SelectField } from './SelectField'
export type { Option, SelectFieldProps } from './SelectField'
export { CheckboxField } from './CheckboxField'
export type { CheckboxFieldProps } from './CheckboxField'
export { PriorityPicker } from './PriorityPicker'
export type { PriorityPickerProps } from './PriorityPicker'
export { TagPicker } from './TagPicker'
export type { TagPickerProps } from './TagPicker'
