import type { UploadResult } from '@/lib/media'

/** Uploads one file to R2 through /admin/api/upload; never throws. */
export async function uploadFile(file: File): Promise<UploadResult> {
  const form = new FormData()
  form.set('file', file)
  let res: Response
  try {
    res = await fetch('/admin/api/upload', { method: 'POST', body: form })
  } catch {
    return { error: 'Upload failed: network error.' }
  }
  // An expired Cloudflare Access session answers with a redirect to its login page, not JSON.
  const body = (await res.json().catch(() => null)) as UploadResult | null
  if (body && ('url' in body || 'error' in body)) return body
  return { error: `Upload failed (${res.status}). Reload the page and try again.` }
}
