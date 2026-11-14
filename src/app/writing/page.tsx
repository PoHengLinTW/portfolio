import type { Metadata } from 'next'
import Link from 'next/link'
import { getPosts } from '@/lib/db'
import { PageShell } from '@/components/page-shell'

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Notes on web platforms, infrastructure and engineering.'
}

export default async function WritingPage() {
  const posts = await getPosts()
  return (
    <PageShell
      eyebrow="Writing"
      title="Notes"
      intro="Occasional write-ups on web platforms and infrastructure."
      nav={{ items: posts.map(p => ({ id: p.slug, label: p.title })), label: 'Posts', variant: 'toc' }}
    >
      {posts.length === 0 ? (
        <p className="text-muted">Nothing published yet. Check back soon.</p>
      ) : (
        <ul className="flex flex-col">
          {posts.map(p => (
            <li key={p.id} id={p.slug} className="flex flex-wrap gap-x-6 gap-y-1 border-t border-surface-line py-5">
              <time className="basis-[140px] font-mono text-xs leading-7 tracking-wide text-muted">{p.published_at}</time>
              <div className="min-w-0 flex-[1_1_320px]">
                <Link href={`/writing/${p.slug}`} className="text-lg font-medium text-fg-strong hover:text-accent">
                  {p.title}
                </Link>
                {p.summary && <p className="mt-1">{p.summary}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  )
}
