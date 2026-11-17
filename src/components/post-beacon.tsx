'use client'

import { useEffect } from 'react'

/** A read: the visitor reached 60% of the page and spent 30s on it with the tab visible. */
const READ_SCROLL = 0.6
const READ_SECONDS = 30

function send(kind: 'view' | 'read', slug: string) {
  fetch('/api/stats', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ kind, slug }),
    keepalive: true
  }).catch(() => {})
}

/** On a writing post: counts a view on load, then one read once the visitor has scrolled far enough and stayed long enough. */
export function PostBeacon({ slug }: { slug: string }) {
  useEffect(() => {
    send('view', slug)
    let seconds = 0
    let maxScroll = 0
    const measure = () => {
      maxScroll = Math.max(maxScroll, (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight)
    }
    measure()
    window.addEventListener('scroll', measure, { passive: true })
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') seconds++
      if (seconds >= READ_SECONDS && maxScroll >= READ_SCROLL) {
        send('read', slug)
        stop()
      }
    }, 1000)
    function stop() {
      window.clearInterval(timer)
      window.removeEventListener('scroll', measure)
    }
    return stop
  }, [slug])
  return null
}
