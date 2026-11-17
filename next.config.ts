import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typedRoutes: true,
  experimental: {
    // Admin media uploads go through a server action; keep in step with MAX_UPLOAD_BYTES in src/lib/media.ts.
    serverActions: { bodySizeLimit: '25mb' }
  },
  async redirects() {
    return [
      { source: '/resume', destination: '/resume.pdf', permanent: true },
      { source: '/Henry.Lin-CV.pdf', destination: '/resume.pdf', permanent: true }
    ]
  }
}

export default nextConfig

// Enable calling `getCloudflareContext()` (and the local D1 binding) in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
initOpenNextCloudflareForDev()
