import type { Metadata } from 'next'
import { getEducation, getRoles, getSettings, getSkillGroups } from '@/lib/db'
import { PageShell } from '@/components/page-shell'
import { RoleRow } from '@/components/entries'
import { MoreLink, SectionHeading } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Experience',
  description: 'Roles, education and skills.'
}

export default async function ExperiencePage() {
  const [roles, education, skills, settings] = await Promise.all([
    getRoles(),
    getEducation(),
    getSkillGroups(),
    getSettings()
  ])
  const sections = [
    { id: 'roles', label: 'Roles' },
    education.length && { id: 'education', label: 'Education' },
    skills.length && { id: 'skills', label: 'Skills' }
  ].filter(Boolean) as { id: string; label: string }[]
  return (
    <PageShell
      eyebrow="Experience"
      nav={{ items: sections, label: 'On this page' }}
      title="Where I've worked"
      intro={
        <>
          The full version of my experience.
          {settings.resume_url && (
            <>
              {' '}
              Prefer a PDF?{' '}
              <a
                href={settings.resume_url}
                target="_blank"
                rel="noreferrer"
                className="text-accent underline underline-offset-4"
              >
                Download my résumé
              </a>
              .
            </>
          )}
        </>
      }
    >
      <div className="flex flex-col gap-20">
        <section id="roles" aria-labelledby="roles-h">
          <SectionHeading id="roles-h">Roles</SectionHeading>
          <ol className="flex flex-col gap-3">
            {roles.map(r => (
              <li key={r.id}>
                <RoleRow role={r} />
              </li>
            ))}
          </ol>
        </section>

        {education.length > 0 && (
          <section id="education" aria-labelledby="edu-h">
            <SectionHeading id="edu-h">Education</SectionHeading>
            <ul className="flex flex-col">
              {education.map(e => (
                <li key={e.id} className="flex flex-wrap gap-x-6 gap-y-1 border-t border-surface-line py-4">
                  <span className="basis-[140px] font-mono text-xs leading-7 tracking-wide text-muted uppercase">
                    {e.period}
                  </span>
                  <div className="min-w-0 flex-[1_1_320px]">
                    <p className="font-medium text-fg-strong">{e.school}</p>
                    <p>
                      {e.degree}
                      {e.location && <span className="text-muted"> · {e.location}</span>}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {skills.length > 0 && (
          <section id="skills" aria-labelledby="skills-h">
            <SectionHeading id="skills-h">Skills</SectionHeading>
            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-[140px_1fr]">
              {skills.map(g => (
                <div key={g.id} className="contents">
                  <dt className="font-mono text-xs leading-7 tracking-wide text-muted uppercase">{g.name}</dt>
                  <dd className="text-fg-strong">{g.items.join(' · ')}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <MoreLink href="/work">Read the case studies →</MoreLink>
      </div>
    </PageShell>
  )
}
