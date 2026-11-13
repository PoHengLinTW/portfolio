'use client'

import { useEffect, useState } from 'react'

export interface SpyItem {
  id: string
  label: string
  depth?: number
}

/**
 * Sticky in-page navigation that highlights the section currently in view.
 * Used for the homepage sections and for case-study chapters.
 */
export function ScrollSpyNav({
  items,
  label,
  extra,
  variant = 'lines'
}: {
  items: SpyItem[]
  label: string
  extra?: React.ReactNode
  variant?: 'lines' | 'toc'
}) {
  const [active, setActive] = useState(items[0]?.id)

  useEffect(() => {
    const els = items.map(i => document.getElementById(i.id)).filter((el): el is HTMLElement => !!el)
    if (!els.length) return
    const onScroll = () => {
      // The active section is the last one whose top has passed 35% of the viewport.
      const line = window.innerHeight * 0.35
      let current = els[0].id
      for (const el of els) if (el.getBoundingClientRect().top <= line) current = el.id
      // At the very bottom, the last section wins even if it is short.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = els[els.length - 1].id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [items])

  if (variant === 'toc') {
    return (
      <nav aria-label={label}>
        <ul className="space-y-1 border-l border-line">
          {items.map(item => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? 'location' : undefined}
                className={`-ml-px block border-l py-1.5 text-sm transition-colors ${
                  item.depth && item.depth > 2 ? 'pl-7' : 'pl-4'
                } ${
                  active === item.id
                    ? 'border-accent text-fg-strong'
                    : 'border-transparent text-muted hover:text-fg-strong'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    )
  }

  return (
    <nav aria-label={label}>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? 'location' : undefined}
              className="group flex min-h-11 items-center gap-4 font-mono text-[13px] tracking-[0.1em] text-muted uppercase hover:text-fg-strong aria-[current]:text-fg-strong"
            >
              <span
                aria-hidden="true"
                className="h-px w-8 bg-current transition-all group-hover:w-16 group-aria-[current]:w-16"
              />
              {item.label}
            </a>
          </li>
        ))}
        {extra}
      </ul>
    </nav>
  )
}
