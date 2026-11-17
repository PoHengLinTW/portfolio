import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPost } from '@/lib/db'
import { PostView } from '@/components/post-view'
import { PostBeacon } from '@/components/post-beacon'
import { getReads } from '@/lib/stats'

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
