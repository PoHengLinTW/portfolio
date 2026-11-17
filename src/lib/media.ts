import 'server-only'
import { getCloudflareContext } from '@opennextjs/cloudflare'

/** Upload cap; keep in step with `serverActions.bodySizeLimit` in next.config.ts. */
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
