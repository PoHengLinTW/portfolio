import Link from 'next/link'
import { getAdminEmail } from '@/lib/auth'
import { ENTITIES } from '@/lib/admin-schema'

/** Sidebar chrome for the CMS screens. The parent /admin layout has already checked access. */
export default async function CmsLayout({ children }: { children: React.ReactNode }) {
  const email = await getAdminEmail()
  return (
    <div className="mx-auto flex max-w-[1160px] flex-wrap gap-10 px-4 py-10 sm:px-6 lg:flex-nowrap">
      <aside className="flex-[0_0_200px]">
        <Link href="/admin" className="eyebrow inline-flex min-h-11 items-center">
          Admin
        </Link>
        <nav aria-label="Admin">
          <ul className="mt-2 flex flex-wrap gap-x-4 lg:flex-col">
            <li>
              <Link href="/admin/settings" className="flex min-h-10 items-center text-fg-strong hover:text-accent">
                Settings
              </Link>
            </li>
            {Object.entries(ENTITIES).map(([key, e]) => (
              <li key={key}>
                <Link href={`/admin/${key}`} className="flex min-h-10 items-center text-fg-strong hover:text-accent">
                  {e.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8 space-y-2 text-sm text-muted">
          <p>Signed in as {email}</p>
          <Link href="/" className="hover:text-accent">
            ← View site
          </Link>
        </div>
      </aside>
      <main id="content" className="min-w-0 flex-1">
        {children}
      </main>
    </div>
  )
}
