import { useState } from 'react'
import { BRANCHES } from '../data'
import { normalizePhone, submitLead, validatePhone } from '../submitLead'
import DatePicker from './DatePicker'
import Icon from './Icon'

/**
 * Name, mobile number, Chennai branch, preferred appointment date.
 *
 * `date` is a YYYY-MM-DD string chosen from the calendar — a day the clinic
 * can actually schedule against. It replaces the Morning/Afternoon/Evening
 * callback band the form briefly asked for instead: a band said when to ring,
 * a date says when to be seen, and the exact time is confirmed on the call.
 */
const EMPTY = { name: '', phone: '', city: '', branch: '', date: '' }

/**
 * The one enquiry form on the page. Both variants ask the same four questions;
 * `variant="compact"` only tightens the popup's spacing and labels.
 * `idPrefix` keeps input ids unique between the two instances.
 */
export default function LeadForm({
  variant = 'full',
  idPrefix = 'lead',
  submitLabel = 'Book Appointment',
  /* Lets a host know the enquiry landed — the exit popup uses it to decide
     whether a follow-up is appropriate. */
  onSuccess,
}) {
  const compact = variant === 'compact'
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const set = (key, next) => {
    setValues((v) => ({ ...v, [key]: next }))
    setErrors((err) => (err[key] ? { ...err, [key]: undefined } : err))
  }

  const field = (key) => (e) => set(key, e.target.value)
  /* The calendar hands back a value, not an event. */
  const pick = (key) => (next) => set(key, next)

  /* Every field is required, in both variants. The popup used to skip one of
     them and posted it empty, which the handler rejected — so every popup lead
     failed while the booking form went through. */
  const validate = () => {
    const next = {}
    if (values.name.trim().length < 2) next.name = 'Please enter your name'
    if (!validatePhone(values.phone)) next.phone = 'Enter a valid 10-digit mobile number'
    if (values.city.trim().length < 2) next.city = 'Please enter your area'
    if (!values.branch) next.branch = 'Please choose a branch'
    if (!values.date) next.date = 'Pick a date that suits you'
    return next
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length) return

    setStatus('sending')
    try {
      await submitLead({
        ...values,
        phone: normalizePhone(values.phone),
        source: compact ? 'callback-invite' : 'booking-section',
      })
      setStatus('done')
      setValues(EMPTY)
      /* The host decides what "done" looks like — it shows the thank-you view
         over the page and pushes the URL. Nothing navigates from here. */
      onSuccess?.()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="form__done" role="status">
        <span className="form__done-ring">
          <Icon name="CheckCircle2" size={30} />
        </span>
        <h3>Request received</h3>
        <p>
          Our team will call you back within 30 minutes during clinic hours. Keep your phone handy.
        </p>
        <button type="button" className="form__again" onClick={() => setStatus('idle')}>
          Send another request
        </button>
      </div>
    )
  }

  return (
    <form className={`form${compact ? ' form--compact' : ''}`} onSubmit={onSubmit} noValidate>
      <div className="form__row">
        <label className="field" htmlFor={`${idPrefix}-name`}>
          <span className="field__label">Name</span>
          <span className="field__wrap">
            <Icon name="User" size={17} />
            <input
              id={`${idPrefix}-name`}
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              value={values.name}
              onChange={field('name')}
              aria-invalid={Boolean(errors.name)}
            />
          </span>
          {errors.name && <span className="field__error">{errors.name}</span>}
        </label>

        <label className="field" htmlFor={`${idPrefix}-phone`}>
          <span className="field__label">Mobile Number</span>
          <span className="field__wrap">
            <Icon name="Phone" size={17} />
            <span className="field__prefix" aria-hidden="true">
              +91
            </span>
            {/* maxLength is roomy so a pasted "+91 93637 00199" isn't silently
                truncated into a different-but-valid-looking number. */}
            <input
              id={`${idPrefix}-phone`}
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={16}
              placeholder="Mobile number"
              value={values.phone}
              onChange={field('phone')}
              aria-invalid={Boolean(errors.phone)}
            />
          </span>
          {errors.phone && <span className="field__error">{errors.phone}</span>}
        </label>
      </div>

      {/* Where the visitor actually is, which the branch cannot answer: the two
          clinics are fixed points, and knowing someone is in Tambaram is what
          tells the desk which of them to offer. It is also the `city` the mail
          handler requires — that was being sent as the constant "Chennai",
          which satisfied the handler and told the clinic nothing. */}
      <label className="field" htmlFor={`${idPrefix}-city`}>
        <span className="field__label">City / Area</span>
        <span className="field__wrap">
          <Icon name="Navigation" size={17} />
          <input
            id={`${idPrefix}-city`}
            name="city"
            type="text"
            autoComplete="address-level2"
            placeholder="e.g. Velachery, Adyar, Tambaram"
            value={values.city}
            onChange={field('city')}
            aria-invalid={Boolean(errors.city)}
          />
        </span>
        {errors.city && <span className="field__error">{errors.city}</span>}
      </label>

      {/* Two clinics — a dropdown would hide both behind a click to save no
          space at all. As badges they are visible, comparable and one tap. */}
      <fieldset className="field field--choice">
        <legend className="field__label">
          <Icon name="MapPin" size={15} />
          Select Chennai Branch
        </legend>

        <div className="badges">
          {BRANCHES.map((b) => (
            <label key={b.id} className={`badge${values.branch === b.name ? ' is-on' : ''}`}>
              <input
                type="radio"
                name={`${idPrefix}-branch`}
                value={b.name}
                checked={values.branch === b.name}
                onChange={field('branch')}
                aria-invalid={Boolean(errors.branch)}
              />
              <span className="badge__tick" aria-hidden="true">
                <Icon name="Check" size={13} />
              </span>
              <span className="badge__text">
                <strong>{b.name}</strong>
                <small>Chennai</small>
              </span>
            </label>
          ))}
        </div>

        {errors.branch && <span className="field__error">{errors.branch}</span>}
      </fieldset>

      {/* In both variants. It is a field that opens a calendar, not an inline
          grid, so it costs the popup one row rather than a whole month. */}
      <DatePicker
        id={`${idPrefix}-date`}
        label={compact ? 'Preferred Date' : 'Preferred Appointment Date'}
        placeholder="Choose a date"
        value={values.date}
        onChange={pick('date')}
        error={errors.date}
      />

      {/* Shorter in the popup, where the long form wraps to two lines and the
          card is already fighting for the viewport. */}
      <p className="form__note">
        <Icon name="Lock" size={14} />
        {compact
          ? '100% confidential. No spam calls, ever.'
          : 'Your information stays 100% confidential. No spam calls, ever.'}
      </p>

      <button type="submit" className="btn btn--gold btn--block btn--lg" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : submitLabel}
        {status !== 'sending' && <Icon name="ArrowRight" size={18} className="arrow" />}
      </button>

      {status === 'error' && (
        <p className="form__error-banner" role="alert">
          Something went wrong. Please call us directly and we&apos;ll book you in.
        </p>
      )}
    </form>
  )
}
