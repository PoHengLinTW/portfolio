'use client'

import { useDeferredValue, useMemo, useState } from 'react'
import { renderMarkdown } from '@/lib/markdown'

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

  return (
    <div>
      <div role="group" aria-label="Editor view" className="mb-2 inline-flex rounded-lg border border-line p-0.5 text-sm">
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
      <div className={mode === 'split' ? 'grid gap-4 lg:grid-cols-2' : ''}>
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={e => setValue(e.target.value)}
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
