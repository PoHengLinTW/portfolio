import Link from 'next/link'
import type { Route } from 'next'
import { getPostStats, type StatTotals } from '@/lib/stats'

export const metadata = { title: 'Post stats' }

const fmt = (n: number) => n.toLocaleString('en-US')

function Cells({ totals, muted = false }: { totals: StatTotals; muted?: boolean }) {
  const cls = `px-4 py-3 text-right ${muted ? 'text-muted' : ''}`
  return (
    <>
      <td className={cls}>{fmt(totals.views)}</td>
      <td className={cls}>{fmt(totals.visitors)}</td>
      <td className={cls}>{fmt(totals.reads)}</td>
    </>
  )
}

export default async function StatsPage() {
  const posts = await getPostStats()
  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight text-fg-strong">Post stats</h1>
      <p className="mt-2 max-w-prose text-muted">
        Cookie-free counts for writing posts. Visitors are unique per day, so someone who comes back on another day counts again. A read is
        a visitor who scrolled 60% of the post and spent 30 seconds on it; read counts are shown publicly on each post. For site-wide
        traffic, use Cloudflare Web Analytics.
      </p>

      {posts.length === 0 ? (
        <p className="mt-8 text-muted">No post visits recorded yet.</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-surface-line bg-surface">
          <table className="w-full text-sm">
            <thead className="text-left text-muted">
              <tr>
                <th rowSpan={2} className="px-4 py-3 align-bottom font-medium">
                  Post
                </th>
                <th colSpan={3} className="px-4 pt-3 text-right font-medium">
                  All time
                </th>
                <th colSpan={3} className="px-4 pt-3 text-right font-medium">
                  Last 30 days
                </th>
              </tr>
              <tr className="border-b border-surface-line">
                {['Views', 'Visitors', 'Reads', 'Views', 'Visitors', 'Reads'].map((h, i) => (
                  <th key={i} className="px-4 pt-1 pb-3 text-right font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-line tabular-nums">
              {posts.map(p => (
                <tr key={p.slug}>
                  <td className="max-w-72 truncate px-4 py-3">
                    <Link href={`/writing/${p.slug}` as Route} className="text-fg-strong hover:text-accent">
                      {p.title ?? p.slug}
                    </Link>
                  </td>
                  <Cells totals={p} />
                  <Cells totals={{ views: p.recentViews, visitors: p.recentVisitors, reads: p.recentReads }} muted />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
