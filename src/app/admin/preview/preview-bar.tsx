import Link from 'next/link'
import type { Route } from 'next'

/** Strip above the site header on admin previews: draft status, the editor, and the live page. */
export function PreviewBar({
  published,
  editPath,
  publicPath
}: {
  published: boolean
  editPath: string
  publicPath: string
}) {
  return (
    <div role="status" className="border-b border-line bg-accent-soft text-sm">
      <div className="mx-auto flex max-w-[1160px] flex-wrap items-center gap-x-6 px-4 sm:px-6">
        <span className="font-mono text-xs tracking-[0.1em] text-accent uppercase">
          {published ? 'Preview' : 'Draft preview · not public'}
        </span>
        <Link href={editPath as Route} className="flex min-h-10 items-center text-fg-strong hover:text-accent">
          ← Back to editor
        </Link>
        {published && (
          <Link href={publicPath as Route} className="flex min-h-10 items-center text-fg-sub hover:text-accent">
            Live page ↗
          </Link>
        )}
      </div>
    </div>
  )
}
