import Link from 'next/link'
import { getDB } from '@/lib/db'
import { ENTITIES } from '@/lib/admin-schema'

export default async function AdminHome() {
  const db = await getDB()
  const counts = await db.batch(
    Object.values(ENTITIES).map(e => db.prepare(`SELECT COUNT(*) AS n FROM ${e.table}`))
  )
  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight text-fg-strong">Content</h1>
      <p className="mt-2 text-muted">Changes go live immediately. No redeploy needed.</p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        <li>
          <Link href="/admin/settings" className="block rounded-xl border border-surface-line bg-surface p-5 hover:border-accent">
            <p className="font-medium text-fg-strong">Settings</p>
            <p className="text-sm text-muted">Identity, links, About</p>
          </Link>
        </li>
        {Object.entries(ENTITIES).map(([key, e], i) => {
          const n = (counts[i].results[0] as { n: number } | undefined)?.n ?? 0
          return (
            <li key={key}>
              <Link href={`/admin/${key}`} className="block rounded-xl border border-surface-line bg-surface p-5 hover:border-accent">
                <p className="font-medium text-fg-strong">{e.label}</p>
                <p className="text-sm text-muted">
                  {n} {n === 1 ? e.singular : `${e.singular}s`}
                </p>
              </Link>
            </li>
          )
        })}
      </ul>
    </>
  )
}
