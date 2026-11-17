import type { NextRequest } from 'next/server'
import { isBot, recordHit } from '@/lib/stats'

/** Beacon endpoint for post views and reads, sent by src/components/post-beacon.tsx. */
export async function POST(req: NextRequest) {
  // Same-origin only: ignore hits posted from other sites.
  const origin = req.headers.get('origin')
  if (origin && new URL(origin).host !== req.headers.get('host')) return new Response(null, { status: 403 })

  const body = (await req.json().catch(() => null)) as { kind?: unknown; slug?: unknown } | null
  const kind = body?.kind
  const slug = body?.slug
  if ((kind !== 'view' && kind !== 'read') || typeof slug !== 'string' || !slug || slug.length > 200) {
    return new Response(null, { status: 400 })
  }

  const userAgent = req.headers.get('user-agent') ?? ''
  if (!isBot(userAgent)) {
    const ip = req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'local'
    if (!(await recordHit(kind, slug, ip, userAgent))) return new Response(null, { status: 404 })
  }
  return new Response(null, { status: 204 })
}
