import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { BackToTop } from '@/components/back-to-top'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains'
})

export const metadata: Metadata = {
  metadataBase: new URL('https://henrylin.dev'),
  title: { default: 'Henry Lin', template: '%s · Henry Lin' },
  description: 'Henry Lin — software engineer building web platforms at Bloomberg.',
  openGraph: { siteName: 'Henry Lin', type: 'website', images: ['/card.png'] },
  icons: { icon: [{ url: '/favicon.ico' }, { url: '/favicon.svg', type: 'image/svg+xml' }], apple: '/apple-touch-icon.png' }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f9f9' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1215' }
  ]
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body>
        <a
          href="#content"
          className="fixed top-[-60px] left-4 z-50 rounded-md bg-accent px-3.5 py-2 font-semibold text-bg focus:top-4"
        >
          Skip to content
        </a>
        {children}
        <BackToTop />
      </body>
    </html>
  )
}
