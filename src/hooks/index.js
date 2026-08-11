import { useEffect, useRef, useState } from 'react'

/**
 * Adds `.is-in` once the element scrolls into view. One-shot — we unobserve
 * after the first intersection so nothing re-animates on scroll-back.
 */
export function useReveal(options) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-in')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px', ...options },
    )

    const targets = el.matches('.reveal') ? [el] : Array.from(el.querySelectorAll('.reveal'))
    targets.forEach((t) => observer.observe(t))

    return () => observer.disconnect()
  }, [options])

  return ref
}

/** True once the page has scrolled past `offset` pixels. */
export function useScrolledPast(offset = 20) {
  const [past, setPast] = useState(false)

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setPast(window.scrollY > offset))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [offset])

  return past
}

/**
 * Scroll-spy for the nav. Returns the id of the section the reader is looking
 * at, or '' at the top of the page — which is what lights Home.
 *
 * A reading line is drawn across the upper third of the visible band, and the
 * section it falls inside is the current one.
 *
 * It used to pick the last section whose top *edge* had crossed the header.
 * That leaves a gap the width of a section's own top padding — land with a
 * heading mid-screen and the section's top edge is still below the header, so
 * nothing matched at all and Home lit up while About filled the viewport.
 * Arriving on /about did exactly that. A line set down into the band closes the
 * gap without lighting a section that is merely peeking in at the bottom edge.
 *
 * When the line falls between sections, the last section whose top has passed
 * the header stays lit. Three stretches of this page carry no nav entry of
 * their own — Why Us, between Treatments and Reviews, and the closing CTA and
 * footer after the FAQ — and the menu should not go blank, and so back to
 * Home, while the reader is inside one of them.
 */
export function useActiveSection(ids, offset = 120) {
  const [active, setActive] = useState('')

  useEffect(() => {
    let frame = 0

    const resolve = () => {
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2

      if (atBottom) {
        setActive(ids[ids.length - 1])
        return
      }

      /* The band the reader can actually see — below the fixed header, above
         the fold — and the line drawn across it that decides what is current.
         Two fifths down: far enough below the header that a section arriving
         with its padding first still counts, near enough the top that one
         peeking in at the bottom edge does not. */
      const viewTop = offset
      const readingLine = viewTop + (window.innerHeight - viewTop) * 0.4

      let onTheLine = ''
      let lastPassed = ''

      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const box = el.getBoundingClientRect()

        if (box.top <= viewTop) lastPassed = id
        if (box.top <= readingLine && box.bottom > readingLine) onTheLine = id
      }

      setActive(onTheLine || lastPassed)
    }

    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(resolve)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [ids, offset])

  return active
}

/** Locks body scroll while a modal or drawer is open. */
export function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [locked])
}
