import type { Metadata } from 'next'
import Link from 'next/link'
import type { Route } from 'next'
import { getCaseStudies, getPosts, getProjects, getRoles, getSettings } from '@/lib/db'
import { renderMarkdown } from '@/lib/markdown'
import { HeroIdentity } from '@/components/hero-identity'
import { SplitLayout } from '@/components/split-layout'
import { CaseStudyRow, ProjectRow, RoleRow } from '@/components/entries'
import { MoreLink, SectionHeading } from '@/components/ui'

/** Highlights per role shown on the homepage; /experience shows all of them. */
const HOME_HIGHLIGHTS = 4

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  return {
    title: { absolute: `${s.name} · ${s.title}` },
    description: s.tagline || s.intro
  }
}

export default async function Home() {
  const [settings, studies, roles, projects, posts] = await Promise.all([
    getSettings(),
    getCaseStudies(),
    getRoles(),
    getProjects(),
    getPosts()
  ])
  const about = renderMarkdown(settings.about_md || settings.intro || '').html

  const sections = [
    { id: 'about', label: 'About' },
    studies.length && { id: 'work', label: 'Selected work' },
    roles.length && { id: 'experience', label: 'Experience' },
    projects.length && { id: 'projects', label: 'Projects' },
    posts.length && { id: 'writing', label: 'Writing' }
  ].filter(Boolean) as { id: string; label: string }[]

  return (
    <SplitLayout
      settings={settings}
      showWriting={posts.length > 0}
      nav={{ items: sections, label: 'Sections' }}
      morph
      showLocation
      intro={
        <>
          <HeroIdentity name={settings.name} eyebrow="Hi, I'm" />
          <p className="-mt-4 text-xl font-medium text-fg-sub">{settings.headline || settings.title}</p>
          <p className="max-w-xs">{settings.tagline}</p>
        </>
      }
    >
      <section id="about" aria-labelledby="about-h">
        <SectionHeading id="about-h">About</SectionHeading>
        <div className="prose-site" dangerouslySetInnerHTML={{ __html: about }} />
      </section>

      {studies.length > 0 && (
        <section id="work" aria-labelledby="work-h">
          <SectionHeading id="work-h">Selected work</SectionHeading>
          <ol className="flex flex-col gap-3">
            {studies.map((s) => (
              <li key={s.id}>
                <CaseStudyRow study={s} />
              </li>
            ))}
          </ol>
          <MoreLink href="/work">All case studies →</MoreLink>
        </section>
      )}

      {roles.length > 0 && (
        <section id="experience" aria-labelledby="experience-h">
          <SectionHeading id="experience-h">Experience</SectionHeading>
          <ol className="flex flex-col gap-3">
            {roles.map((r) => (
              <li key={r.id}>
                <RoleRow role={r} highlightLimit={HOME_HIGHLIGHTS} />
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-x-8">
            <MoreLink href="/experience">Full experience, education & skills →</MoreLink>
            {settings.resume_url && (
              <MoreLink href={settings.resume_url} external>
                Résumé (PDF) ↗
              </MoreLink>
            )}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section id="projects" aria-labelledby="projects-h">
          <SectionHeading id="projects-h">Projects</SectionHeading>
          <ul className="flex flex-col gap-3">
            {projects.map((p) => (
              <li key={p.id}>
                <ProjectRow project={p} />
              </li>
            ))}
          </ul>
          <MoreLink href="/projects">Project details →</MoreLink>
        </section>
      )}

      {posts.length > 0 && (
        <section id="writing" aria-labelledby="writing-h">
          <SectionHeading id="writing-h">Writing</SectionHeading>
          <ul className="flex flex-col">
            {posts.slice(0, 5).map((p) => (
              <li key={p.id} className="flex flex-wrap gap-x-6 border-t border-surface-line py-4">
                <time className="basis-[140px] font-mono text-xs leading-7 tracking-wide text-muted">
                  {p.published_at}
                </time>
                <Link href={`/writing/${p.slug}` as Route} className="font-medium text-fg-strong hover:text-accent">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
          <MoreLink href="/writing">All writing →</MoreLink>
        </section>
      )}
    </SplitLayout>
  )
}
