import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPost } from '@/lib/db'
import { renderMarkdown } from '@/lib/markdown'
import { PageShell } from '@/components/page-shell'

export async function generateMetadata({ params }: PageProps<'/writing/[slug]'>): Promise<Metadata> {
  const post = await getPost((await params).slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.summary,
    openGraph: { type: 'article', title: post.title, description: post.summary, publishedTime: post.published_at }
  }
}

export default async function PostPage({ params }: PageProps<'/writing/[slug]'>) {
  const post = await getPost((await params).slug)
  if (!post) notFound()
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
