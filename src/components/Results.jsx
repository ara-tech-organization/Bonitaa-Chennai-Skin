import { useCallback, useEffect, useRef, useState } from 'react'
import { RESULTS } from '../data'
import { scrollToBooking } from '../callStore'
import { useReveal } from '../hooks'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import Icon from './Icon'

const TOTAL = RESULTS.length
const PANEL_ID = 'rr-panel'
const STACKED = '(max-width: 1080px)'

/* Slider cadence, and how long a touch of the controls holds it off. The hold
   is longer than the interval on purpose: advancing 5s after someone has just
   chosen a case themselves reads as the page overriding them. */
const SLIDE_EVERY = 5000
const HOLD_AFTER_TOUCH = 9000

/** 0 → "01". The case index is set in display numerals, so it needs the zero. */
const pad = (n) => String(n + 1).padStart(2, '0')

/**
 * Two genuinely different compositions rather than one squeezed to fit.
 *
 * Desktop is a curated case viewer: one print held large on the left, and on the
 * right the open case set out as a sheet — its treatment, its outcome, and a
 * contact strip of all six prints to choose from.
 *
 * Below 1080px that becomes a swipeable slider — one case per screen, driven by
 * the thumb. A picker plus a photograph is a lot of vertical travel on a phone,
 * and a swipe is the natural gesture for browsing pictures. The slider is a real
 * scroll container with scroll-snap, so swiping, momentum and keyboard scrolling
 * are the browser's own.
 */
