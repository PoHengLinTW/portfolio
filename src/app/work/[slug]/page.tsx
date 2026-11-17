import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCaseStudies, getCaseStudy } from '@/lib/db'
import { CaseStudyView, nextCaseStudy } from '@/components/case-study-view'

export async function generateMetadata({ params }: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const study = await getCaseStudy((await params).slug)
  if (!study) return {}
  // Repeat the site card: a page's openGraph replaces the layout's, images included.
  const images = ['/card.png']
  return {
    title: study.title,
    description: study.summary,
    openGraph: { title: study.title, description: study.summary, images },
    twitter: { card: 'summary_large_image', title: study.title, description: study.summary, images }
  }
}

export default async function CaseStudyPage({ params }: PageProps<'/work/[slug]'>) {
  const { slug } = await params
  const [study, all] = await Promise.all([getCaseStudy(slug), getCaseStudies()])
  if (!study) notFound()
  return <CaseStudyView study={study} next={nextCaseStudy(all, slug)} />
}
