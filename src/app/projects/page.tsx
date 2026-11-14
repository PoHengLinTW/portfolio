import type { Metadata } from 'next'
import { getProjects } from '@/lib/db'
import { PageShell } from '@/components/page-shell'
import { ProjectRow } from '@/components/entries'
import { slugify } from '@/lib/markdown'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Side and school projects: an OS kernel, a database engine, and more.'
}

export default async function ProjectsPage() {
  const projects = await getProjects()
  return (
    <PageShell
      eyebrow="Projects"
      title="Things I've built"
      intro="Systems projects from grad school, a hackathon, and this site."
      nav={{ items: projects.map(p => ({ id: slugify(p.name), label: p.name })), label: 'Projects' }}
    >
      <ul className="flex flex-col gap-3">
        {projects.map(p => (
          <li key={p.id} id={slugify(p.name)}>
            <ProjectRow project={p} showDetails />
          </li>
        ))}
      </ul>
    </PageShell>
  )
}
