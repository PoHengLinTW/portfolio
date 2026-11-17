import type { MetadataRoute } from 'next'

/**
 * /robots.txt from the app. Cloudflare's managed robots.txt (AI-crawler rules) is prepended to this
 * at the edge, so this only adds the sitemap and keeps crawlers out of the admin.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/admin' },
    sitemap: 'https://henrylin.dev/sitemap.xml'
  }
}
