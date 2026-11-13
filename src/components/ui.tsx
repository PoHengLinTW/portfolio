import Link from 'next/link'
import type { Route } from 'next'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { FiFileText, FiMail } from 'react-icons/fi'
import type { Settings } from '@/lib/db'

export function Tags({ items, className = '' }: { items: string[]; className?: string }) {
  if (!items.length) return null
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label="Technologies">
      {items.map(t => (
        <li key={t} className="rounded-full bg-accent-soft px-3 py-1 text-xs leading-normal font-medium text-accent">
          {t}
        </li>
      ))}
    </ul>
  )
}

export function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="eyebrow mb-6">
      {children}
    </h2>
  )
}

export function MoreLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  const cls =
    'mt-6 inline-flex min-h-11 items-center gap-1 border-b border-line font-medium text-fg-strong hover:border-accent hover:text-accent'
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noreferrer">
        {children}
      </a>
    )
  }
  return (
    <Link href={href as Route} className={cls}>
      {children}
    </Link>
  )
}

/** A hoverable row: date/media column on the left, content on the right (the Split Index list item). */
export function Row({
  aside,
  children,
  featured = false
}: {
  aside: React.ReactNode
  children: React.ReactNode
  featured?: boolean
}) {
  return (
    <div
      className={`group relative -mx-4 flex flex-wrap gap-x-6 gap-y-2 rounded-xl border p-4 transition-colors sm:-mx-6 sm:p-6 ${
        featured ? 'border-surface-line bg-surface' : 'border-transparent hover:border-surface-line hover:bg-surface'
      }`}
    >
      <div className="shrink-0 basis-[140px] pt-0.5 font-mono text-xs tracking-[0.08em] text-muted uppercase">
        {aside}
      </div>
      <div className="min-w-0 flex-[1_1_320px]">{children}</div>
    </div>
  )
}

export function SocialLinks({ settings }: { settings: Settings }) {
  const links = [
    settings.github && { href: settings.github, label: 'GitHub', icon: <FaGithub size={20} /> },
    settings.linkedin && { href: settings.linkedin, label: 'LinkedIn', icon: <FaLinkedin size={20} /> },
    settings.email && { href: `mailto:${settings.email}`, label: `Email ${settings.email}`, icon: <FiMail size={20} /> },
    settings.resume_url && { href: settings.resume_url, label: 'Résumé (PDF)', icon: <FiFileText size={20} /> }
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode }[]

  return (
    <ul className="flex gap-3">
      {links.map(l => (
        <li key={l.label}>
          <a
            href={l.href}
            aria-label={l.label}
            title={l.label}
            target={l.href.startsWith('http') || l.href.endsWith('.pdf') ? '_blank' : undefined}
            rel="noreferrer"
            className="grid size-11 place-items-center rounded-[10px] border border-line text-fg transition-colors hover:border-accent hover:text-accent"
          >
            {l.icon}
          </a>
        </li>
      ))}
    </ul>
  )
}

export function Footer({ settings }: { settings: Settings }) {
  return (
    <footer className="text-sm text-muted">
      <p>
        Built with Next.js and Tailwind CSS, deployed on Cloudflare Workers.
        {settings.email && (
          <>
            {' '}
            Say hi at{' '}
            <a href={`mailto:${settings.email}`} className="text-fg hover:text-accent">
              {settings.email}
            </a>
            .
          </>
        )}
      </p>
    </footer>
  )
}
