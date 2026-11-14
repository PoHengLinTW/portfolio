import { notFound } from 'next/navigation'
import { getCaseStudies, getCaseStudy } from '@/lib/db'
import { CaseStudyView, nextCaseStudy } from '@/components/case-study-view'
import { PreviewBar } from '../../preview-bar'

export const metadata = { title: 'Preview' }

/** /work/[slug] as it would look, drafts included. Gated by the /admin layout and Access. */
export default async function CaseStudyPreview({ params }: PageProps<'/admin/preview/work/[slug]'>) {
  const { slug } = await params
  const [study, all] = await Promise.all([getCaseStudy(slug, true), getCaseStudies()])
  if (!study) notFound()
  return (
    <>
      <PreviewBar
        published={Boolean(study.published)}
        editPath={`/admin/case-studies/${study.id}`}
        publicPath={`/work/${slug}`}
      />
      <CaseStudyView study={study} next={nextCaseStudy(all, slug)} />
    </>
  )
}
