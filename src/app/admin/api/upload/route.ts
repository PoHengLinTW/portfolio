import type { NextRequest } from 'next/server'
import { getAdminEmail } from '@/lib/auth'
import { storeUpload } from '@/lib/media'

/**
 * Media upload for the admin editors (src/app/admin/(cms)/upload.ts). A plain route rather than a
 * server action: action IDs change on every deploy, so an admin tab opened before a deploy would get
 * "Server Action unavailable" (409). A fixed URL keeps working across deploys.
 * Behind Cloudflare Access like the rest of /admin, and re-checks the Access JWT itself.
 */
export async function POST(req: NextRequest) {
  // Same-origin only, so another site can't post files with the admin's Access cookie.
  const origin = req.headers.get('origin')
  if (origin && new URL(origin).host !== req.headers.get('host')) return Response.json({ error: 'Forbidden.' }, { status: 403 })
  if (!(await getAdminEmail())) return Response.json({ error: 'Not signed in. Reload the page to sign in again.' }, { status: 401 })

  const form = await req.formData().catch(() => null)
  if (!form) return Response.json({ error: 'No file received.' }, { status: 400 })
  const result = await storeUpload(form.get('file'))
  return Response.json(result, { status: 'error' in result ? 400 : 200 })
}
