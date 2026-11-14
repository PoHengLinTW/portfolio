'use client'

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div role="alert" className="max-w-3xl rounded-xl border border-red-500/60 bg-red-500/10 p-5">
      <p className="font-medium text-fg-strong">Couldn’t save</p>
      <p className="mt-1">{error.message || 'Something went wrong.'}</p>
      <button type="button" onClick={reset} className="mt-4 min-h-11 rounded-lg border border-line px-4 font-medium text-fg-strong hover:border-accent">
        Back to the form
      </button>
    </div>
  )
}
