import type { Metadata } from 'next'
import Link from 'next/link'
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
  const { html } = renderMarkdown(post.body_md)
  return (
    <PageShell eyebrow={post.published_at} title={post.title} intro={post.summary}>
      <article className="prose-site" dangerouslySetInnerHTML={{ __html: html }} />
      <Link href="/writing" className="eyebrow mt-16 inline-flex min-h-11 items-center hover:text-fg-strong">
        ← All writing
      </Link>
    </PageShell>
  )
}
