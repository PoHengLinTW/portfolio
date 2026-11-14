import type { Settings } from '@/lib/db'
import { ScrollSpyNav, type SpyItem } from './scroll-spy-nav'
import { SiteHeader } from './site-header'
import { Footer, SocialLinks } from './ui'

export interface SplitNav {
  items: SpyItem[]
  label: string
  /** 'lines' for a few short section names, 'toc' for longer entry or chapter titles. */
  variant?: 'lines' | 'toc'
}

/**
 * The "Split Index" page frame shared by every public page: a left column that stays pinned on
 * wide screens (page intro, an in-page menu that tracks the section in view, social links) and a
 * right column with the scrolling content and footer.
 *
 * `morph` is the homepage mode, where HeroIdentity in `intro` animates into the header. It needs
 * the column to allow overflow, so only the other pages get a scrollable column as a fallback for
 * short screens.
 */
export function SplitLayout({
  settings,
  showWriting,
  intro,
  nav,
  morph = false,
  showLocation = false,
  children
}: {
  settings: Settings
  showWriting: boolean
  intro: React.ReactNode
  nav?: SplitNav
  morph?: boolean
  showLocation?: boolean
  children: React.ReactNode
}) {
  return (
    <>
      <SiteHeader
        name={settings.name ?? 'Home'}
        showWriting={showWriting}
        morph={morph}
      />
      <div className="mx-auto flex max-w-[1160px] flex-wrap gap-16 px-4 pt-14 pb-20 sm:px-6 sm:pt-24 lg:flex-nowrap lg:pb-0">
        <header
          className={`flex flex-[1_1_340px] flex-col gap-6 lg:sticky lg:top-(--header-h) lg:-mt-24 lg:h-[calc(100dvh-var(--header-h))] lg:max-w-[420px] lg:pt-24 lg:pb-10 ${
            morph ? 'lg:z-50' : 'lg:-mx-3 lg:overflow-y-auto lg:px-3'
          }`}
        >
          {intro}

          {/* A long menu shrinks and scrolls on its own so the social links stay in view. */}
          {nav && nav.items.length > 1 && (
            <div className="mt-6 -ml-1 hidden min-h-0 shrink overflow-y-auto pl-1 lg:block">
              <ScrollSpyNav items={nav.items} label={nav.label} variant={nav.variant} />
            </div>
          )}

          <div className={`shrink-0 lg:mt-auto ${morph ? '' : 'hidden lg:block'}`}>
            <SocialLinks settings={settings} />
            {showLocation && settings.location && <p className="mt-4 text-sm text-muted">{settings.location}</p>}
          </div>
        </header>

        {/* Bottom padding lives here on wide screens, so the pinned column never collides with it. */}
        <main id="content" className="flex min-w-0 flex-[999_1_560px] flex-col gap-24 lg:pb-20">
          {children}
          <Footer settings={settings} />
        </main>
      </div>
    </>
  )
}
