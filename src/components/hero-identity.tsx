'use client'

import { useEffect, useRef } from 'react'

/** Top padding (px) the sticky left column keeps once the name has docked into the header. */
const KEEP_TOP = 24

/**
 * Homepage name. As the page scrolls, it shrinks and glides into the header's name slot
 * (`#site-brand [data-brand-name]`, rendered with `morph`), then hands off to the real header name
 * so there is only ever one visible copy.
 *
 * The motion is scroll-linked: progress runs 0 → 1 over the distance between the name and its
 * header slot. On wide screens, where the left column is sticky, the name's height and most of the
 * column's top padding collapse with progress, so the rest of the column moves up to sit just below
 * the header with no leftover gap. On narrow screens the header has no name slot, so the name fades
 * out instead. With reduced motion it swaps without animating.
 */
export function HeroIdentity({ name, eyebrow }: { name: string; eyebrow?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const eyebrowRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const nameEl = nameRef.current
    const eyebrowEl = eyebrowRef.current
    const brand = document.getElementById('site-brand')
    if (!wrap || !nameEl || !brand) return
    const slot = brand.querySelector<HTMLElement>('[data-brand-name]')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    let fullHeight = 0
    let slack = 0
    let sticky = false
    let distance = 1
    let frame = 0

    // The slot is display:none on narrow screens, which leaves it with no client rects.
    const slotShown = () => !!slot && slot.getClientRects().length > 0

    const measure = () => {
      wrap.style.height = ''
      wrap.style.marginTop = ''
      fullHeight = wrap.offsetHeight
      const column = getComputedStyle(wrap.parentElement!)
      sticky = column.position === 'sticky'
      // The column's top padding framed the big name; keep only KEEP_TOP of it once docked.
      slack = Math.max(0, parseFloat(column.paddingTop) - KEEP_TOP)
      // Where the name sits at scrollY = 0. A sticky column doesn't move with the page.
      const startTop = wrap.getBoundingClientRect().top + nameEl.offsetTop + (sticky ? 0 : window.scrollY)
      const target = slotShown() ? slot! : brand
      distance = Math.max(1, startTop - target.getBoundingClientRect().top)
    }

    const update = () => {
      frame = 0
      const p = Math.min(1, Math.max(0, window.scrollY / distance))
      const docked = p >= 1
      brand.dataset.docked = String(docked)
      wrap.style.visibility = docked ? 'hidden' : ''

      const q = reduceMotion.matches ? (docked ? 1 : 0) : p
      // The label has no place in the header; fade it out in the first half of the motion.
      if (eyebrowEl) eyebrowEl.style.opacity = String(Math.max(0, 1 - 2 * q))
      if (sticky) {
        wrap.style.height = `${fullHeight * (1 - q)}px`
        wrap.style.marginTop = `${-slack * q}px`
      }

      if (reduceMotion.matches || !slotShown()) {
        nameEl.style.transform = ''
        nameEl.style.opacity = reduceMotion.matches ? '' : String(1 - p)
        return
      }
      const r = wrap.getBoundingClientRect()
      const left = r.left + nameEl.offsetLeft
      const top = r.top + nameEl.offsetTop
      const t = slot!.getBoundingClientRect()
      const k = t.width / nameEl.offsetWidth
      const dx = t.left - left
      const dy = t.top + t.height / 2 - (top + (nameEl.offsetHeight * k) / 2)
      nameEl.style.opacity = ''
      nameEl.style.transform = `translate(${dx * p}px, ${dy * p}px) scale(${1 + (k - 1) * p})`
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const onResize = () => {
      measure()
      update()
    }

    onResize()
    document.fonts?.ready.then(onResize)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    reduceMotion.addEventListener('change', onResize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      reduceMotion.removeEventListener('change', onResize)
      brand.dataset.docked = 'true'
      wrap.removeAttribute('style')
      nameEl.removeAttribute('style')
      eyebrowEl?.removeAttribute('style')
    }
  }, [])

  return (
    // z-50 lifts the moving name above the sticky header while it passes over it.
    <div ref={wrapRef} className="relative z-50">
      {eyebrow && (
        <p ref={eyebrowRef} className="eyebrow mb-4">
          {eyebrow}
        </p>
      )}
      <h1
        ref={nameRef}
        className="w-fit origin-top-left text-5xl leading-[1.1] font-semibold tracking-[-0.02em] text-fg-strong will-change-transform sm:text-6xl"
      >
        {name}
      </h1>
    </div>
  )
}