export default function Results() {
  const ref = useReveal()
  const reduced = usePrefersReducedMotion()
  const stageRef = useRef(null)
  const thumbsRef = useRef([])
  const trackRef = useRef(null)
  const frame = useRef(0)
  /* A timestamp rather than a boolean: a swipe has no reliable "finished"
     event across browsers, so the pause expires on its own instead of waiting
     for one that may never arrive and stalling the slider for good. */
  const pausedUntil = useRef(0)

  const [active, setActive] = useState(0)
  /* Autoplay only runs when the stage is both on screen and unattended. */
  const [onScreen, setOnScreen] = useState(false)
  const [held, setHeld] = useState(false)
  /* Drives which composition renders, so it has to be state. Seeded from the
     query itself — starting false would build the desktop layout first and
     immediately tear it down. */
  const [stacked, setStacked] = useState(() => window.matchMedia(STACKED).matches)

  useEffect(() => {
    const el = stageRef.current
    if (!el || !('IntersectionObserver' in window)) {
      setOnScreen(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      threshold: 0.3,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const mq = window.matchMedia(STACKED)
    const onChange = (e) => setStacked(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  /** Wrapping index change with no side effects — the autoplay path. */
  const step = useCallback((next) => setActive((next + TOTAL) % TOTAL), [])

  const pause = () => {
    pausedUntil.current = Date.now() + HOLD_AFTER_TOUCH
  }

  /**
   * One slide's worth of travel, measured off the DOM rather than assumed.
   *
   * `offsetWidth`, not `getBoundingClientRect().width`: off-centre slides are
   * scaled down, and the rect reports the *transformed* box. Measuring slide 0
   * while it sat off-centre therefore returned a width a tenth short, and every
   * `i * width` offset compounded that error until the wrong case was scrolled
   * to. `offsetWidth` is the layout box and ignores the transform.
   */
  const slideWidth = () => {
    const track = trackRef.current
    const card = track?.firstElementChild
    if (!card) return 0
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0
    return card.offsetWidth + gap
  }

  /** Moves the slider; `active` follows from the scroll handler, not from here. */
  const slideTo = useCallback(
    (next) => {
      const track = trackRef.current
      if (!track) return
      /* Every caller of this is a person — an arrow, a dot. Autoplay goes
         through `advanceSlider`, so it never holds itself off. */
      pause()
      const i = (next + TOTAL) % TOTAL
      track.scrollTo({ left: i * slideWidth(), behavior: reduced ? 'auto' : 'smooth' })
    },
    [reduced],
  )

  /**
   * The autoplay hand-off. Reads its position back off the track rather than
   * from `active`, so a swipe that lands between two slides still advances to
   * the right one and the timer can never work from a stale index.
   */
  const advanceSlider = useCallback(() => {
    const track = trackRef.current
    const w = slideWidth()
    if (!track || !w) return
    const next = (Math.round(track.scrollLeft / w) + 1) % TOTAL
    track.scrollTo({ left: next * w, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (!stacked || reduced || !onScreen) return
    const id = window.setInterval(() => {
      /* Skip rather than reset the interval — the cadence stays steady and the
         only cost of a paused tick is one missed advance. */
      if (Date.now() < pausedUntil.current) return
      advanceSlider()
    }, SLIDE_EVERY)
    return () => window.clearInterval(id)
  }, [stacked, reduced, onScreen, advanceSlider])

  /* The scroll position is the source of truth while swiping — reading it back
     is what keeps the counter and dots honest mid-gesture. */
  const onTrackScroll = () => {
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const track = trackRef.current
      const w = slideWidth()
      if (!track || !w) return
      const i = Math.round(track.scrollLeft / w)
      setActive(Math.max(0, Math.min(TOTAL - 1, i)))
    })
  }

  /** The user path on desktop: change case, and move focus to its thumbnail. */
  const go = useCallback(
    (next, focus) => {
      const i = (next + TOTAL) % TOTAL
      step(i)
      if (focus) thumbsRef.current[i]?.focus()
    },
    [step],
  )

  const onKeyDown = (event) => {
    const dir = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key]
    if (dir) {
      event.preventDefault()
      go(active + dir, true)
      return
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      go(event.key === 'Home' ? 0 : TOTAL - 1, true)
    }
  }

  const current = RESULTS[active]
  const move = stacked ? slideTo : go

  const counter = (
    <div className="rr__bar">
      <p className="rr__count">
        <span className="rr__count-now">{pad(active)}</span>
        <span className="rr__count-all">/ {pad(TOTAL - 1)}</span>
      </p>

      <div className="rr__nav">
        <button
          type="button"
          className="rr__step"
          onClick={() => move(active - 1)}
          aria-label="Previous case"
        >
          <Icon name="ArrowRight" size={16} />
        </button>
        <button
          type="button"
          className="rr__step"
          onClick={() => move(active + 1)}
          aria-label="Next case"
        >
          <Icon name="ArrowRight" size={16} />
        </button>
      </div>
    </div>
  )

  return (
    <section className="section section--cream rr" id="results" ref={ref}>
      <div className="shell">
        {/* The brief gives this section a heading and one line. The case-count
            seal that used to sit opposite is gone — "6 documented cases,
            photographed in-clinic" is a claim about the clinic's records, and
            the photographs it counted are still placeholders. */}
        <div className="results__head rr__head reveal">
          <div>
            <span className="eyebrow">
              <Icon name="Sparkles" size={13} />
              Before &amp; After Results
            </span>
            <h2>
              Real Patient <span className="gold-text">Transformations</span>
            </h2>
            <p>See real results achieved through personalized skin treatments.</p>
          </div>
        </div>

        {/* Deliberately not a `.reveal`. That class parks an element at
            opacity 0 until an IntersectionObserver adds `.is-in`, which is
            fine for a heading but not for the section's entire content: any
            miss — a direct jump to #results, a lazy mount that lands already
            past the threshold — leaves the whole section blank with no way to
            recover. The head and foot still animate; the cases just show. */}
        <div
          className={`rr__stage${stacked ? ' is-slider' : ''}`}
          ref={stageRef}
          onMouseEnter={() => setHeld(true)}
          onMouseLeave={() => setHeld(false)}
          onFocus={() => setHeld(true)}
          onBlur={() => setHeld(false)}
        >
          {stacked ? (
            <div className="rr__slider">
              {counter}

              <ul
                className="rr__track"
                ref={trackRef}
                onScroll={onTrackScroll}
                /* A finger on the track holds the timer off, so autoplay can
                   never take the slide out from under a swipe in progress. */
                onPointerDown={pause}
                onTouchStart={pause}
                aria-label="Patient cases"
              >
                {RESULTS.map((item, i) => (
                  <li className="rr__slide" key={item.src} aria-current={i === active || undefined}>
                    <div className="rr__plate">
                      {/* Its own class, not `.rr__shot.is-on` — a slide holds
                          one image outright, where `.rr__shot` is built for
                          the desktop stack where five of six are hidden. */}
                      <img
                        className="rr__slide-img"
                        src={item.src}
                        alt={`${item.caption} — ${item.treatment} result at our Chennai skin clinic`}
                        /* Only the first slide is on screen at rest; the others
                           arrive as the track is swiped. */
                        loading={i === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                      />
                      <span className="rr__stamp" aria-hidden="true">
                        Before <i>/</i> After
                      </span>
                    </div>

                    <p className="rr__slide-cap">
                      <span className="rr__row-treat">{item.treatment}</span>
                      <strong>{item.caption}</strong>
                    </p>
                  </li>
                ))}
              </ul>

              <div className="rr__dots">
                {RESULTS.map((item, i) => (
                  <button
                    key={item.src}
                    type="button"
                    className={`rr__dot${i === active ? ' is-on' : ''}`}
                    aria-label={`Case ${pad(i)}: ${item.treatment}`}
                    aria-current={i === active || undefined}
                    onClick={() => slideTo(i)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="rr__viewer">
                {/* Every case stays mounted and stacked, so a change is a
                    cross-fade with no layout shift and no second download when
                    a case comes back around. */}
                <div className="rr__plate" id={PANEL_ID}>
                  {RESULTS.map((item, i) => (
                    <img
                      key={item.src}
                      className={`rr__shot${i === active ? ' is-on' : ''}`}
                      src={item.src}
                      alt={`${item.caption} — ${item.treatment} result at our Chennai skin clinic`}
                      aria-hidden={i === active ? undefined : true}
                      loading="lazy"
                      decoding="async"
                    />
                  ))}

                  <span className="rr__stamp" aria-hidden="true">
                    Before <i>/</i> After
                  </span>
                </div>

                <span className="rr__edge rr__edge--tl" aria-hidden="true" />
                <span className="rr__edge rr__edge--br" aria-hidden="true" />
              </div>

              {/* An index on a spine. It was six lines of text, only one of
                  which said anything at a time — the other five were a
                  treatment name and nothing else, and the outcome unfolded out
                  of whichever row was open. Every row now states its own
                  outcome, so all six read at once and the open one is simply
                  the one that is lit.

                  No thumbnails in it, deliberately: each source is a four-up
                  before/after collage, and at the ~50px a row can spare none of
                  the four is legible — an index that shows a picture you cannot
                  read promises something it does not deliver. The print beside
                  it is where the looking happens. */}
              <div className="rr__index">
                {counter}

                {/* A disclosure set, not a tablist — `aria-expanded` describes
                    the one open case honestly. */}
                <ul className="rr__list" aria-label="Patient cases" onKeyDown={onKeyDown}>
                  {RESULTS.map((item, i) => {
                    const on = i === active
                    return (
                      <li key={item.src} className={on ? 'is-on' : undefined}>
                        <button
                          type="button"
                          id={`rr-row-${i}`}
                          className={`rr__row${on ? ' is-on' : ''}`}
                          aria-expanded={on}
                          aria-controls={PANEL_ID}
                          ref={(node) => {
                            thumbsRef.current[i] = node
                          }}
                          onClick={() => step(i)}
                        >
                          <span className="rr__node" aria-hidden="true" />

                          <span className="rr__row-body">
                            <span className="rr__row-treat">{item.treatment}</span>
                            <span className="rr__row-cap">{item.caption}</span>

                            {/* The track is on every row so the height never
                                changes as cases hand over — an empty one paints
                                nothing. The fill is mounted on the open row
                                only, which is what restarts it from zero on
                                every change; with motion off there is no fill
                                at all and nothing hands over. */}
                            {!reduced && (
                              <span className="rr__meter" aria-hidden="true">
                                {on && (
                                  <i
                                    data-run={onScreen && !held ? 'true' : 'false'}
                                    onAnimationEnd={() => step(active + 1)}
                                  />
                                )}
                              </span>
                            )}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="rr__foot reveal">
          <p className="rr__note">
            <Icon name="ShieldCheck" size={15} />
            Photographs of consenting patients. Results differ from person to person depending on
            skin type, the concern being treated, and treatment stage.
          </p>

          <button type="button" className="btn btn--gold btn--lg" onClick={scrollToBooking}>
            Book Consultation
            <Icon name="ArrowRight" size={18} className="arrow" />
          </button>
        </div>

        <span className="section-end" aria-hidden="true" />
      </div>

      {/* Announced separately — the print itself is a photograph swap, and the
          caption is what actually changes for a screen reader. */}
      <span className="sr-only" aria-live="polite">
        Case {pad(active)} of {pad(TOTAL - 1)}: {current.caption}, {current.treatment}
      </span>
    </section>
  )
}
