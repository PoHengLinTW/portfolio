import { getPosts, getSettings } from '@/lib/db'
import { SiteHeader } from './site-header'
import { Footer } from './ui'

/** Header + centered column used by /work, /experience, /projects and /writing. */
export async function PageShell({
  eyebrow,
  title,
  intro,
  children,
  wide = false
}: {
  eyebrow?: string
  title: string
  intro?: React.ReactNode
  children: React.ReactNode
  wide?: boolean
}) {
  const [settings, posts] = await Promise.all([getSettings(), getPosts()])
  return (
    <>
      <SiteHeader name={settings.name ?? 'Home'} showWriting={posts.length > 0} />
      <main id="content" className={`mx-auto px-4 pt-16 pb-20 sm:px-6 sm:pt-24 ${wide ? 'max-w-[1160px]' : 'max-w-3xl'}`}>
        <div className="mb-14 max-w-2xl">
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h1 className="text-4xl font-semibold tracking-tight text-fg-strong sm:text-5xl">{title}</h1>
          {intro && <p className="mt-4 text-lg text-fg-sub">{intro}</p>}
        </div>
        {children}
        <div className="mt-24">
          <Footer settings={settings} />
        </div>
      </main>
    </>
  )
}
