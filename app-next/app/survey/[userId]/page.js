'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// ── Per-user config ──────────────────────────────────────────────
const USER_CONFIG = {
  // DonRobbo
  '8a2a16bf-d271-4261-8c13-5ea1747e9490': {
    firstName: 'DonRobbo',
    tier: 'superuser',
    promptFarmQ: true,
    engagementQ: false,
    stats: '5+ entries completed, leaderboard top rank, Mental Models fan',
  },
  // Erin
  'b87bca02-09d4-4eee-b4cd-0f25108fb988': {
    firstName: 'Erin',
    tier: 'superuser',
    promptFarmQ: true,
    engagementQ: false,
    stats: '5+ entries, Communication category, weekly feedback submitted',
  },
  // Brian
  'e9d50033-e41a-4b94-9e64-d621e638fb05': {
    firstName: 'Brian',
    tier: 'fence',
    promptFarmQ: true,
    engagementQ: true,
    stats: 'Sales Craft focus, applied discovery reframing in real calls',
  },
  // Andrew
  'd404f69d-66f0-4415-849d-e97b77d52e69': {
    firstName: 'Andrew',
    tier: 'low',
    promptFarmQ: false,
    engagementQ: true,
    stats: null,
  },
  // Landon
  'e7412e59-02f1-475e-806d-97a1e6eea048': {
    firstName: 'Landon',
    tier: 'low',
    promptFarmQ: false,
    engagementQ: true,
    stats: null,
  },
}

const CURRENT_SCREENSHOT = '/survey-assets/current-app.png'
const V3_SCREENSHOT = '/survey-assets/v3-prototype.png'

