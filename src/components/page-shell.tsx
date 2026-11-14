import Link from 'next/link'
import type { Route } from 'next'
import { getPosts, getSettings } from '@/lib/db'
import { SplitLayout, type SplitNav } from './split-layout'

/**
 * SplitLayout with a standard page intro (back link, eyebrow, title, description) in the pinned
 * left column. Used by /work, /experience, /projects and /writing and their detail pages.
 */
export async function PageShell({
  eyebrow,
  title,
  intro,
  back,
  nav,
  children
}: {
  eyebrow?: string
  title: string
  intro?: React.ReactNode
  back?: { href: string; label: string }
  nav?: SplitNav
  children: React.ReactNode
}) {
  const [settings, posts] = await Promise.all([getSettings(), getPosts()])
  return (
    <SplitLayout
      settings={settings}
      showWriting={posts.length > 0}
      nav={nav}
      intro={
        <div>
          {back && (
            <Link
              href={back.href as Route}
              className="eyebrow mb-4 inline-flex min-h-11 items-center hover:text-fg-strong"
            >
              ← {back.label}
            </Link>
          )}
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h1 className="text-4xl leading-tight font-semibold tracking-tight text-balance text-fg-strong">{title}</h1>
          {intro && <p className="mt-4 text-lg text-fg-sub">{intro}</p>}
        </div>
      }
    >
      <div>{children}</div>
    </SplitLayout>
  )
}
