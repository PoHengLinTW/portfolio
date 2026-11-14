import type { Post } from '@/lib/db'
import { renderMarkdown } from '@/lib/markdown'
import { PageShell } from './page-shell'

/** A writing post as it appears at /writing/[slug]. Shared with the admin draft preview. */
export function PostView({ post }: { post: Post }) {
  const { html, toc } = renderMarkdown(post.body_md)
  const chapters = toc.filter(t => t.depth === 2).map(t => ({ id: t.id, label: t.text }))
  return (
    <PageShell
      back={{ href: '/writing', label: 'All writing' }}
      eyebrow={post.published_at}
      title={post.title}
      intro={post.summary}
      nav={{ items: chapters, label: 'On this page', variant: 'toc' }}
    >
      <article className="prose-site max-w-[680px]" dangerouslySetInnerHTML={{ __html: html }} />
    </PageShell>
  )
}
