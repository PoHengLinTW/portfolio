import { notFound } from 'next/navigation'
import { getPost } from '@/lib/db'
import { PostView } from '@/components/post-view'
import { PreviewBar } from '../../preview-bar'

export const metadata = { title: 'Preview' }

/** /writing/[slug] as it would look, drafts included. Gated by the /admin layout and Access. */
export default async function PostPreview({ params }: PageProps<'/admin/preview/writing/[slug]'>) {
  const { slug } = await params
  const post = await getPost(slug, true)
  if (!post) notFound()
  return (
    <>
      <PreviewBar published={Boolean(post.published)} editPath={`/admin/posts/${post.id}`} publicPath={`/writing/${slug}`} />
      <PostView post={post} />
    </>
  )
}
