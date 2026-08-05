import { motion } from 'framer-motion'
import { scrollToBooking } from '../../callStore'
import Icon from '../Icon'
import BeforeAfter from './BeforeAfter'
import CTAButtons from './CTAButtons'
import { EYEBROW, HEADLINE, LEDE, SUBHEAD, TRUST_BADGES } from './heroContent'
import './hero.css'

const ease = [0.22, 1, 0.36, 1]

export default function Hero() {
  /* No scroll-linked motion here. The words each animate in once on load and
     then hold — nothing in this section moves as the page scrolls. */
  return (
    <section className="hero" id="top">
      {/* The hero's picture is the before/after frame in the second column —
          there is no full-bleed artwork behind it, just the dark ground and
          two blurred gold blooms drawn in CSS. */}
      <div className="hero__grid">
        {/* Copy sits in the white space the artwork already reserves. */}
        <div className="hero__copy">
          <motion.span
            className="hero__eyebrow"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease }}
          >
            {EYEBROW}
          </motion.span>

          <h1 className="hero__title">
            {HEADLINE.map((line, li) => (
              <span className="hero__line" key={li}>
                <motion.span
                  className="hero__line-inner"
                  initial={{ opacity: 0, y: '0.45em', filter: 'blur(11px)' }}
                  animate={{ opacity: 1, y: '0em', filter: 'blur(0px)' }}
                  transition={{ duration: 0.95, delay: 0.18 + li * 0.11, ease }}
                >
                  {line.map((word) => (
                    <span className={`hero__word${word.accent ? ' is-accent' : ''}`} key={word.t}>
                      {word.t}
                    </span>
                  ))}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="hero__sub"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.52, ease }}
          >
            {/* Each concern carries its own outline, so the group reflows to a
                second line without any dangling separator. */}
            {SUBHEAD.map((part) => (
              <span className="hero__sub-item" key={part}>
                {part}
              </span>
            ))}
          </motion.p>

          <motion.p
            className="hero__lede"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.62, ease }}
          >
            {LEDE}
          </motion.p>

          {/* The brief's trust badges, given their own row rather than folded
              in with the concern pills above — a figure and its meaning read
              as one unit, which a bare pill cannot carry. A list, because
              that is what three parallel credentials are. */}
          <motion.ul
            className="hero__trust"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease }}
          >
            {TRUST_BADGES.map((badge) => (
              <li className="hero__trust-item" key={badge.label}>
                <span className="hero__trust-ic" aria-hidden="true">
                  <Icon
                    name={badge.icon}
                    size={15}
                    /* Only the rating reads as a mark rather than a glyph —
                       a hollow star beside "4.8" looks like an empty one. */
                    fill={badge.icon === 'Star' ? 'currentColor' : 'none'}
                  />
                </span>
                <span className="hero__trust-copy">
                  <strong>{badge.value}</strong>
                  <small>{badge.label}</small>
                </span>
              </li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease }}
          >
            {/* "Call Skin Specialist" leads, per the brief. It is a tel: link
                that routes through the call confirmation modal on click. */}
            <CTAButtons onBook={scrollToBooking} />
          </motion.div>
        </div>

        <motion.div
          className="hero__showcase"
          initial={{ opacity: 0, x: 38 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease }}
        >
          <BeforeAfter />
        </motion.div>
      </div>
    </section>
  )
}
