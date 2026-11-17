import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPost } from '@/lib/db'
import { PostView } from '@/components/post-view'
import { PostBeacon } from '@/components/post-beacon'
import { getReads } from '@/lib/stats'

export async function generateMetadata({ params }: PageProps<'/writing/[slug]'>): Promise<Metadata> {
  const post = await getPost((await params).slug)
  if (!post) return {}
  // A page's openGraph replaces the layout's entirely, so the image must be set here too. Without one,
  // LinkedIn falls back to the first image in the article.
  const images = [post.cover_image || '/card.png']
  return {
    title: post.title,
    description: post.summary,
    openGraph: { type: 'article', title: post.title, description: post.summary, publishedTime: post.published_at, images },
    twitter: { card: 'summary_large_image', title: post.title, description: post.summary, images }
  }
}

export default async function PostPage({ params }: PageProps<'/writing/[slug]'>) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()
  return (
    <>
      <PostView post={post} reads={await getReads(slug)} />
      <PostBeacon slug={slug} />
    </>
  )
}
