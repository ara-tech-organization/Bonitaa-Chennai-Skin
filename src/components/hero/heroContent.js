/**
 * The hero's copy, taken from the client's page content (section 1).
 *
 * NOTE ON NUMBERS — 4.8★, 15+ years and 10,000+ patients match the rest of the
 * site and the MedicalClinic structured data in index.html. A hero
 * contradicting the page's own aggregateRating is both a trust problem and an
 * SEO one, so every figure shown here has to exist somewhere else on the page
 * saying the same thing.
 */

export const EYEBROW = "Chennai's Trusted Skin Specialists"

/* Headline split per line so each reveals on its own beat. The brief's H1 is
   "Advanced Skin Treatments in Chennai"; the accent falls on the two words a
   visitor is actually scanning for. */
export const HEADLINE = [
  [{ t: 'Advanced' }],
  [{ t: 'Skin Treatments', accent: true }],
  [{ t: 'in Chennai' }],
]

/* The brief's sub-heading — four concerns rather than one credentials line, so
   someone arriving on a pigmentation search sees the word "pigmentation"
   inside the first screen. Rendered as separate pills; see hero.css. */
export const SUBHEAD = ['Acne', 'Pigmentation', 'Laser', 'Anti-Ageing']

export const LEDE =
  'Get expert skin analysis and personalized treatment from experienced skin specialists for healthier, clearer, and glowing skin.'

/**
 * The brief's three trust badges, shown as their own row under the lede.
 *
 * These are not the same thing as the pills above: those name what the clinic
 * treats, these say why the claim should be believed. Keeping them apart is
 * what stops the hero reading as one long undifferentiated run of chips.
 *
 * Deliberately a subset of TRUST_STATS in data.js rather than a second source
 * of truth — the full five-metric strip sits directly below the fold, and the
 * hero shows the three that matter before someone has scrolled at all.
 */
export const TRUST_BADGES = [
  { icon: 'Star', value: '4.8', label: 'Google Rating' },
  { icon: 'CalendarCheck', value: '15+', label: 'Years Experience' },
  { icon: 'Users', value: '10,000+', label: 'Happy Patients' },
]
