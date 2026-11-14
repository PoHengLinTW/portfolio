import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPost } from '@/lib/db'
import { PostView } from '@/components/post-view'

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
  return <PostView post={post} />
}
