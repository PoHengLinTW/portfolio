import type { Field } from '@/lib/admin-schema'

const input =
  'w-full rounded-lg border border-line bg-surface px-3 py-2 text-fg-strong placeholder:text-muted focus:border-accent focus:outline-none'

export function FormField({ field, value, name = field.name }: { field: Field; value: unknown; name?: string }) {
  const id = `f-${name}`
  const help = field.help && (
    <p id={`${id}-help`} className="mt-1 text-sm text-muted">
      {field.help}
    </p>
  )
  const describedBy = field.help ? `${id}-help` : undefined

  if (field.type === 'boolean') {
    return (
      <div>
        <label className="flex min-h-11 items-center gap-3 font-medium text-fg-strong">
          <input type="checkbox" name={name} defaultChecked={Number(value) === 1} aria-describedby={describedBy} className="size-4 accent-[var(--accent)]" />
          {field.label}
        </label>
        {help}
      </div>
    )
  }

  let control: React.ReactNode
  const str = Array.isArray(value) ? value.join('\n') : value == null ? '' : String(value)
  switch (field.type) {
    case 'textarea':
      control = <textarea id={id} name={name} defaultValue={str} rows={3} className={input} aria-describedby={describedBy} />
      break
    case 'list':
      control = (
        <textarea id={id} name={name} defaultValue={str} rows={Math.min(12, Math.max(3, str.split('\n').length + 1))} className={input} aria-describedby={describedBy} />
      )
      break
    case 'markdown':
      control = (
        <textarea id={id} name={name} defaultValue={str} rows={24} spellCheck className={`${input} font-mono text-sm leading-relaxed`} aria-describedby={describedBy} />
      )
      break
    case 'number':
      control = <input id={id} type="number" name={name} defaultValue={str} className={`${input} max-w-32`} aria-describedby={describedBy} />
      break
    case 'date':
      control = <input id={id} type="date" name={name} defaultValue={str} className={`${input} max-w-48`} aria-describedby={describedBy} />
      break
    default:
      control = <input id={id} type="text" name={name} defaultValue={str} required={field.required} className={input} aria-describedby={describedBy} />
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-medium text-fg-strong">
        {field.label}
        {field.required && <span className="text-accent"> *</span>}
      </label>
      {control}
      {help}
    </div>
  )
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button type="submit" className="min-h-11 rounded-lg bg-accent px-5 font-medium text-bg hover:opacity-90">
      {children}
    </button>
  )
}

export function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p role="status" className="mt-4 rounded-lg border border-accent bg-accent-soft px-4 py-2 text-sm text-fg-strong">
      {children}
    </p>
  )
}
