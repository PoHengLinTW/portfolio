import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCaseStudies, getCaseStudy } from '@/lib/db'
import { renderMarkdown } from '@/lib/markdown'
import { PageShell } from '@/components/page-shell'
import { Tags } from '@/components/ui'

export async function generateMetadata({ params }: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const study = await getCaseStudy((await params).slug)
  if (!study) return {}
  return { title: study.title, description: study.summary, openGraph: { title: study.title, description: study.summary } }
}

export default async function CaseStudyPage({ params }: PageProps<'/work/[slug]'>) {
  const { slug } = await params
  const [study, all] = await Promise.all([getCaseStudy(slug), getCaseStudies()])
  if (!study) notFound()

  const { html, toc } = renderMarkdown(study.body_md)
  const chapters = toc.filter(t => t.depth === 2).map(t => ({ id: t.id, label: t.text, depth: t.depth }))
  const index = all.findIndex(s => s.slug === slug)
  const next = all.length > 1 ? all[(index + 1) % all.length] : null

  const facts = [
    ['When', study.period],
    ['Role', study.role],
    ['Result', study.result]
  ].filter(([, v]) => v)

  return (
    <PageShell
      back={{ href: '/work', label: 'All work' }}
      eyebrow="Case study"
      title={study.title}
      intro={study.summary}
      nav={{ items: chapters, label: 'On this page', variant: 'toc' }}
    >
      <article className="max-w-[680px]">
        <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 rounded-xl border border-surface-line bg-surface p-5 text-[15px]">
          {facts.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="font-mono text-xs leading-6 tracking-wide text-muted uppercase">{k}</dt>
              <dd className={k === 'Result' ? 'font-medium text-accent' : 'text-fg-strong'}>{v}</dd>
            </div>
          ))}
        </dl>
        <Tags items={study.tags} className="mt-5" />

        <div className="prose-site mt-4" dangerouslySetInnerHTML={{ __html: html }} />
      </article>

      {next && (
        <nav aria-label="Next case study" className="mt-20 max-w-[680px] border-t border-line pt-8">
          <p className="eyebrow mb-2">Next</p>
          <Link href={`/work/${next.slug}`} className="text-xl font-medium text-fg-strong hover:text-accent">
            {next.title} →
          </Link>
        </nav>
      )}
    </PageShell>
  )
}
