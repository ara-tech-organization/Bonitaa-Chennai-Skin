import result1 from './assets/result-1-pigmentation-evened.jpg'
import result2 from './assets/result-2-acne-settled.jpg'
import result3 from './assets/result-3-acne-scars-smoothed.jpg'
import result4 from './assets/result-4-pitted-scars-smoothed.jpg'
import result5 from './assets/result-5-texture-refined.jpg'

export const CLINIC = {
  /* The registered business name, which is what the Google listing, the maps
     embeds and the MedicalClinic schema in index.html all carry. The client's
     content brief spells the brand "Bonittaa" in places; that spelling is not
     used here, because a name on the page that does not match the name on the
     listing splits the local-SEO entity. */
  name: 'Bonitaa Skin and Hair Care',
  shortName: 'Bonitaa',
  phoneDisplay: '+91 93637 00199',
  phoneHref: 'tel:+919363700199',
  /* ⚠ This is the inbox the lead form delivers to (see submitLead.js), now
     also shown publicly in the footer. If the clinic has a patient-facing
     address, put that here instead — enquiries sent from the footer land
     wherever this points, which may not be the same team. */
  email: 'grow.10.x.org@gmail.com',
}

/* Addresses are stored as lines so each renders as its own block — no manual
   pre-line breaks fighting the column width. */
export const BRANCHES = [
  {
    id: 'mylapore',
    name: 'Mylapore',
    lines: ['First Floor, Door No: 200/1', 'Royapettah High Road', 'Chennai - 600004'],
    maps: 'https://share.google/oYqVRzkKhSDivvPR1',
    embed:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3927.351566109934!2d80.26182997985208!3d13.044365354474216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52674e6b7792f7%3A0xadf16dbc82f16cd0!2sBonitaa%20Skin%20and%20Hair%20Care!5e1!3m2!1sen!2sin!4v1785471746913!5m2!1sen!2sin',
  },
  {
    id: 'velachery',
    name: 'Velachery',
    lines: ['No. 16, Bharathi Nagar Bus Stop', 'Tharamani', 'Chennai - 600113'],
    maps: 'https://share.google/zlr3Tn6Ttaz4KIgbQ',
    embed:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.353715672163!2d80.22940837984476!3d12.981110254679605!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525d322d5c006f%3A0xde5c097bc87e2ce9!2sBonitaa%20Skin%20and%20Hair%20Care!5e1!3m2!1sen!2sin!4v1785471781803!5m2!1sen!2sin',
  },
]

/* Trust metrics — the only place branch count is stated as a number */
export const TRUST_STATS = [
  { icon: 'CalendarCheck', value: '15+', label: 'Years of Experience' },
  { icon: 'ShieldCheck', value: '18+', label: 'FDA-Approved Technologies' },
  { icon: 'Users', value: '10,000+', label: 'Happy Patients' },
  { icon: 'Star', value: '4.8', label: 'Google Rating' },
  { icon: 'MapPin', value: '35+', label: 'Branches Across Tamil Nadu' },
]

/**
 * CALL-URGENCY POPUP — follows the lead form when it is dismissed.
 *
 * ⚠ EVERY VALUE BELOW IS A CLAIM ABOUT THE CLINIC. The figures are taken from
 * the reference design and are placeholders: `wasPrice`, `nowPrice` and
 * `slotsLeft` state a real offer and a real availability, and a struck-through
 * price the clinic never charged is misleading advertising, not styling.
 * Replace them with the clinic's actual numbers before this goes live.
 *
 * `windowMinutes` drives the countdown. It restarts on every page load, so it
 * measures how long this visitor has been looking at the offer — not a
 * deadline the clinic is keeping. If the offer does have a real end time, say
 * so instead; a timer that resets on refresh is the kind of thing visitors
 * notice and stop trusting the rest of the page over.
 */
export const URGENCY = {
  slotsLeft: 6,
  wasPrice: '₹699',
  nowPrice: '₹99',
  priceNote: 'Skin consultation today only',
  windowMinutes: 15,
  /* Restated compactly here — the popup has room for three, not five. */
  proof: ['35+ Branches', '15+ Years', '10,000+ Patients'],
}

/* The six treatments from the client's content brief, in the brief's own
   order. The copy under each title is the brief's line verbatim. */
