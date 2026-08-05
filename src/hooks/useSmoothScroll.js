import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * App-level smooth scrolling. A module-level handle lets non-React callers
 * (scrollToBooking, the sticky bar) route through Lenis instead of fighting it
 * with a second native smooth-scroll animation.
 */
let instance = null

export function getLenis() {
  return instance
}

/** Scrolls to an element or offset, falling back to native when Lenis is off. */
export function smoothScrollTo(target, options = {}) {
  if (instance) {
    instance.scrollTo(target, { duration: 1.15, ...options })
    return
  }
  /* Native path. `scroll-padding-top` on <html> supplies the header offset
     here, so the numeric `offset` option is Lenis-only by design. */
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' })
    return
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/* Matches `scroll-padding-top` — the fixed header must not cover the heading
   of whatever section was just jumped to. */
const ANCHOR_OFFSET = -90

/**
 * Scrolls to a section and keeps re-aiming until the page settles.
 *
 * Every section below the fold is lazy: while it is still a placeholder it
 * stands at a reserved height, and it swaps to real content the moment the
 * scroll brings it within a screen and a half. So a long jump — Treatments to
 * FAQ, say — passes two or three sections that each change height *while the
 * animation is already in flight*, and a single `scrollTo` computed at click
 * time lands well short of the heading it named.
 *
 * Re-issuing the scroll whenever the target actually moves is what makes a nav
 * link land on its own section. The corrections are deliberately short — this
 * is an adjustment, not a second journey — and stop after ~1.5s, by which time
 * everything in the path has mounted.
 */
export function scrollToSection(target, offset = ANCHOR_OFFSET) {
  if (!target) return

  smoothScrollTo(target, { offset })

  const topOf = () => target.getBoundingClientRect().top + window.scrollY
  let last = topOf()
  let ticks = 0

  const timer = window.setInterval(() => {
    const now = topOf()
    /* A few pixels of drift is sub-pixel layout noise, not a mounted section. */
    if (Math.abs(now - last) > 4) {
      last = now
      smoothScrollTo(target, { offset, duration: 0.45 })
    }
    if (++ticks >= 9) window.clearInterval(timer)
  }, 170)
}

export default function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const lenis = new Lenis({
      duration: 1.15,
      // Long, soft tail — the "luxury easing" feel, not a spring.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Native momentum on touch beats an emulated one.
      syncTouch: false,
      /* Anchor handling is ours, below — Lenis's own would write the fragment
         to the address bar, and this is a single page where "#treatments" in
         the URL is noise rather than a location worth linking to. */
      anchors: false,
    })

    instance = lenis
    // Lenis drives scroll itself; CSS smooth-behaviour would double-animate.
    document.documentElement.classList.add('lenis-on')

    let frame = 0
    const raf = (time) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      instance = null
      document.documentElement.classList.remove('lenis-on')
    }
  }, [enabled])
}

/*
 * Where the app is mounted — "/" on the domain root, "/<repo>/" on a GitHub
 * Pages project site. Always ends in a slash.
 *
 * Every path this module writes is built on it. Pushing a bare "/treatments"
 * under a sub-path deployment puts the address bar *outside* the app: the URL
 * still looks plausible, but a refresh or a shared copy of it asks the host for
 * something that was never deployed there.
 */
const BASE = import.meta.env.BASE_URL

/** Rewrites the address bar without navigating or touching the scroll. */
function setPath(path) {
  if (window.location.pathname === path) return
  window.history.pushState({}, '', path + window.location.search)
}

/**
 * Turns in-page links into clean paths. This is one page — "#treatments" in the
 * address bar is noise — so a click scrolls and writes `/treatments` instead.
 *
 * Only a click does. Scrolling deliberately leaves the URL alone: rewriting it
 * as sections pass under the header made the address bar flicker through five
 * paths on the way down, and the visitor never asked to go to any of them.
 *
 * One delegated handler covers every link, present and future. Because the
 * default action never runs, the browser never writes the fragment. Kept
 * independent of `useSmoothScroll`, which is off under reduced motion — the
 * URLs should behave the same either way.
 */
export function useCleanAnchors() {
  useEffect(() => {
    const onClick = (event) => {
      /* Modified clicks and anything but the primary button belong to the
         browser: open-in-new-tab on a same-page link should still work. */
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const link = event.target.closest?.('a[href^="#"]')
      if (!link) return

      const hash = link.getAttribute('href')
      if (!hash || hash === '#') return

      const target = document.querySelector(hash)
      if (!target) return

      event.preventDefault()

      /* The page's own top, not the top of the hero element — the hero begins
         under the fixed header, so offsetting it would leave a gap above. */
      if (hash === '#top') {
        smoothScrollTo(0)
        setPath(BASE)
      } else {
        scrollToSection(target)
        /* `#treatments` becomes `/treatments`. A path rather than a fragment:
           it reads as a page on a site that only has one, and it is what
           analytics can report on as a section view. */
        setPath(BASE + hash.slice(1))
      }
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  /* Two ways in from outside, both handled here.

     A fragment — a shared or bookmarked `#about`. The browser has already
     jumped there, so this only rewrites the URL into the path form.

     A path — `/about`, opened or refreshed directly. Nothing scrolls on its
     own, so the section has to be found and scrolled to. Section ids exist
     from the first render even while a section is still a lazy placeholder,
     which is what makes this work before anything below the fold has mounted. */
  useEffect(() => {
    const { hash, pathname } = window.location
    /* The section name with the mount point taken off the front, so `/about`
       and `/Bonitaa-Chennai-Skin/about` both resolve to `about`. */
    const withinApp = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname.slice(1)
    const id = hash ? hash.slice(1) : withinApp.replace(/\/$/, '')
    if (!id) return

    const target = document.getElementById(id)
    if (!target) return

    if (hash) window.history.replaceState(null, '', `${BASE}${id}`)
    /* After paint, so the observer-driven sections have had their first pass
       and the scroll lands on real content rather than a reserved height. */
    requestAnimationFrame(() => scrollToSection(target))
  }, [])
}
