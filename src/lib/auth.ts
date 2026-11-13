import 'server-only'
import { headers } from 'next/headers'
import { createRemoteJWKSet, jwtVerify } from 'jose'
import { getCloudflareContext } from '@opennextjs/cloudflare'

/**
 * /admin sits behind a Cloudflare Access application, which blocks unauthenticated requests at
 * the edge. As defense in depth, the app also verifies the Access JWT on every admin render and
 * server action, so a misconfigured Access policy fails closed instead of open.
 *
 * Local `next dev` skips the check.
 */

let jwks: ReturnType<typeof createRemoteJWKSet> | undefined

export async function getAdminEmail(): Promise<string | null> {
  if (process.env.NODE_ENV === 'development') return 'local-dev'

  const { env } = await getCloudflareContext({ async: true })
  const team: string = env.CF_ACCESS_TEAM_DOMAIN
  const aud: string = env.CF_ACCESS_AUD
  if (!team || !aud) return null

  const token = (await headers()).get('cf-access-jwt-assertion')
  if (!token) return null

  const issuer = `https://${team.replace(/^https?:\/\//, '').replace(/\/$/, '')}`
  jwks ??= createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`))
  try {
    const { payload } = await jwtVerify(token, jwks, { issuer, audience: aud })
    return typeof payload.email === 'string' ? payload.email : 'access-user'
  } catch {
    return null
  }
}

export async function requireAdmin(): Promise<string> {
  const email = await getAdminEmail()
  if (!email) throw new Error('Unauthorized')
  return email
}
