import { createContext, useContext } from 'react'
import { scrollToSection, setSectionPath } from './hooks/useSmoothScroll'

export const CallContext = createContext(null)

export function useCall() {
  const ctx = useContext(CallContext)
  if (!ctx) throw new Error('useCall must be used inside <CallProvider>')
  return ctx
}

/**
 * Smooth-scrolls to the booking form, writes `/consultation` to the address
 * bar, and focuses the first field.
 *
 * Routed through Lenis when it is running — a native scrollIntoView would
 * animate against Lenis's own loop and fight it.
 *
 * Every Book button on the page comes through here — the header, the drawer,
 * the hero, About, Real Results, the closing CTA and the sticky mobile bar —
 * so the address they write is set once, in one place.
 */
export function scrollToBooking() {
  /* The form card, falling back to the section. Stacked on mobile the section
     opens with the assurances copy, so targeting #book landed the visitor on
     content with the form still a screen below — a Book button has to arrive
     at the thing it names. */
  const target = document.getElementById('book-form') ?? document.getElementById('book')
  if (!target) return

  /* Named for what the visitor is doing, not for the element it scrolls to:
     `/consultation` reads as a page on a site that only has one, matching the
     hair clinic's own /hair/consultation. See PATH_ALIASES in
     hooks/useSmoothScroll.js, which is what makes the address survive a
     refresh or a shared link. */
  setSectionPath('consultation')

  /* Re-aiming matters most here: every Book button on the page is below the
     booking section, so the journey up passes lazy sections that may still be
     placeholders. */
  scrollToSection(target, -100)

  window.setTimeout(() => {
    document.getElementById('lead-name')?.focus({ preventScroll: true })
  }, 900)
}
