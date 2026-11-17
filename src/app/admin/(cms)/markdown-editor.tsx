'use client'

import { useDeferredValue, useMemo, useRef, useState } from 'react'
import { renderMarkdown } from '@/lib/markdown'
import { uploadMedia } from './actions'

const ACCEPT = 'image/png,image/jpeg,image/gif,image/webp,image/avif,video/mp4,video/webm'
const isMedia = (f: File) => f.type.startsWith('image/') || f.type.startsWith('video/')
/** Filename without extension, usable inside `![…]`. */
const altFor = (name: string) =>
  name
    .replace(/\.[^.]+$/, '')
    .replace(/[[\]\n]/g, ' ')
    .trim()

type Mode = 'write' | 'split' | 'preview'
const MODES: { mode: Mode; label: string }[] = [
  { mode: 'write', label: 'Write' },
  { mode: 'split', label: 'Split' },
  { mode: 'preview', label: 'Preview' }
]

/**
 * Markdown textarea with a live preview rendered by the same `renderMarkdown` and `prose-site`
 * styles as the public pages, so comments and empty sections disappear here just as they do there.
 * The textarea stays in the DOM in every mode, so the form always submits it.
 *
 * Images, GIFs and videos can be pasted, dropped, or picked with "Insert media": each uploads to R2
 * and a `![alt](/media/…)` line is inserted at the cursor.
 */
export function MarkdownEditor({
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
  const [value, setValue] = useState(defaultValue)
  const [mode, setMode] = useState<Mode>('split')
  const deferred = useDeferredValue(value)
  const html = useMemo(() => renderMarkdown(deferred).html, [deferred])
  const textarea = useRef<HTMLTextAreaElement>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const seq = useRef(0)
  const [uploading, setUploading] = useState(0)
  const [error, setError] = useState<string | null>(null)

  /** Inserts one placeholder per file at the cursor, uploads them, then swaps in the final Markdown. */
  async function upload(files: File[]) {
    const media = files.filter(isMedia)
    if (!media.length) return
    setError(null)
    const ta = textarea.current
    const start = ta?.selectionStart ?? value.length
    const end = ta?.selectionEnd ?? start
    const placeholders = media.map(f => `![Uploading ${altFor(f.name)} #${++seq.current}…]()`)
    setValue(v => {
      const before = v.slice(0, start)
      const lead = before === '' || before.endsWith('\n\n') ? '' : before.endsWith('\n') ? '\n' : '\n\n'
      return `${before}${lead}${placeholders.join('\n\n')}\n\n${v.slice(end).replace(/^\n+/, '')}`
    })
    setUploading(n => n + media.length)
    await Promise.all(
      media.map(async (file, i) => {
        let replacement = ''
        try {
          const form = new FormData()
          form.set('file', file)
          const res = await uploadMedia(form)
          if ('url' in res) replacement = `![${altFor(file.name)}](${res.url})`
          else setError(`${file.name}: ${res.error}`)
        } catch {
          setError(`${file.name}: upload failed.`)
        } finally {
          // Every placeholder was inserted followed by a blank line; drop that too when the upload failed.
          setValue(v => v.replace(replacement ? placeholders[i] : `${placeholders[i]}\n\n`, replacement))
          setUploading(n => n - 1)
        }
      })
    )
  }

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <div role="group" aria-label="Editor view" className="inline-flex rounded-lg border border-line p-0.5 text-sm">
          {MODES.map(m => (
            <button
              key={m.mode}
              type="button"
              aria-pressed={mode === m.mode}
              onClick={() => setMode(m.mode)}
              className={`min-h-9 rounded-md px-3 ${
                mode === m.mode ? 'bg-accent-soft font-medium text-accent' : 'text-muted hover:text-fg-strong'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className="min-h-9 rounded-lg border border-line px-3 text-sm text-muted hover:text-fg-strong"
        >
          Insert media
        </button>
        <input
          ref={fileInput}
          type="file"
          accept={ACCEPT}
          multiple
          hidden
          onChange={e => {
            void upload(Array.from(e.target.files ?? []))
            e.target.value = ''
          }}
        />
        <p role="status" className="text-sm text-muted">
          {uploading > 0 ? `Uploading ${uploading} file${uploading > 1 ? 's' : ''}…` : 'Paste or drop images, GIFs or videos.'}
        </p>
      </div>
      {error && (
        <p role="alert" className="mb-2 text-sm text-accent">
          {error}
        </p>
      )}
      <div className={mode === 'split' ? 'grid gap-4 lg:grid-cols-2' : ''}>
        <textarea
          ref={textarea}
          id={id}
          name={name}
          value={value}
          onChange={e => setValue(e.target.value)}
          onPaste={e => {
            const files = Array.from(e.clipboardData.files).filter(isMedia)
            if (files.length) {
              e.preventDefault()
              void upload(files)
            }
          }}
          onDragOver={e => {
            if (e.dataTransfer.types.includes('Files')) e.preventDefault()
          }}
          onDrop={e => {
            const files = Array.from(e.dataTransfer.files).filter(isMedia)
            if (files.length) {
              e.preventDefault()
              void upload(files)
            }
          }}
          spellCheck
          aria-describedby={describedBy}
          className={`${className} h-[36rem] resize-y font-mono text-sm leading-relaxed [font-variant-ligatures:none] ${mode === 'preview' ? 'hidden' : ''}`}
        />
        {mode !== 'write' && (
          <div
            aria-label="Preview"
            className="h-[36rem] overflow-y-auto rounded-lg border border-line bg-bg px-5 py-4"
          >
            {deferred.trim() ? (
              <div className="prose-site" dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              <p className="text-muted">Nothing to preview yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
