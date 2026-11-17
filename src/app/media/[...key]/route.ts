import type { NextRequest } from 'next/server'
import { getMediaBucket } from '@/lib/media'

/**
 * Serves uploaded media from R2. Keys are content-hashed, so responses are cached forever.
 * Honors Range (Safari will not play <video> without it) and If-None-Match / If-Modified-Since.
 */
export async function GET(req: NextRequest, ctx: RouteContext<'/media/[...key]'>) {
  const { key: parts } = await ctx.params
  const key = parts.join('/')
  const bucket = await getMediaBucket()

  const range = req.headers.has('range') ? req.headers : undefined
  const object = await bucket.get(key, { range, onlyIf: req.headers })
  if (!object) return new Response('Not found', { status: 404 })

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('etag', object.httpEtag)
  headers.set('cache-control', 'public, max-age=31536000, immutable')
  headers.set('accept-ranges', 'bytes')
  headers.set('x-content-type-options', 'nosniff')

  // onlyIf matched (e.g. ETag unchanged): R2 returns the object without a body.
  if (!('body' in object)) return new Response(null, { status: 304, headers })

  const r = object.range
  if (range && r) {
    const offset = 'suffix' in r ? object.size - r.suffix : (r.offset ?? 0)
    const length = 'suffix' in r ? r.suffix : (r.length ?? object.size - offset)
    headers.set('content-range', `bytes ${offset}-${offset + length - 1}/${object.size}`)
    headers.set('content-length', String(length))
    return new Response(object.body, { status: 206, headers })
  }

  headers.set('content-length', String(object.size))
  return new Response(object.body, { headers })
}
