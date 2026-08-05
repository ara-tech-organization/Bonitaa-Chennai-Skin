import { lazy, useEffect, useState } from 'react'
import CallProvider from './CallProvider'
import Booking from './components/Booking'
import CallModal from './components/CallModal'
import CallUrgency from './components/CallUrgency'
import ThankYou from './components/ThankYou'
import CallbackInvite from './components/CallbackInvite'
import Header from './components/Header'
import Hero from './components/hero/Hero'
import LazySection from './components/LazySection'
import ActionBar from './components/ActionBar'
import TrustBar from './components/TrustBar'
import usePrefersReducedMotion from './hooks/usePrefersReducedMotion'
import useSmoothScroll, { useCleanAnchors } from './hooks/useSmoothScroll'
import './App.css'

/* Everything from About down is below the fold on every viewport, so it ships
   as its own chunk and downloads on approach. The hero, the booking form and
   the trust bar stay eager — they are the first screen and the first scroll. */
const About = lazy(() => import('./components/About'))
const Results = lazy(() => import('./components/Results'))
const Services = lazy(() => import('./components/Services'))
const WhyUs = lazy(() => import('./components/WhyUs'))
const Reviews = lazy(() => import('./components/Reviews'))
const Faq = lazy(() => import('./components/Faq'))
const FinalCta = lazy(() => import('./components/FinalCta'))
const Footer = lazy(() => import('./components/Footer'))

/* Pushed on submit so analytics has a URL for the conversion, and popped when
   the visitor leaves the confirmation. Nothing is served at this path — it is
   a history entry over the landing page, not a document.

   Built on BASE_URL so it stays inside the app wherever it is mounted: on a
   GitHub Pages project site a bare "/thank-you" points at the organisation
   root, outside anything this repo deployed. */
const BASE = import.meta.env.BASE_URL
const THANK_YOU_PATH = `${BASE}thank-you`

export default function App() {
  const reduced = usePrefersReducedMotion()
  const [urgencyArmed, setUrgencyArmed] = useState(false)
  const [thanked, setThanked] = useState(false)
  // Momentum scrolling is a motion effect — off when the user opts out.
  useSmoothScroll(!reduced)
  // Section links scroll without leaving a fragment behind in the URL.
  useCleanAnchors()

  const showThanks = () => {
    window.history.pushState({ thanked: true }, '', THANK_YOU_PATH)
    setThanked(true)
    /* A single-page site fires no real pageview, so GTM is told by hand. This
       is what a "thank-you page" trigger keys off — the `lead_form_submitted`
       event from submitLead.js arrives alongside it. */
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'virtual_pageview', page_path: THANK_YOU_PATH })
  }

  const hideThanks = () => {
    setThanked(false)
    if (window.location.pathname === THANK_YOU_PATH) {
      window.history.pushState({}, '', BASE)
    }
  }

  /* The confirmation is a real history entry, so Back closes it and returns to
     the form — which is what pressing Back is asking for. */
  useEffect(() => {
    const onPop = () => setThanked(window.location.pathname === THANK_YOU_PATH)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return (
    <CallProvider>
      <Header />
      <main>
        <Hero />
        <Booking onSubmitted={showThanks} />
        <TrustBar />

        <LazySection anchorId="about" minHeight={620}>
          <About />
        </LazySection>

        <LazySection anchorId="results" minHeight={720}>
          <Results />
        </LazySection>

        <LazySection anchorId="treatments" minHeight={760}>
          <Services />
        </LazySection>

        <LazySection minHeight={520}>
          <WhyUs />
        </LazySection>

        <LazySection anchorId="reviews" minHeight={760}>
          <Reviews />
        </LazySection>

        <LazySection anchorId="faq" minHeight={620}>
          <Faq />
        </LazySection>

        {/* No anchor — nothing in the nav points here. It is the page's
            closing ask, met by scrolling to the end rather than jumped to. */}
        <LazySection minHeight={360}>
          <FinalCta />
        </LazySection>
      </main>

      <LazySection minHeight={480}>
        <Footer />
      </LazySection>

      <ActionBar />
      {/* Dismissing the lead form arms the call popup, which follows three
          seconds later. Submitting it does not — see CallbackInvite. */}
      <CallbackInvite onDismiss={() => setUrgencyArmed(true)} onSubmitted={showThanks} />
      <CallUrgency armed={urgencyArmed} />
      <ThankYou open={thanked} onClose={hideThanks} />
      <CallModal />
    </CallProvider>
  )
}
