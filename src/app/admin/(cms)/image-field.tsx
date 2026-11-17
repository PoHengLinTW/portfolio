'use client'

import { useRef, useState } from 'react'
import { uploadFile } from './upload'

const ACCEPT = 'image/png,image/jpeg,image/gif,image/webp,image/avif'

/**
 * An image URL input with a preview and an Upload button that stores the file in R2 (via the same
 * /admin/api/upload route as the Markdown editor) and fills in its /media/... URL.
 */
export function ImageField({
  id,
  name,
  defaultValue,
  className,
  describedBy
}: {
  id: string
  name: string
  defaultValue: string
  className: string
  describedBy?: string
}) {
  const [url, setUrl] = useState(defaultValue)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  async function upload(file: File | undefined) {
    if (!file) return
    setError(null)
    setUploading(true)
    try {
      const res = await uploadFile(file)
      if ('url' in res) setUrl(res.url)
      else setError(res.error)
    } catch {
      setError('Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="Current image" className="size-20 shrink-0 rounded-full border border-line object-cover" />
      ) : (
        <div className="grid size-20 shrink-0 place-items-center rounded-full border border-dashed border-line text-xs text-muted">
          None
        </div>
      )}
      <div className="min-w-0 flex-1 space-y-2">
        <input
          id={id}
          type="text"
          name={name}
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="/media/uploads/…"
          className={className}
          aria-describedby={describedBy}
        />
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInput.current?.click()}
            className="min-h-9 rounded-lg border border-line px-3 text-muted hover:text-fg-strong disabled:opacity-60"
          >
            {uploading ? 'Uploading…' : 'Upload image'}
          </button>
          {url && !uploading && (
            <button type="button" onClick={() => setUrl('')} className="min-h-9 px-1 text-muted hover:text-accent">
              Remove
            </button>
          )}
          <input
            ref={fileInput}
            type="file"
            accept={ACCEPT}
            hidden
            onChange={e => {
              void upload(e.target.files?.[0])
              e.target.value = ''
            }}
          />
          {error && (
            <span role="alert" className="text-accent">
              {error}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
