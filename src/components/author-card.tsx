import Link from 'next/link'
import { getSettings } from '@/lib/db'
import { ShibaAvatar } from './shiba-avatar'

/** "Written by" card at the end of a post: author photo (Settings → Author photo, else the shiba), name and headline. */
export async function AuthorCard() {
  const settings = await getSettings()
  if (!settings.name) return null
  const photo = settings.author_photo
  return (
    <aside aria-label="About the author" className="mt-16 flex max-w-[680px] items-center gap-4 border-t border-line pt-8">
      {photo ? (
        // Already resized on upload; a plain <img> avoids needing the image optimizer on Workers.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt="" width={64} height={64} className="size-16 shrink-0 rounded-full border border-line object-cover" />
      ) : (
        <ShibaAvatar className="size-16 shrink-0 rounded-full border border-line" />
      )}
      <div className="min-w-0">
        <p className="eyebrow">Written by</p>
        <Link href="/" className="mt-1 inline-block text-lg font-semibold text-fg-strong hover:text-accent">
          {settings.name}
        </Link>
        {settings.headline && <p className="text-sm text-muted">{settings.headline}</p>}
      </div>
    </aside>
  )
}
