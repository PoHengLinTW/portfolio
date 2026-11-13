import type { Metadata } from 'next'
import { getCaseStudies } from '@/lib/db'
import { PageShell } from '@/components/page-shell'
import { CaseStudyRow } from '@/components/entries'

export const metadata: Metadata = {
  title: 'Work',
  description: 'Case studies: the problem, the approach, the outcome, and what I learned.'
}

export default async function WorkPage() {
  const studies = await getCaseStudies()
  return (
    <PageShell
      eyebrow="Selected work"
      title="Case studies"
      intro="Platform work I owned or co-designed. Each one covers the context, the approach, the outcome, and what I learned."
    >
      <ol className="flex flex-col gap-3">
        {studies.map(s => (
          <li key={s.id}>
            <CaseStudyRow study={s} />
          </li>
        ))}
      </ol>
    </PageShell>
  )
}
