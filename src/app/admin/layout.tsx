import type { Metadata } from 'next'
import Link from 'next/link'
import { getAdminEmail } from '@/lib/auth'
import { ENTITIES } from '@/lib/admin-schema'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const email = await getAdminEmail()
  if (!email) {
    return (
      <main id="content" className="mx-auto max-w-xl px-4 pt-[25vh] sm:px-6">
        <p className="eyebrow mb-3">403</p>
        <h1 className="text-3xl font-semibold text-fg-strong">Not authorized</h1>
        <p className="mt-3">The admin is protected by Cloudflare Access. Sign in through Access to continue.</p>
      </main>
    )
  }

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
