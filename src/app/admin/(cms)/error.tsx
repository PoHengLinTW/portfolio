'use client'

import { unstable_isUnrecognizedActionError } from 'next/navigation'

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  // A deploy since this tab loaded changes server action IDs, so Save fails with "Server Action unavailable".
  const message = error.message
  const stale = unstable_isUnrecognizedActionError(error)
  return (
    <div role="alert" className="max-w-3xl rounded-xl border border-red-500/60 bg-red-500/10 p-5">
      <p className="font-medium text-fg-strong">Couldn’t save</p>
      <p className="mt-1">
        {stale
          ? 'The site was updated after this page was opened, so this tab can’t save anymore. Go back to the form, copy anything you changed, then reload the page (Cmd+Shift+R) and save again.'
          : message || 'Something went wrong.'}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 min-h-11 rounded-lg border border-line px-4 font-medium text-fg-strong hover:border-accent"
      >
        Back to the form
      </button>
    </div>
  )
}