export default function SurveyPage() {
  const { userId } = useParams()
  const config = USER_CONFIG[userId]

  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [alreadyDone, setAlreadyDone] = useState(false)
  const [answers, setAnswers] = useState({
    design_preference: null,
    design_comment: '',
    prompt_farm_interest: null,
    prompt_farm_comment: '',
    biggest_friction: '',
    what_would_bring_back: '',
    feature_priorities: [],
    open_comment: '',
  })

  useEffect(() => {
    // Check if already submitted
    async function check() {
      const { data } = await supabase
        .from('beta_checkin')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle()
      if (data) setAlreadyDone(true)
    }
    if (userId) check()
  }, [userId])

  if (!config) {
    return (
      <div style={styles.root}>
        <div style={styles.wrap}>
          <div style={styles.wordmark}>ONE PERCENT</div>
          <p style={styles.bodyText}>This link isn't valid. Reach out to Matthew directly.</p>
        </div>
      </div>
    )
  }

  if (alreadyDone) {
    return (
      <div style={styles.root}>
        <div style={styles.wrap}>
          <div style={styles.wordmark}>ONE PERCENT</div>
          <h1 style={styles.heading}>Already got it.</h1>
          <p style={styles.bodyText}>You've already submitted this check-in. Thanks — your feedback is in.</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div style={styles.root}>
        <div style={styles.wrap}>
          <div style={styles.wordmark}>ONE PERCENT</div>
          <h1 style={styles.heading}>That's everything.</h1>
          <p style={styles.bodyText}>
            Seriously — thank you. This is exactly the kind of signal that makes the difference between building something real and guessing.
          </p>
          <p style={{ ...styles.bodyText, marginTop: 12, color: 'rgba(26,20,10,0.5)' }}>
            You'll hear from me directly once I've gone through all the responses.
          </p>
          <div style={styles.signoff}>— Matthew</div>
        </div>
      </div>
    )
  }

  // Build steps dynamically based on tier
  const steps = buildSteps(config, answers, setAnswers)
  const currentStep = steps[step]
  const isLast = step === steps.length - 1

  async function handleNext() {
    if (isLast) {
      await supabase.from('beta_checkin').insert({
        user_id: userId,
        tier: config.tier,
        ...answers,
      })
      setSubmitted(true)
    } else {
      setStep(s => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const progress = ((step + 1) / steps.length) * 100

  return (
    <div style={styles.root}>
      {/* Progress bar */}
      <div style={styles.progressTrack}>
        <div style={{ ...styles.progressFill, width: `${progress}%` }} />
      </div>

      <div style={styles.wrap}>
        <div style={styles.wordmark}>ONE PERCENT</div>
        <div style={styles.stepCount}>{step + 1} / {steps.length}</div>

        <h1 style={styles.heading}>{currentStep.heading}</h1>
        {currentStep.sub && <p style={styles.subText}>{currentStep.sub}</p>}

        <div style={{ marginTop: 24 }}>
          {currentStep.render()}
        </div>

        <button
          onClick={handleNext}
          disabled={currentStep.required && !currentStep.isAnswered()}
          style={{
            ...styles.btn,
            opacity: (currentStep.required && !currentStep.isAnswered()) ? 0.3 : 1,
          }}
        >
          {isLast ? 'SUBMIT →' : 'NEXT →'}
        </button>

        {!currentStep.required && step > 0 && (
          <button onClick={handleNext} style={styles.skipBtn}>
            SKIP THIS ONE
          </button>
        )}
      </div>
    </div>
  )
}

// ── Step builder ─────────────────────────────────────────────────
function buildSteps(config, answers, setAnswers) {
  const steps = []

  // Step 0 — Intro
  steps.push({
    heading: `${config.firstName}. Got a few minutes?`,
    sub: `This is a quick check-in — not a survey. I want to know what's working, what isn't, and where we go next. ${config.stats ? `You've put in real time with this: ${config.stats}.` : 'Your perspective matters to where this goes.'} Honest answers only.`,
    required: false,
    isAnswered: () => true,
    render: () => (
      <p style={{ ...styles.bodyText, fontStyle: 'italic', color: 'rgba(26,20,10,0.5)' }}>
        Takes about 3 minutes. No right answers.
      </p>
    ),
  })

  // Step 1 — Design side by side
  steps.push({
    heading: 'The app is getting a redesign.',
    sub: 'Current version on the left. Direction we\'re exploring on the right. Which feels more like the app you\'d actually use?',
    required: true,
    isAnswered: () => !!answers.design_preference,
    render: () => (
      <div>
        {/* Side by side */}
        <div style={styles.sideBySide}>
          <div style={styles.sideCard}>
            <div style={styles.sideLabel}>CURRENT</div>
            <img
              src={CURRENT_SCREENSHOT}
              alt="Current app"
              style={styles.sideImg}
            />
          </div>
          <div style={styles.sideCard}>
            <div style={styles.sideLabel}>NEW DIRECTION</div>
            <img
              src={V3_SCREENSHOT}
              alt="v3 prototype"
              style={styles.sideImg}
            />
          </div>
        </div>

        <div style={styles.optGroup}>
          {[
            { val: 'current', label: 'Keep the current look' },
            { val: 'v3', label: 'Go with the new direction' },
            { val: 'either', label: 'Either works for me' },
          ].map(o => (
            <button
              key={o.val}
              onClick={() => setAnswers(a => ({ ...a, design_preference: o.val }))}
              style={{
                ...styles.optBtn,
                ...(answers.design_preference === o.val ? styles.optBtnActive : {}),
              }}
            >
              {o.label}
            </button>
          ))}
        </div>

        <textarea
          placeholder="Any other thoughts on the look and feel? (optional)"
          value={answers.design_comment}
          onChange={e => setAnswers(a => ({ ...a, design_comment: e.target.value }))}
          style={styles.textarea}
          rows={3}
        />
      </div>
    ),
  })

  // Step 2 — Prompt farm (superusers + fence only)
  if (config.promptFarmQ) {
    steps.push({
      heading: 'The AI prompt — is it landing?',
      sub: 'We added a prompt at the end of each entry so you can take the concept further with AI. We\'re thinking about building a dedicated "Prompt Farm" — a library of ready-to-use prompts organized by concept. Would that be useful to you?',
      required: true,
      isAnswered: () => !!answers.prompt_farm_interest,
      render: () => (
        <div>
          <div style={styles.optGroup}>
            {[
              { val: 'yes', label: 'Yes — I\'d use that regularly' },
              { val: 'maybe', label: 'Maybe — depends on the prompts' },
              { val: 'no', label: 'Not really my thing' },
            ].map(o => (
              <button
                key={o.val}
                onClick={() => setAnswers(a => ({ ...a, prompt_farm_interest: o.val }))}
                style={{
                  ...styles.optBtn,
                  ...(answers.prompt_farm_interest === o.val ? styles.optBtnActive : {}),
                }}
              >
                {o.label}
              </button>
            ))}
          </div>
          <textarea
            placeholder="What would make the prompts actually useful to you? (optional)"
            value={answers.prompt_farm_comment}
            onChange={e => setAnswers(a => ({ ...a, prompt_farm_comment: e.target.value }))}
            style={styles.textarea}
            rows={3}
          />
        </div>
      ),
    })
  }

  // Step 3 — Engagement (fence + low)
  if (config.engagementQ) {
    steps.push({
      heading: 'What\'s getting in the way?',
      sub: 'Be straight with me — what\'s the thing that keeps you from opening the app?',
      required: false,
      isAnswered: () => true,
      render: () => (
        <div>
          <div style={styles.optGroup}>
            {[
              { val: 'forgetting', label: 'I just forget it exists' },
              { val: 'time', label: 'I don\'t have 5 minutes' },
              { val: 'relevance', label: 'The content isn\'t hitting for me' },
              { val: 'friction', label: 'Getting in is too much effort' },
              { val: 'habit', label: 'I haven\'t built the habit yet' },
            ].map(o => (
              <button
                key={o.val}
                onClick={() => setAnswers(a => ({ ...a, biggest_friction: o.val }))}
                style={{
                  ...styles.optBtn,
                  ...(answers.biggest_friction === o.val ? styles.optBtnActive : {}),
                }}
              >
                {o.label}
              </button>
            ))}
          </div>
          <textarea
            placeholder="Anything else? Be specific."
            value={answers.what_would_bring_back}
            onChange={e => setAnswers(a => ({ ...a, what_would_bring_back: e.target.value }))}
            style={styles.textarea}
            rows={3}
          />
        </div>
      ),
    })
  }

  // Step 4 — Feature priorities
  steps.push({
    heading: 'What should we build next?',
    sub: 'Pick up to 3. These go straight into the roadmap.',
    required: true,
    isAnswered: () => answers.feature_priorities.length > 0,
    render: () => {
      const features = [
        'Push notifications with custom timing',
        'Audio — listen instead of read',
        'Bookmark / save entries to revisit',
        'Home screen widget + streak counter',
        'Personalized goal-setting (coming before end of beta)',
        'Weekly retention quiz across all entries',
      ]
      return (
        <div style={styles.optGroup}>
          {features.map(f => {
            const selected = answers.feature_priorities.includes(f)
            return (
              <button
                key={f}
                onClick={() => {
                  setAnswers(a => {
                    const current = a.feature_priorities
                    if (selected) return { ...a, feature_priorities: current.filter(x => x !== f) }
                    if (current.length >= 3) return a
                    return { ...a, feature_priorities: [...current, f] }
                  })
                }}
                style={{
                  ...styles.optBtn,
                  ...(selected ? styles.optBtnActive : {}),
                  textAlign: 'left',
                }}
              >
                {f}
                {f.includes('coming before') && (
                  <span style={{ display: 'block', fontSize: 9, opacity: 0.6, marginTop: 2 }}>COMING BEFORE END OF BETA</span>
                )}
              </button>
            )
          })}
          <p style={{ fontSize: 10, color: 'rgba(26,20,10,0.4)', letterSpacing: '0.1em', marginTop: 8 }}>
            {answers.feature_priorities.length}/3 selected
          </p>
        </div>
      )
    },
  })

  // Step 5 — Open comment
  steps.push({
    heading: 'Anything else?',
    sub: 'Open floor. What haven\'t I asked that I should have?',
    required: false,
    isAnswered: () => true,
    render: () => (
      <textarea
        placeholder="Say whatever. This goes directly to me."
        value={answers.open_comment}
        onChange={e => setAnswers(a => ({ ...a, open_comment: e.target.value }))}
        style={{ ...styles.textarea, minHeight: 120 }}
        rows={5}
      />
    ),
  })

  return steps
}

// ── Styles ───────────────────────────────────────────────────────
const styles = {
  root: {
    minHeight: '100vh',
    background: '#ede9e0',
    fontFamily: "'DM Mono', monospace",
    WebkitFontSmoothing: 'antialiased',
  },
  progressTrack: {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    height: 3,
    background: 'rgba(26,20,10,0.1)',
    zIndex: 100,
  },
  progressFill: {
    height: '100%',
    background: '#1a140a',
    borderRadius: '0 2px 2px 0',
    transition: 'width 0.4s cubic-bezier(.22,1,.36,1)',
  },
  wrap: {
    maxWidth: 480,
    margin: '0 auto',
    padding: '48px 24px 80px',
  },
  wordmark: {
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: '0.28em',
    color: 'rgba(26,20,10,0.4)',
    marginBottom: 8,
  },
  stepCount: {
    fontSize: 9,
    letterSpacing: '0.2em',
    color: 'rgba(26,20,10,0.3)',
    marginBottom: 28,
  },
  heading: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 28,
    fontWeight: 600,
    lineHeight: 1.15,
    letterSpacing: '-0.02em',
    color: '#1a140a',
    margin: 0,
    marginBottom: 8,
  },
  subText: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: 'rgba(26,20,10,0.62)',
    lineHeight: 1.7,
    fontWeight: 300,
    margin: 0,
  },
  bodyText: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: 'rgba(26,20,10,0.62)',
    lineHeight: 1.7,
    fontWeight: 300,
  },
  sideBySide: {
    display: 'flex',
    gap: 10,
    marginBottom: 20,
  },
  sideCard: {
    flex: 1,
    background: '#faf8f4',
    border: '1px solid rgba(26,20,10,0.09)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  sideLabel: {
    fontSize: 7,
    letterSpacing: '0.22em',
    color: 'rgba(26,20,10,0.4)',
    padding: '8px 10px 6px',
    borderBottom: '1px solid rgba(26,20,10,0.07)',
  },
  sideImg: {
    width: '100%',
    display: 'block',
    objectFit: 'cover',
  },
  optGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 16,
  },
  optBtn: {
    padding: '13px 16px',
    background: '#faf8f4',
    border: '1px solid rgba(26,20,10,0.09)',
    borderRadius: 10,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    color: 'rgba(26,20,10,0.62)',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.18s',
    lineHeight: 1.4,
  },
  optBtnActive: {
    background: '#1a140a',
    borderColor: '#1a140a',
    color: '#faf8f4',
  },
  textarea: {
    width: '100%',
    background: '#e4e0d6',
    border: '1px solid rgba(26,20,10,0.09)',
    borderRadius: 10,
    padding: '12px 14px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    color: '#1a140a',
    outline: 'none',
    resize: 'none',
    boxSizing: 'border-box',
    lineHeight: 1.6,
  },
  btn: {
    marginTop: 28,
    width: '100%',
    padding: 16,
    background: '#1a140a',
    color: '#faf8f4',
    border: 'none',
    borderRadius: 10,
    fontFamily: "'DM Mono', monospace",
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: '0.18em',
    cursor: 'pointer',
    transition: 'opacity 0.2s, transform 0.18s',
  },
  skipBtn: {
    marginTop: 12,
    width: '100%',
    padding: '10px',
    background: 'transparent',
    color: 'rgba(26,20,10,0.35)',
    border: 'none',
    fontFamily: "'DM Mono', monospace",
    fontSize: 9,
    letterSpacing: '0.16em',
    cursor: 'pointer',
  },
  signoff: {
    marginTop: 32,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 16,
    color: 'rgba(26,20,10,0.5)',
    fontStyle: 'italic',
  },
}
