import { useEffect, useState } from 'react'
import shot1 from '../../assets/result-1-crown-density.jpeg'
import shot2 from '../../assets/result-2-hairline-regrowth.png'
import shot3 from '../../assets/result-3-hairline-rebuilt.png'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'

/* Three cases, imported directly rather than through data.js — the hero is the
   eager bundle, and pulling the whole RESULTS array in would ship all six.

   ⚠ The three files are the same hair-restoration placeholders documented on
   RESULTS in data.js, and the labels below are the skin ones the page needs.
   They line up with the first three RESULTS entries on purpose, so swapping in
   the real skin photography is one change in each place, not a re-match. */
const CASES = [
  { src: shot1, treatment: 'Acne Treatment' },
  { src: shot2, treatment: 'Acne Scar Treatment' },
  { src: shot3, treatment: 'Pigmentation Treatment' },
]

const DWELL = 4200

/**
 * The hero's before/after showcase: a framed print that cycles through real
 * patient cases, with a gold line sweeping down it on each change.
 *
 * Every case stays mounted and stacked, so a change is a cross-fade with no
 * layout shift and no second download when a case comes back around. The
 * photographs are before/after collages, which is why they are contained
 * rather than cropped — a crop would cut into the comparison itself.
 */
export default function BeforeAfter() {
  const reduced = usePrefersReducedMotion()
  const [i, setI] = useState(0)

  useEffect(() => {
    if (reduced) return
    const t = window.setInterval(() => setI((n) => (n + 1) % CASES.length), DWELL)
    return () => window.clearInterval(t)
  }, [reduced])

  return (
    <div className="ba" aria-label="Patient before and after results">
      {/* Two frames fanned out behind the print, so it reads as the top of a
          stack of cases rather than a single floating photograph. */}
      <span className="ba__ghost ba__ghost--2" aria-hidden="true" />
      <span className="ba__ghost ba__ghost--1" aria-hidden="true" />

      <div className="ba__frame">
        {CASES.map((item, n) => (
          <img
            key={item.src}
            className={`ba__shot${n === i ? ' is-on' : ''}`}
            src={item.src}
            alt={n === i ? `Before and after — ${item.treatment} at our Chennai clinic` : ''}
            aria-hidden={n === i ? undefined : true}
            /* The first case is on screen immediately; the rest are only ever
               needed a few seconds later. */
            loading={n === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        ))}

        <span className="ba__stamp" aria-hidden="true">
          Before <i>/</i> After
        </span>

        {/* Restarted by the key, so the sweep runs once per case change. */}
        {!reduced && <span key={i} className="ba__scan" aria-hidden="true" />}

        <span className="ba__vignette" aria-hidden="true" />

        <p className="ba__caption">
          <span className="ba__dot" aria-hidden="true" />
          {CASES[i].treatment}
        </p>
      </div>

      <span className="ba__edge ba__edge--tl" aria-hidden="true" />
      <span className="ba__edge ba__edge--tr" aria-hidden="true" />
      <span className="ba__edge ba__edge--br" aria-hidden="true" />
      <span className="ba__edge ba__edge--bl" aria-hidden="true" />
    </div>
  )
}
