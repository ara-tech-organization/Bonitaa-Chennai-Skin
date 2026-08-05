import { REVIEWS } from '../data'
import { useReveal } from '../hooks'
import CallLink from './CallLink'
import Icon from './Icon'

function Stars({ size = 15 }) {
  return (
    <div className="stars" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="Star" size={size} fill="currentColor" />
      ))}
    </div>
  )
}

export default function Reviews() {
  const ref = useReveal()

  return (
    <section className="section reviews" id="reviews" ref={ref}>
      <div className="shell reviews__inner">
        {/* The score panel used to be a sticky column beside a stacked list.
            It is a band across the top now: heading on the left, the rating
            and the call on the right, with the reviews in a row beneath. Three
            reviews never filled a column tall enough for stickiness to do
            anything, and the panel just sat there while nothing scrolled past
            it. */}
        <div className="reviews__band reveal">
          <div className="reviews__band-copy">
            <span className="eyebrow">
              <Icon name="Star" size={13} />
              Google Reviews
            </span>

            <h2>
              What Our <span className="gold-text">Patients</span> Say
            </h2>
          </div>

          <div className="reviews__band-side">
            <div className="score">
              <strong className="score__value">4.8</strong>
              <div className="score__meta">
                <Stars size={17} />
                <small>Rated across Google reviews</small>
              </div>
            </div>

            {/* The brief puts a call under this section, not a scroll back up
                to the form — someone who has just read three strangers
                vouching for the clinic is closer to dialling than to filling
                anything in. */}
            <CallLink className="btn btn--gold">
              <Icon name="PhoneCall" size={17} />
              Call Now
            </CallLink>
          </div>
        </div>

        <ol className="reviews__list">
          {REVIEWS.map((review, i) => (
            <li key={review.name} className="rev reveal" style={{ '--delay': `${i * 110}ms` }}>
              <div className="rev__head">
                <span className="rev__avatar" aria-hidden="true">
                  {review.name.charAt(0)}
                </span>
                <span className="rev__who">
                  <strong>{review.name}</strong>
                  <small>{review.treatment}</small>
                </span>
                <span className="rev__badge">
                  <Icon name="BadgeCheck" size={14} />
                  Google
                </span>
              </div>

              <Stars />

              <p className="rev__text">{review.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
