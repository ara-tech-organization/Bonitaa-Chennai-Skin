import { CLINIC } from '../data'
import { useReveal } from '../hooks'
import CallLink from './CallLink'
import Icon from './Icon'
import LeadForm from './LeadForm'

const ASSURANCES = [
  { icon: 'ClipboardCheck', text: 'Skin analysis before any treatment is recommended' },
  { icon: 'BadgeCheck', text: 'Consultation with an experienced skin specialist' },
  { icon: 'Lock', text: 'Your details are never shared or sold' },
]

export default function Booking({ onSubmitted }) {
  const ref = useReveal()

  return (
    <section className="section booking" id="book" ref={ref}>
      <div className="shell">
        {/* The heading band carries the reply promise on its right rather than
            leaving the space empty. It was a badge inside the form card, which
            is the one place a visitor reads last — as a section-level line it
            is the first thing they see, and the head stops being a paragraph
            of type against an empty half. */}
        <div className="booking__head reveal">
          <div className="booking__head-copy">
            <span className="eyebrow">
              <Icon name="CalendarCheck" size={13} />
              Appointments
            </span>
            <h2>
              Book Your <span className="gold-text">Consultation</span>
            </h2>
            <p className="booking__sub">
              Complete the form and our Chennai team will call you shortly.
            </p>
          </div>

          <p className="booking__status">
            <span className="booking__pulse" aria-hidden="true" />
            Replies in 30 min
          </p>
        </div>

        {/* One surface, two panes — not a raised card next to a flat box. Two
            separate boxes side by side read as a choice between them; joined
            under one border with a shared gold edge they read as one desk,
            where the form is the work and the rail is what comes with it. */}
        <div className="booking__desk reveal">
          {/* The scroll target for every "Book" CTA on the page. It is the
              pane, not the section: stacked on mobile the section begins with
              the heading, so landing on #book put the form below the fold and
              the button appeared to go to the wrong place. */}
          <div className="booking__pane" id="book-form">
            <div className="booking__pane-top">
              <h3>Request a callback</h3>
              <span className="booking__hint">Four questions, under a minute</span>
            </div>
            <LeadForm idPrefix="lead" onSuccess={onSubmitted} />
          </div>

          <aside className="booking__rail">
            <h4 className="booking__rail-title">What your booking includes</h4>

            <ul className="booking__list">
              {ASSURANCES.map((item) => (
                <li key={item.text}>
                  <span className="booking__list-ic">
                    <Icon name={item.icon} size={16} />
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>

            {/* The number itself, not a button that hides it. A visitor who
                would rather phone can read it, long-press it or dial it — and
                a left click still routes through the call confirmation. Pushed
                to the foot of the rail so it lands beside the form's submit. */}
            <div className="booking__call">
              <p>Prefer to talk it through?</p>
              <CallLink className="booking__phone">
                <span className="booking__phone-ic">
                  <Icon name="PhoneCall" size={18} />
                </span>
                <span className="booking__phone-text">
                  <small>Call the clinic</small>
                  <strong>{CLINIC.phoneDisplay}</strong>
                </span>
                <Icon name="ArrowUpRight" size={17} className="booking__phone-go" />
              </CallLink>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
