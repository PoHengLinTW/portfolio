import 'server-only'
import { getCloudflareContext } from '@opennextjs/cloudflare'

/** Upload cap (Workers accept request bodies up to 100 MB). */
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024

/** Accepted upload types and the extension each is stored under. SVG is excluded: it can carry script. */
export const MEDIA_TYPES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'video/mp4': 'mp4',
  'video/webm': 'webm'
}

/** The R2 bucket that holds uploaded media. */
export async function getMediaBucket(): Promise<R2Bucket> {
  const { env } = await getCloudflareContext({ async: true })
  return env.MEDIA
}

/** Public URL for a stored object key. */
export function mediaUrl(key: string): string {
  return `/media/${key}`
}

export type UploadResult = { url: string } | { error: string }

/**
 * Validates and stores an image/GIF/video in R2 under a content hash, so re-uploading the same file
 * is a no-op and URLs can be cached forever. Callers must check admin access first.
 */
export async function storeUpload(file: unknown): Promise<UploadResult> {
  if (!(file instanceof File) || file.size === 0) return { error: 'No file received.' }
  const ext = MEDIA_TYPES[file.type]
  if (!ext) return { error: `Unsupported file type ${file.type || '(unknown)'}. Use PNG, JPEG, GIF, WebP, AVIF, MP4 or WebM.` }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { error: `File is ${(file.size / 1048576).toFixed(1)} MB; the limit is ${MAX_UPLOAD_BYTES / 1048576} MB.` }
  }

  const bytes = await file.arrayBuffer()
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  const hash = Array.from(new Uint8Array(digest).slice(0, 12), b => b.toString(16).padStart(2, '0')).join('')
  const key = `uploads/${hash}.${ext}`

  const bucket = await getMediaBucket()
  if (!(await bucket.head(key))) {
    await bucket.put(key, bytes, {
      httpMetadata: { contentType: file.type },
      customMetadata: { originalName: file.name.slice(0, 200) }
    })
  }
  return { url: mediaUrl(key) }
}
