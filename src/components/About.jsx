import logo from '../assets/Logo.png'
import { scrollToBooking } from '../callStore'
import { useReveal } from '../hooks'
import Icon from './Icon'

const PILLARS = [
  { icon: 'Microscope', title: 'Skin analysis first', copy: 'Never a one-size-fits-all fix.' },
  { icon: 'ShieldCheck', title: 'FDA-approved technologies', copy: 'Backed by modern skin science.' },
]

/* Taken from the clinic's own description of the first consultation. The short
   label is the step's name; the line under it is the clinic's own wording. */
const CONSULT = [
  { label: 'Assess', copy: 'Your skin type and concerns assessed' },
  { label: 'Understand', copy: 'Your history and triggers discussed' },
  { label: 'Plan', copy: 'A treatment plan recommended for you' },
]

export default function About() {
  const ref = useReveal()

  return (
    <section className="section about" id="about" ref={ref}>
      {/* Argument on the left, proof on the right, process across the bottom.
          The heading and both paragraphs now read down one uninterrupted
          column — previously the title sat in one column and the copy that
          finishes its sentence sat in another, with the two pillars wedged
          between them. The pillars and the years figure are the same kind of
          thing (evidence for the claim), so they share one panel beside the
          argument instead of being scattered through it. */}
      <div className="shell">
        <div className="about__spread">
          <div className="about__copy">
            <span className="eyebrow reveal">
              <Icon name="Sparkles" size={13} />
              About Our Chennai Clinic
            </span>

            <h2 className="reveal" style={{ '--delay': '60ms' }}>
              Expert Skin Care, <span className="gold-text">Rooted in Chennai</span>
            </h2>

            <p className="about__sub reveal" style={{ '--delay': '110ms' }}>
              Personalised, Specialist-Led Treatment Plans
            </p>

            <p className="reveal" style={{ '--delay': '160ms' }}>
              Every treatment at our Chennai clinic starts with a proper skin analysis — not a
              one-size-fits-all fix. Our experienced skin specialists study what is actually driving
              your acne, pigmentation, or ageing concern, then build a plan around it using
              FDA-approved technologies and modern skin treatments.
            </p>

            <p className="reveal" style={{ '--delay': '200ms' }}>
              Backed by a network of clinics across Tamil Nadu, our approach hasn&apos;t changed in
              15 years: <strong className="about__em">treat the cause, not just the symptom.</strong>
            </p>

            <button
              type="button"
              className="btn btn--outline about__cta reveal"
              style={{ '--delay': '250ms' }}
              onClick={scrollToBooking}
            >
              Check If This Suits You
              <Icon name="ArrowRight" size={18} className="arrow" />
            </button>
          </div>

          {/* The years figure and the two pillars, one panel. The figure leads
              because it is the largest claim on the page's own terms; the
              pillars under it say how the years were spent. */}
          <aside className="about__proof reveal" style={{ '--delay': '140ms' }}>
            <img
              className="about__proof-mark"
              src={logo}
              alt=""
              width="150"
              height="37"
              loading="lazy"
            />

            <div className="about__figure">
              <strong>15</strong>
              <span>
                Years of
                <br />
                skin care
              </span>
            </div>

            <ul className="about__pillars">
              {PILLARS.map((p) => (
                <li key={p.title}>
                  <span className="about__pillar-ic">
                    <Icon name={p.icon} size={18} />
                  </span>
                  <div>
                    <strong>{p.title}</strong>
                    <small>{p.copy}</small>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        {/* The consultation as a numbered track rather than three ticks in a
            tinted box. Three checkmarks read as features; numerals on a rule
            read as an order of events, which is what a first visit is. */}
        <div className="about__track">
          <div className="about__track-head reveal" style={{ '--delay': '60ms' }}>
            <h3>What your first consultation includes</h3>
            <p className="about__track-note">
              <Icon name="Lock" size={14} />
              No treatment is recommended before your skin is analysed.
            </p>
          </div>

          <ol className="about__steps">
            {CONSULT.map((step, i) => (
              <li key={step.label} className="reveal" style={{ '--delay': `${140 + i * 110}ms` }}>
                <div className="about__step-top">
                  <span className="about__step-n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="about__step-rule" aria-hidden="true" />
                </div>
                <h4>{step.label}</h4>
                <p>{step.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
