'use client'

import { FiArrowUp } from 'react-icons/fi'
import { useScrolledPast } from './use-scrolled-past'

/** Floating button that appears after scrolling down and returns to the top of the page. */
export function BackToTop() {
  const visible = useScrolledPast(400)
  return (
    <button
      type="button"
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      // Smoothness comes from `scroll-behavior` on <html>, which honors reduced motion.
      onClick={() => window.scrollTo({ top: 0 })}
      className={`fixed right-4 bottom-4 z-40 grid size-11 place-items-center rounded-full border border-line bg-surface text-fg-strong shadow-sm transition-[opacity,translate] duration-200 hover:border-accent hover:text-accent motion-reduce:transition-none sm:right-6 sm:bottom-6 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
      }`}
    >
      <FiArrowUp aria-hidden="true" className="size-5" />
    </button>
  )
}
