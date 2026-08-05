import { WHY_US } from '../data'
import { useReveal } from '../hooks'
import Icon from './Icon'

export default function WhyUs() {
  const ref = useReveal()

  return (
    <section className="section section--cream why" ref={ref}>
      <div className="shell">
        <div className="section-head reveal">
          <span className="eyebrow">
            <Icon name="BadgeCheck" size={13} />
            Why Choose Bonittaa
          </span>
          {/* "Bonittaa", as the brief writes it — the same spelling as the
              title tag. CLINIC.name stays "Bonitaa Skin and Hair Care"
              wherever it has to match the Google listing. */}
          <h2>
            Why Chennai Chooses <span className="gold-text">Bonittaa</span>
          </h2>
          <div className="rule" />
        </div>

        {/* A rail, not a card grid. Treatments directly above is six boxes on
            a staggered grid, and repeating that shape here made the two
            sections read as one long run of tiles. These are five plain
            entries divided by gold hairlines — icon over title, no box. */}
        <ul className="why__rail">
          {WHY_US.map((item, i) => (
            <li key={item.title} className="why__item reveal" style={{ '--delay': `${i * 110}ms` }}>
              <span className="why__ic">
                <Icon name={item.icon} size={22} />
              </span>
              <h3>{item.title}</h3>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
