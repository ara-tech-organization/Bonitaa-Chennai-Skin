import logo from '../assets/Logo.png'
import { BRANCHES, CLINIC } from '../data'
import { useReveal } from '../hooks'
import CallLink from './CallLink'
import Icon from './Icon'

const LINKS = [
  { label: 'Treatments', href: '#treatments' },
  { label: 'About', href: '#about' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Reviews', href: '#reviews' },
]

export default function Footer() {
  const ref = useReveal()

  return (
    <footer className="ftr" ref={ref}>
      <div className="shell">
        <div className="ftr__top">
          <div className="ftr__brand reveal">
            <img src={logo} alt={CLINIC.name} width="210" height="52" loading="lazy" />
            <p>
              Chennai&apos;s trusted skin clinic — part of a 35+ branch network across Tamil Nadu,
              15+ years of experience, 10,000+ patients treated.
            </p>
            <div className="ftr__contact">
              {/* A real tel:, matching the mailto below — the number is the
                  contact detail here, so it has to behave like one. */}
              <CallLink className="ftr__phone">
                <Icon name="Phone" size={19} />
                {CLINIC.phoneDisplay}
              </CallLink>

              {/* A real mailto rather than plain text — an address someone has
                  to retype by hand is an address they do not write to. */}
              <a className="ftr__mail" href={`mailto:${CLINIC.email}`}>
                <Icon name="Mail" size={17} />
                {CLINIC.email}
              </a>
            </div>
          </div>

          {/* Links before clinics in the source as well as on screen. The
              footer is two rows now — brand and links across the top, the two
              clinics across the whole of the second — and the maps are
              focusable, so source order has to match or tabbing out of the
              brand would jump to the bottom row and back up again. */}
          <nav className="ftr__links reveal" style={{ '--delay': '80ms' }} aria-label="Quick links">
            <h3 className="ftr__h">Quick Links</h3>
            <ul>
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>
                    <Icon name="ArrowRight" size={14} />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ftr__branches reveal" style={{ '--delay': '140ms' }}>
            <h3 className="ftr__h">Our Chennai Clinics</h3>
            <div className="ftr__branch-grid">
              {BRANCHES.map((branch) => (
                <div key={branch.id} className="ftr__branch">
                  <strong>
                    <Icon name="MapPin" size={16} />
                    {branch.name}
                  </strong>
                  <address>
                    {branch.lines.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </address>
                  <div className="ftr__branch-map">
                    <iframe
                      src={branch.embed}
                      title={`${branch.name} clinic location on Google Maps`}
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ftr__legal">
          <small>© {new Date().getFullYear()} {CLINIC.name}. All rights reserved.</small>
          <small className="ftr__credit">
            <Icon name="Heart" size={14} fill="currentColor" className="ftr__credit-heart" />
            Crafted by
            <a href="https://discovertechnologies.co/" target="_blank" rel="noopener noreferrer">
              ARA Discover Technology
            </a>
          </small>
        </div>
      </div>
    </footer>
  )
}
