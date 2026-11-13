'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/work', label: 'Work' },
  { href: '/experience', label: 'Experience' },
  { href: '/projects', label: 'Projects' },
  { href: '/writing', label: 'Writing' }
] as const

/** Top bar for every page except the homepage, which has the Split Index left column instead. */
export function SiteHeader({ name, showWriting }: { name: string; showWriting: boolean }) {
  const pathname = usePathname()
  const items = NAV.filter(i => showWriting || i.href !== '/writing')
  return (
    <header className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-x-8 gap-y-2 px-4 pt-8 sm:px-6">
      <Link href="/" className="flex min-h-11 items-center gap-3 font-semibold text-fg-strong hover:text-accent">
        <span
          aria-hidden="true"
          className="grid size-8 place-items-center rounded-full border border-line bg-monogram font-mono text-xs text-accent"
        >
          {name
            .split(/\s+/)
            .map(w => w[0])
            .join('')
            .slice(0, 2)}
        </span>
        {name}
      </Link>
      <nav aria-label="Main">
        <ul className="flex flex-wrap gap-x-6">
          {items.map(i => {
            const active = pathname === i.href || pathname.startsWith(`${i.href}/`)
            return (
              <li key={i.href}>
                <Link
                  href={i.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex min-h-11 items-center font-mono text-[13px] tracking-[0.1em] uppercase ${
                    active ? 'text-accent' : 'text-muted hover:text-fg-strong'
                  }`}
                >
                  {i.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
