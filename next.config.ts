import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typedRoutes: true,
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