export const SERVICES = [
  {
    icon: 'ScanFace',
    title: 'Acne & Acne Scar Treatment',
    copy: 'Clear active acne and reduce acne scars with advanced skin treatments.',
  },
  {
    icon: 'Contrast',
    title: 'Pigmentation Treatment',
    copy: 'Reduce melasma, tanning, and uneven skin tone.',
  },
  {
    icon: 'Droplets',
    title: 'Hydra Facial',
    copy: 'Deep cleanse, hydrate, and brighten your skin instantly.',
  },
  {
    icon: 'Zap',
    title: 'Laser Hair Reduction',
    copy: 'Safe and effective laser treatment for long-lasting hair reduction.',
  },
  {
    icon: 'Hourglass',
    title: 'Anti-Ageing Treatment',
    copy: 'Reduce fine lines and improve skin firmness with advanced solutions.',
  },
  {
    icon: 'Sun',
    title: 'Skin Brightening',
    copy: 'Restore healthy, glowing skin with customized treatment plans.',
  },
]

/* Five now, not four — the brief lists five reasons, and the grid lays them out
   3 + 2 rather than dropping one.

   Titles only. The brief gives no supporting line under these, so the cards
   carry none: an invented sentence under each would be five claims about the
   clinic that nobody at the clinic wrote. The cards are sized for a title
   alone — see `.why__item` in App.css. */
export const WHY_US = [
  { icon: 'BadgeCheck', title: 'Experienced Skin Specialists' },
  { icon: 'Microscope', title: 'Advanced Skin Analysis' },
  { icon: 'ClipboardList', title: 'Personalized Treatment Plans' },
  { icon: 'ShieldCheck', title: 'FDA-Approved Technologies' },
  { icon: 'MapPin', title: 'Trusted Across Tamil Nadu' },
]

/**
 * The clinic's own skin before/after photographs. They replace six
 * hair-restoration cases carried over from the previous version of this page,
 * every one of which was captioned with a skin result its picture did not
 * show. Five cases, which is inside the brief's "Add 4–6 optimized before &
 * after images".
 *
 * Optimised on the way in: the supplied files were 7620 × 7620 at 6–9 MB each,
 * around 38 MB for the set. They are 1400px JPEGs now, 471 KB all told, which
 * is what makes them shippable in a section that shows one and preloads none.
 *
 * ⚠ THE TREATMENT LABELS ARE INFERRED, NOT SUPPLIED. Each caption describes
 * only what its own photograph visibly shows, but the treatment that produced
 * it is not something a picture can state — these are read off the visible
 * concern. Have the clinic confirm each one before launch: naming the wrong
 * treatment beside a real patient's result is a clinical claim, not a caption.
 *
 * One further case was supplied (70.jpg) and is deliberately not here: its two
 * halves could not be told apart as before and after — the right-hand image
 * shows more pigmentation than the left — so any caption would have asserted a
 * direction the photograph does not support. Add it back once the clinic says
 * which half is which.
 */
export const RESULTS = [
  { src: result1, caption: 'Even tone restored', treatment: 'Pigmentation Treatment' },
  { src: result2, caption: 'Inflamed acne settled', treatment: 'Acne Treatment' },
  { src: result3, caption: 'Acne scarring smoothed', treatment: 'Acne Scar Treatment' },
  { src: result4, caption: 'Pitted scarring softened', treatment: 'Acne Scar Treatment' },
  { src: result5, caption: 'Skin texture refined', treatment: 'Acne Scar Treatment' },
]

/* Google reviews supplied by the clinic, quoted as written. Nothing here is
   paraphrased or tidied — an edited review is no longer the patient's. */
export const REVIEWS = [
  {
    name: 'Murali',
    treatment: 'PRP Treatment',
    text: "My PRP treatment journey is ongoing, and I'm already highly impressed with the early results, particularly the reduced hair fall and initial improvements in thickness.",
  },
  {
    name: 'Dharsini',
    treatment: 'Hydra Facial',
    text: "I had an good HydraFacial experience with visible glow and hydration after the session. Overall, it's a reliable choice for skin rejuvenation with noticeable results.",
  },
  {
    name: 'Sharmila',
    treatment: 'Laser Treatment',
    text: "I'm genuinely impressed with the quality of service and would highly recommend Bonitaa for laser treatments.",
  },
]

export const FAQS = [
  {
    q: 'Which treatment is right for my skin?',
    a: 'Our specialists recommend the best treatment after a detailed skin analysis.',
  },
  {
    q: 'Do you treat acne and acne scars?',
    a: 'Yes. We offer advanced treatments for acne, acne scars, and pigmentation.',
  },
  {
    q: 'Is Laser Hair Reduction safe?',
    a: 'Yes. Our treatments are performed using advanced technology by trained professionals.',
  },
  {
    q: 'How do I book an appointment?',
    a: 'Simply call us or fill out the consultation form, and our Chennai team will contact you.',
  },
]
