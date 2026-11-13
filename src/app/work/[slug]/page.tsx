import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCaseStudies, getCaseStudy, getPosts, getSettings } from '@/lib/db'
import { renderMarkdown } from '@/lib/markdown'
import { ScrollSpyNav } from '@/components/scroll-spy-nav'
import { SiteHeader } from '@/components/site-header'
import { Footer, Tags } from '@/components/ui'

export async function generateMetadata({ params }: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const study = await getCaseStudy((await params).slug)
  if (!study) return {}
  return { title: study.title, description: study.summary, openGraph: { title: study.title, description: study.summary } }
}

export default async function CaseStudyPage({ params }: PageProps<'/work/[slug]'>) {
  const { slug } = await params
  const [study, settings, posts, all] = await Promise.all([
    getCaseStudy(slug),
    getSettings(),
    getPosts(),
    getCaseStudies()
  ])
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
    <>
      <SiteHeader name={settings.name ?? 'Home'} showWriting={posts.length > 0} />
      <div className="mx-auto flex max-w-[1160px] flex-wrap gap-16 px-4 pt-16 pb-20 sm:px-6 sm:pt-24 lg:flex-nowrap">
        <aside className="hidden flex-[0_0_240px] lg:block">
          <div className="sticky top-12">
            <Link href="/work" className="eyebrow mb-6 inline-flex min-h-11 items-center hover:text-fg-strong">
              ← All work
            </Link>
            <ScrollSpyNav items={chapters} label="On this page" variant="toc" />
          </div>
        </aside>

        <main id="content" className="min-w-0 flex-[1_1_560px]">
          <article className="max-w-[680px]">
            <header>
              <p className="eyebrow mb-3">Case study</p>
              <h1 className="text-4xl leading-tight font-semibold tracking-tight text-fg-strong sm:text-[44px]">
                {study.title}
              </h1>
              <p className="mt-4 text-lg text-fg-sub">{study.summary}</p>
              <dl className="mt-8 grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 rounded-xl border border-surface-line bg-surface p-5 text-[15px]">
                {facts.map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="font-mono text-xs leading-6 tracking-wide text-muted uppercase">{k}</dt>
                    <dd className={k === 'Result' ? 'font-medium text-accent' : 'text-fg-strong'}>{v}</dd>
                  </div>
                ))}
              </dl>
              <Tags items={study.tags} className="mt-5" />
            </header>

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

          <div className="mt-24">
            <Footer settings={settings} />
          </div>
        </main>
      </div>
    </>
  )
}
