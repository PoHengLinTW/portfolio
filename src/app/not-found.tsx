import Link from 'next/link'

export default function NotFound() {
  return (
    <main id="content" className="mx-auto max-w-xl px-4 pt-[25vh] pb-20 sm:px-6">
      <p className="eyebrow mb-3">404</p>
      <h1 className="text-4xl font-semibold tracking-tight text-fg-strong">Page not found</h1>
      <p className="mt-3">The page you’re looking for doesn’t exist or has moved.</p>
      <Link href="/" className="mt-6 inline-flex min-h-11 items-center border-b border-line font-medium text-fg-strong hover:border-accent hover:text-accent">
        ← Back to home
      </Link>
    </main>
  )
}
