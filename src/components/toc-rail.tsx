'use client'

import type { TocEntry } from '@/lib/markdown'
import { useActiveSection } from './scroll-spy-nav'

/**
 * Post table of contents pinned to the right edge of the screen (wide screens only). Collapsed, it
 * is a column of short bars, one per heading (shorter for sub-headings), with the section in view
 * highlighted. Hovering it, or tabbing into it, expands a panel of clickable heading titles.
 */
export function TocRail({ items }: { items: TocEntry[] }) {
  const active = useActiveSection(items.map(i => i.id))
  if (items.length < 2) return null

  return (
    <nav aria-label="On this page" className="group fixed top-1/2 right-3 z-30 hidden -translate-y-1/2 lg:block">
      {/* Collapsed: decorative bars. The links below are the accessible navigation. */}
      <div
        aria-hidden="true"
        className="flex flex-col items-end gap-2.5 py-3 pr-1 pl-5 transition-opacity duration-200 group-focus-within:opacity-0 group-hover:opacity-0"
      >
        {items.map(item => (
          <span
            key={item.id}
            className={`block h-0.5 rounded-full transition-colors ${item.depth > 2 ? 'w-2.5' : 'w-4'} ${
              active === item.id ? 'bg-accent' : 'bg-line'
            }`}
          />
        ))}
      </div>

      {/* Expanded: stays in the tab order (opacity, not visibility) so keyboard focus can open it. */}
      <div className="pointer-events-none absolute top-1/2 right-0 max-h-[70vh] w-72 translate-x-2 -translate-y-1/2 overflow-y-auto rounded-xl border border-surface-line bg-surface/95 p-2 opacity-0 shadow-xl backdrop-blur-md transition duration-200 group-focus-within:pointer-events-auto group-focus-within:translate-x-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100">
        <p className="eyebrow px-3 pt-2 pb-2">On this page</p>
        <ul>
          {items.map(item => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? 'location' : undefined}
                className={`block rounded-lg py-1.5 pr-3 text-sm leading-snug transition-colors hover:bg-bg ${
                  item.depth > 2 ? 'pl-7' : 'pl-3'
                } ${active === item.id ? 'font-medium text-accent' : 'text-fg hover:text-fg-strong'}`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
