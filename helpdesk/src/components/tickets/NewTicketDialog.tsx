import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { Alert, Button, Col, Modal, Row } from 'react-bootstrap'
import { CheckboxField, PriorityPicker, SelectField, TagPicker, TextAreaField, TextField } from '../fields'
import { NEW_TICKET_EMPTY, TITLE_MAX, TITLE_MIN, newTicketSchema, toTicketDraft } from '../../lib/schemas'
import type { NewTicketInput, NewTicketValues } from '../../lib/schemas'
import type { Agent, TicketDraft } from '../../types'

export interface CreateOptions {
  /** "★ Star it for me" — the parent owns the starred ids, so it does the starring. */
  star: boolean
}

interface NewTicketFormProps {
  agents: readonly Agent[]
  tagOptions: readonly string[]
  onCreate: (draft: TicketDraft, options: CreateOptions) => void
  onCancel: () => void
}

/**
 * react-hook-form + zod, on the field library. Compare with a version
 * (one useState object, hand-written `isValid`): no state per field, no `set()`,
 * no touched bookkeeping, no guard clause — RHF owns the lifecycle, the schema owns
 * the rules, the fields own the markup. This component is orchestration only.
 */
function NewTicketForm({ agents, tagOptions, onCreate, onCancel }: NewTicketFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, submitCount, isSubmitting },
  } = useForm<NewTicketInput, unknown, NewTicketValues>({
    resolver: zodResolver(newTicketSchema), // the rules live in lib/schemas.ts, not in this JSX
    mode: 'onTouched', // first error on BLUR ("punish late")…
    reValidateMode: 'onChange', // …then re-checked on every keystroke until fixed ("reward early")
    defaultValues: NEW_TICKET_EMPTY,
    // shouldFocusError is on by default: a failed submit focuses the first invalid field
  })

  /** Only ever called with data that passed the schema — the guard clause is built in. */
  function onValid(values: NewTicketValues) {
    onCreate(toTicketDraft(values), { star: values.star })
  }

  const errorCount = Object.keys(errors).length
  const agentOptions = agents.map((a) => ({ value: a.id, label: `${a.name} · ${a.team}` }))

  return (
    <form noValidate onSubmit={handleSubmit(onValid)}>
      <Modal.Body>
        {/* A live region: screen readers announce it when a submit fails, sighted users see a summary. */}
        <div aria-live="assertive">
          {submitCount > 0 && errorCount > 0 && (
            <Alert variant="danger" className="py-2 small">
              {errorCount === 1 ? '1 field needs' : `${errorCount} fields need`} attention.
            </Alert>
          )}
        </div>

        <Row className="gx-3">
          <Col xs={12}>
            {/* register → name, onChange, onBlur, ref: TextField forwards all four, so no Controller needed */}
            <TextField
              label="Title"
              autoFocus
              maxLength={TITLE_MAX}
              error={errors.title?.message}
              hint={<TitleCounter control={control} />}
              {...register('title')}
            />
          </Col>
          <Col>
            <TextField label="Customer" error={errors.customer?.message} {...register('customer')} />
          </Col>
          <Col>
            <SelectField
              label="Assignee"
              placeholder="Unassigned"
              options={agentOptions}
              error={errors.assigneeId?.message}
              {...register('assigneeId')}
            />
          </Col>
          <Col xs={12}>
            {/* A non-native picker reports VALUES, not events — Controller adapts it to the form. */}
            <Controller
              name="priority"
              control={control}
              render={({ field, fieldState }) => (
                <PriorityPicker label="Priority" error={fieldState.error?.message} {...field} />
              )}
            />
          </Col>
          <Col xs={12}>
            <TextAreaField label="Description" error={errors.description?.message} {...register('description')} />
          </Col>
          <Col xs={12}>
            <Controller
              name="tags"
              control={control}
              render={({ field, fieldState }) => (
                <TagPicker label="Tags" options={tagOptions} error={fieldState.error?.message} {...field} />
              )}
            />
          </Col>
          <Col xs={12}>
            <CheckboxField label="★ Star it for me" className="mb-0" {...register('star')} />
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        {/* type="button": inside a <form>, a plain <button> SUBMITS. */}
        <Button type="button" variant="outline-secondary" onClick={onCancel}>
          Cancel
        </Button>
        {/* Never disabled while invalid: a disabled button can't explain WHY. Submit, then show the errors. */}
        <Button type="submit" disabled={isSubmitting}>
          Create ticket
        </Button>
      </Modal.Footer>
    </form>
  )
}

/**
 * `useWatch` in a CHILD: typing in the title re-renders this counter, not the whole form.
 * (`watch('title')` up in NewTicketForm would re-render every field on every keystroke.)
 */
function TitleCounter({ control }: { control: Control<NewTicketInput, unknown, NewTicketValues> }) {
  const title = useWatch({ control, name: 'title' })
  const short = title.trim().length > 0 && title.trim().length < TITLE_MIN
  return (
    <span className={short ? 'text-danger' : undefined}>
      {title.length}/{TITLE_MAX} · at least {TITLE_MIN} characters
    </span>
  )
}

interface NewTicketDialogProps extends NewTicketFormProps {
  show: boolean
}

/**
 * The form lives INSIDE the Modal, so it unmounts when the dialog closes — and its
 * state goes with it. Reopening starts from NEW_TICKET_EMPTY without a single reset line.
 */
export function NewTicketDialog({ show, onCancel, ...formProps }: NewTicketDialogProps) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title className="h6">New ticket</Modal.Title>
      </Modal.Header>
      <NewTicketForm {...formProps} onCancel={onCancel} />
    </Modal>
  )
}
