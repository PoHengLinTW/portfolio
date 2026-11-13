import Link from 'next/link'
import type { Route } from 'next'
import { notFound } from 'next/navigation'
import { getDB, LIST_COLUMNS } from '@/lib/db'
import { getEntity } from '@/lib/admin-schema'
import { deleteEntity, saveEntity } from '../../actions'
import { FormField, SubmitButton } from '../../form-fields'

export default async function EntityEdit({ params }: PageProps<'/admin/[entity]/[id]'>) {
  const { entity: key, id } = await params
  const entity = getEntity(key)
  if (!entity) notFound()

  let row: Record<string, unknown> = {}
  if (id !== 'new') {
    const db = await getDB()
    const found = await db.prepare(`SELECT * FROM ${entity.table} WHERE id = ?`).bind(Number(id)).first<Record<string, unknown>>()
    if (!found) notFound()
    row = found
    for (const k of Object.keys(row)) {
      if (LIST_COLUMNS.has(k) && typeof row[k] === 'string') {
        try {
          row[k] = JSON.parse(row[k] as string)
        } catch {
          /* leave as-is */
        }
      }
    }
  }

  const save = saveEntity.bind(null, key, id)
  const remove = deleteEntity.bind(null, key, id)

  return (
    <>
      <Link href={`/admin/${key}` as Route} className="eyebrow inline-flex min-h-11 items-center hover:text-fg-strong">
        ← {entity.label}
      </Link>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-fg-strong">
        {id === 'new' ? `New ${entity.singular}` : String(row[entity.titleField] || `Edit ${entity.singular}`)}
      </h1>

      <form action={save} className="mt-8 flex max-w-3xl flex-col gap-6">
        {entity.fields.map(f => (
          <FormField key={f.name} field={f} value={row[f.name] ?? (f.type === 'number' ? 0 : '')} />
        ))}
        <div>
          <SubmitButton>{id === 'new' ? 'Create' : 'Save changes'}</SubmitButton>
        </div>
      </form>

      {id !== 'new' && (
        <form action={remove} className="mt-16 max-w-3xl border-t border-line pt-6">
          <p className="mb-3 text-sm text-muted">Deleting can’t be undone.</p>
          <button type="submit" className="min-h-11 rounded-lg border border-red-500/60 px-5 font-medium text-red-600 hover:bg-red-500/10 dark:text-red-400">
            Delete {entity.singular}
          </button>
        </form>
      )}
    </>
  )
}
