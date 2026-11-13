import Link from 'next/link'
import type { Route } from 'next'
import { notFound } from 'next/navigation'
import { getDB } from '@/lib/db'
import { getEntity } from '@/lib/admin-schema'
import { Notice } from '../form-fields'

export default async function EntityList({ params, searchParams }: PageProps<'/admin/[entity]'>) {
  const [{ entity: key }, sp] = await Promise.all([params, searchParams])
  const entity = getEntity(key)
  if (!entity) notFound()

  const db = await getDB()
  const { results } = await db.prepare(`SELECT * FROM ${entity.table} ORDER BY ${entity.orderBy}`).all<Record<string, unknown>>()
  const hasPublished = entity.fields.some(f => f.name === 'published')

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-fg-strong">{entity.label}</h1>
        <Link href={`/admin/${key}/new` as Route} className="inline-flex min-h-11 items-center rounded-lg bg-accent px-5 font-medium text-bg hover:opacity-90">
          New {entity.singular}
        </Link>
      </div>
      {sp.saved && <Notice>Saved.</Notice>}
      {sp.deleted && <Notice>Deleted.</Notice>}

      {results.length === 0 ? (
        <p className="mt-8 text-muted">Nothing here yet.</p>
      ) : (
        <ul className="mt-8 divide-y divide-surface-line rounded-xl border border-surface-line bg-surface">
          {results.map(row => (
            <li key={String(row.id)} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <Link href={`/admin/${key}/${row.id}` as Route} className="font-medium text-fg-strong hover:text-accent">
                  {String(row[entity.titleField] || '(untitled)')}
                </Link>
                {entity.subtitleField && <p className="text-sm text-muted">{String(row[entity.subtitleField] ?? '')}</p>}
              </div>
              <div className="flex items-center gap-4 text-sm">
                {hasPublished && (
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${row.published ? 'bg-accent-soft text-accent' : 'bg-bg text-muted'}`}>
                    {row.published ? 'Published' : 'Draft'}
                  </span>
                )}
                {entity.publicPath && Boolean(row.published) && (
                  <Link href={entity.publicPath(row) as Route} className="text-muted hover:text-accent">
                    View ↗
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
