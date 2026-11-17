import type { Post } from '@/lib/db'
import { renderMarkdown } from '@/lib/markdown'
import { PageShell } from './page-shell'
import { AuthorCard } from './author-card'
import { TocRail } from './toc-rail'

/** A writing post as it appears at /writing/[slug]. Shared with the admin draft preview. */
export function PostView({ post, reads = 0 }: { post: Post; reads?: number }) {
  const { html, toc } = renderMarkdown(post.body_md)
  // Sections and sub-sections go in the right-hand rail; the left column keeps just the intro.
  const outline = toc.filter(t => t.depth <= 3)
  return (
    <PageShell
      back={{ href: '/writing', label: 'All writing' }}
      eyebrow={[post.published_at, reads > 0 && `${reads.toLocaleString('en-US')} ${reads === 1 ? 'read' : 'reads'}`].filter(Boolean).join(' · ')}
      title={post.title}
      intro={post.summary}
    >
      {/* Room for the rail on screens where the article reaches the right edge. */}
      <div className="lg:pr-8 xl:pr-0">
        <article className="prose-site max-w-[680px]" dangerouslySetInnerHTML={{ __html: html }} />
        <AuthorCard />
      </div>
      <TocRail items={outline} />
    </PageShell>
  )
}
