import { SERVICES } from '../data'
import { useReveal } from '../hooks'
import CallLink from './CallLink'
import Icon from './Icon'

export default function Services() {
  const ref = useReveal()

  return (
    <section className="section services" id="treatments" ref={ref}>
      <div className="shell">
        <div className="section-head reveal">
          <span className="eyebrow">
            <Icon name="Sparkles" size={13} />
            Our Treatments
          </span>
          <h2>
            Treatments <span className="gold-text">We Offer</span>
          </h2>
          <div className="rule" />
        </div>

        {/* Three columns, but the middle one rides low — the six cards sit on
            two staggered baselines instead of a flat 3×2 block. The stagger is
            the whole change here; the cards themselves are the page's standard
            treatment card, unnumbered. */}
        <div className="services__grid">
          {SERVICES.map((service, i) => (
            <article
              key={service.title}
              className="svc reveal"
              style={{ '--delay': `${i * 95}ms` }}
            >
              <span className="svc__ic">
                <Icon name={service.icon} size={23} />
              </span>
              <h3>{service.title}</h3>
              <p>{service.copy}</p>
              <span className="svc__glow" aria-hidden="true" />
            </article>
          ))}
        </div>

        {/* The brief gives this block one line and a button, so the second
            line the layout used to carry is gone rather than reworded. */}
        <div className="services__cta reveal">
          <div>
            <strong>Not Sure Which Treatment You Need?</strong>
          </div>
          <CallLink className="btn btn--gold">
            <Icon name="PhoneCall" size={17} />
            Speak to Our Specialist
          </CallLink>
        </div>
      </div>
    </section>
  )
}
