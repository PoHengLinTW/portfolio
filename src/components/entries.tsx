import Link from 'next/link'
import type { Route } from 'next'
import type { CaseStudy, Project, Role } from '@/lib/db'
import { Row, Tags } from './ui'

export function CaseStudyRow({ study }: { study: CaseStudy }) {
  return (
    <Row aside={study.period}>
      <h3 className="text-[17px] leading-snug font-medium text-fg-strong">
        <Link href={`/work/${study.slug}` as Route} className="after:absolute after:inset-0 group-hover:text-accent">
          {study.title}
        </Link>
      </h3>
      <p className="mt-1.5">{study.summary}</p>
      <p className="mt-3 font-mono text-xs tracking-wide text-muted">
        {study.role}
        {study.result && (
          <>
            {' · '}
            <span className="text-accent">{study.result}</span>
          </>
        )}
      </p>
      <Tags items={study.tags} className="mt-3.5" />
    </Row>
  )
}

export function RoleRow({ role, highlightLimit }: { role: Role; highlightLimit?: number }) {
  const highlights = highlightLimit ? role.highlights.slice(0, highlightLimit) : role.highlights
  const period = [role.start, role.end].filter(Boolean).join(' — ')
  return (
    <Row aside={period}>
      <h3 className="text-[17px] leading-snug font-medium text-fg-strong">
        {role.title} ·{' '}
        {role.url ? (
          <a href={role.url} target="_blank" rel="noreferrer" className="hover:text-accent">
            {role.company} <span aria-hidden="true">↗</span>
          </a>
        ) : (
          role.company
        )}
      </h3>
      {role.location && <p className="text-sm text-muted">{role.location}</p>}
      {role.summary && <p className="mt-2">{role.summary}</p>}
      {highlights.length > 0 && (
        <ul className="mt-3 list-disc space-y-1.5 pl-[18px] text-[15px] marker:text-muted">
          {highlights.map(h => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      )}
      <Tags items={role.tags} className="mt-3.5" />
    </Row>
  )
}

export function ProjectRow({ project, showDetails = false }: { project: Project; showDetails?: boolean }) {
  return (
    <Row
      aside={
        project.image_url ? (
          // Small static files; a plain <img> avoids needing the image optimizer on Workers.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image_url}
            alt=""
            width={140}
            height={88}
            loading="lazy"
            className="h-[88px] w-[140px] rounded-md border-2 border-surface-line bg-monogram object-cover"
          />
        ) : (
          project.period
        )
      }
    >
      <h3 className="text-[17px] leading-snug font-medium text-fg-strong">
        {project.link_url ? (
          <a href={project.link_url} target="_blank" rel="noreferrer" className="hover:text-accent">
            {project.name} <span aria-hidden="true">↗</span>
          </a>
        ) : (
          project.name
        )}
      </h3>
      {project.image_url && <p className="font-mono text-xs tracking-wide text-muted uppercase">{project.period}</p>}
      <p className="mt-1.5">{project.description}</p>
      {showDetails && project.details.length > 0 && (
        <ul className="mt-3 list-disc space-y-1.5 pl-[18px] text-[15px] marker:text-muted">
          {project.details.map(d => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}
      <Tags items={project.tags} className="mt-3.5" />
    </Row>
  )
}
