'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShibaAvatar } from './shiba-avatar'
import { useScrolledPast } from './use-scrolled-past'

const NAV = [
  { href: '/work', label: 'Work' },
  { href: '/experience', label: 'Experience' },
  { href: '/projects', label: 'Projects' },
  { href: '/writing', label: 'Writing' }
] as const

/**
 * Sticky top bar on every public page. Its height is `--header-h` (globals.css), which other
 * sticky elements and anchor scroll offsets use to stay clear of it.
 *
 * With `morph`, the brand's name starts hidden (`data-docked="false"`) and HeroIdentity animates the
 * homepage name into it as the page scrolls, then reveals it. The avatar shows from the start.
 */
export function SiteHeader({
  name,
  showWriting,
  morph = false
}: {
  name: string
  showWriting: boolean
  morph?: boolean
}) {
  const pathname = usePathname()
  const scrolled = useScrolledPast(4)
  const items = NAV.filter(i => showWriting || i.href !== '/writing')
  return (
    <div
      className={`sticky top-0 z-40 border-b bg-bg/85 backdrop-blur-md transition-colors ${
        scrolled ? 'border-surface-line' : 'border-transparent'
      }`}
    >
      <header className="mx-auto flex h-(--header-h) max-w-[1160px] items-center justify-between gap-4 px-4 sm:gap-8 sm:px-6">
        <Link
          href="/"
          id="site-brand"
          aria-label={`${name}, home`}
          data-docked={morph ? 'false' : undefined}
          className="flex min-h-11 shrink-0 items-center gap-3 font-semibold group text-fg-strong hover:text-accent"
        >
          <ShibaAvatar className="size-9 shrink-0 rounded-full border border-line" />
          <span data-brand-name className="hidden group-data-[docked=false]:invisible sm:inline">
            {name}
          </span>
        </Link>
        <nav aria-label="Main">
          <ul className="flex gap-x-4 sm:gap-x-6">
            {items.map(i => {
              const active = pathname === i.href || pathname.startsWith(`${i.href}/`)
              return (
                <li key={i.href}>
                  <Link
                    href={i.href}
                    aria-current={active ? 'page' : undefined}
                    className={`flex min-h-11 items-center font-mono text-xs tracking-[0.06em] uppercase sm:text-[13px] sm:tracking-[0.1em] ${
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
    </div>
  )
}
