import type { Metadata } from 'next'
import Link from 'next/link'
import type { Route } from 'next'
import { getCaseStudies, getPosts, getProjects, getRoles, getSettings } from '@/lib/db'
import { renderMarkdown } from '@/lib/markdown'
import { ScrollSpyNav } from '@/components/scroll-spy-nav'
import { SiteHeader } from '@/components/site-header'
import { CaseStudyRow, ProjectRow, RoleRow } from '@/components/entries'
import { Footer, MoreLink, SectionHeading, SocialLinks } from '@/components/ui'

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
    <>
      <SiteHeader name={settings.name} showWriting={posts.length > 0} />
      <div className="mx-auto flex max-w-[1160px] flex-wrap gap-16 px-4 pt-14 pb-20 sm:px-6 sm:pt-24 lg:flex-nowrap">
        {/* Left column: identity, section nav, links. Sticky on wide screens. */}
        <header className="flex flex-[1_1_340px] flex-col gap-6 lg:sticky lg:top-0 lg:-mt-24 lg:h-dvh lg:max-w-[420px] lg:py-24">
          {settings.headshot_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.headshot_url}
              alt={settings.full_name || settings.name}
              width={64}
              height={64}
              className="size-16 rounded-full border border-line object-cover"
            />
          ) : null}
          <div>
            <h1 className="text-5xl leading-[1.1] font-semibold tracking-[-0.02em] text-fg-strong">{settings.name}</h1>
            <p className="mt-2 text-xl font-medium text-fg-sub">{settings.headline || settings.title}</p>
          </div>
          <p className="max-w-xs">{settings.tagline}</p>

          <div className="mt-6 hidden lg:block">
            <ScrollSpyNav items={sections} label="Sections" />
          </div>

          <div className="lg:mt-auto">
            <SocialLinks settings={settings} />
            {settings.location && <p className="mt-4 text-sm text-muted">{settings.location}</p>}
          </div>
        </header>

        <main id="content" className="flex min-w-0 flex-[999_1_560px] flex-col gap-24 lg:pt-1">
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
                {roles.map((r, i) => (
                  <li key={r.id}>
                    <RoleRow role={r} highlightLimit={HOME_HIGHLIGHTS} featured={i === 0} />
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

          <Footer settings={settings} />
        </main>
      </div>
    </>
  )
}
