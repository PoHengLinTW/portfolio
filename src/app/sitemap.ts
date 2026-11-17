import type { MetadataRoute } from 'next'
import { getCaseStudies, getPosts } from '@/lib/db'

const SITE = 'https://henrylin.dev'

/** /sitemap.xml: the public pages plus every published post and case study, read from D1 per request. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, studies] = await Promise.all([getPosts(), getCaseStudies()])
  // Dates are 'YYYY-MM-DD' (posts) or D1's UTC 'YYYY-MM-DD HH:MM:SS' (case studies).
  const date = (s: string | undefined) => {
    const d = s ? new Date(s.includes(' ') ? `${s.replace(' ', 'T')}Z` : s) : null
    return d && !Number.isNaN(d.getTime()) ? d : undefined
  }

  return [
    { url: SITE, changeFrequency: 'monthly', priority: 1 },
    ...['/writing', '/work', '/experience', '/projects'].map(path => ({ url: `${SITE}${path}`, changeFrequency: 'monthly' as const })),
    ...posts.map(p => ({ url: `${SITE}/writing/${p.slug}`, lastModified: date(p.published_at), changeFrequency: 'yearly' as const })),
    ...studies.map(s => ({ url: `${SITE}/work/${s.slug}`, lastModified: date(s.updated_at), changeFrequency: 'yearly' as const }))
  ]
}
