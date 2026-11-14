import type { Metadata } from 'next'
import { getAdminEmail } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false }
}

/**
 * Gate for everything under /admin: the CMS screens in `(cms)` and the draft previews in `preview`.
 * Cloudflare Access protects /admin* at the edge; this re-verifies its JWT and fails closed.
 */
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
  return children
}
