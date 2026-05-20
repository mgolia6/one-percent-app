'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const STEPS = [
  {
    id: 'welcome',
    eyebrow: 'WELCOME',
    heading: "You're in the beta.",
    body: "One Percent is a daily micro-learning system — one concept, every day, across seven categories. Sales. AI. Language. Mental models. Philosophy. Neuroscience. Communication.\n\nVerified sources. Real content. No filler.",
    cta: "LET'S GO →",
    commitment: null,
  },
  {
    id: 'access',
    eyebrow: 'WHAT YOU\'RE GETTING',
    heading: '30 days. All seven categories. Daily.',
    body: "Full access to everything — every category, every entry, unlocked one per day for 30 days.\n\nEach entry has three parts: a Morning Brief to start your day sharp, a Midday Reframe to apply it, and an Evening Quiz to lock it in.",
    cta: 'GOT IT →',
    commitment: null,
  },
  {
    id: 'bug',
    eyebrow: 'FEEDBACK — 1 OF 4',
    heading: 'Something breaks — tell me.',
    body: "There's a BUG button in the top right of your library. Hit it, describe what happened, pick which page it was on.\n\nThat's it. I get the report instantly. Don't hold bugs — they slow everything down.",
    cta: 'GOT IT →',
    commitment: null,
  },
  {
    id: 'instant',
    eyebrow: 'FEEDBACK — 2 OF 4',
    heading: 'General feedback — anytime.',
    body: "FEEDBACK button, same spot in the library header. Use it whenever something feels off, something lands well, or you have a thought that doesn't fit anywhere else.\n\nNot just for problems. If something works, that's signal too.",
    cta: 'GOT IT →',
    commitment: null,
  },
  {
    id: 'daily',
    eyebrow: 'FEEDBACK — 3 OF 4',
    heading: 'Rate every entry. Every day.',
    body: "After the quiz, you'll get three quick ratings — the topic, the content, the quiz itself. Takes 20 seconds.\n\nThis is not optional. This daily signal is the whole point of having beta users. Without it, I'm building blind.\n\nDon't save it for later. Do it right after you finish while it's fresh.",
    cta: "I'LL RATE EVERY ONE →",
    commitment: 'Daily entry feedback — committed.',
  },
  {
    id: 'weekly',
    eyebrow: 'FEEDBACK — 4 OF 4',
    heading: 'Every 7 days: go deeper.',
    body: "Every week, a check-in appears automatically when you open an entry. It asks about clarity, relevance, the quiz, whether you'd recommend it — and what's missing.\n\nThis one needs actual words. Be specific. Be honest. Nice feedback is useless feedback.",
    cta: "I'LL DO IT →",
    commitment: 'Weekly check-in — committed.',
  },
  {
    id: 'final',
    eyebrow: 'END OF BETA',
    heading: 'One more ask at the end.',
    body: "At day 30, you'll get a final feedback form — same questions but zoomed out across the whole experience.\n\nIf you want to talk through it directly, I'm available for that too. No pressure on the call. The form is the real ask. But the offer stands.",
    cta: "I'M IN →",
    commitment: 'End-of-beta feedback — committed.',
  },
  {
    id: 'name',
    eyebrow: 'LAST THING',
    heading: 'What should I call you?',
    body: null,
    cta: 'START ONE PERCENT →',
    commitment: null,
    isNameStep: true,
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [user, setUser] = useState(null)
  const [name, setName] = useState('')
  const [committed, setCommitted] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [animate, setAnimate] = useState(true)

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      setUser(session.user)

      const { data: prof } = await supabase.from('profiles').select('onboarding_complete').eq('id', session.user.id).maybeSingle()
      if (prof?.onboarding_complete) { router.push('/'); return }
    }
    init()
  }, [router])

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  const advance = async () => {
    if (isLast) {
      if (!name.trim()) return
      setSubmitting(true)
      await supabase.from('profiles').update({
        name: name.trim(),
        onboarding_complete: true,
      }).eq('id', user.id)
      sessionStorage.removeItem('welcomed')
      router.push('/')
      return
    }

    if (current.commitment) {
      setCommitted(prev => [...prev, current.commitment])
    }

    setAnimate(false)
    setTimeout(() => {
      setStep(s => s + 1)
      setAnimate(true)
    }, 180)
  }

  const canAdvance = isLast ? name.trim().length > 0 : true
  const progress = (step / (STEPS.length - 1)) * 100

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #f0f4f8 0%, #e8eef5 50%, #dde6f0 100%)',
      fontFamily: "'DM Mono', 'Courier New', monospace",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .ob-card {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.32s ease, transform 0.32s ease;
        }
        .ob-card.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .ob-cta {
          background: #1a2a3a;
          color: #e8eef5;
          border: none;
          border-radius: 4px;
          padding: 16px 28px;
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.12em;
          cursor: pointer;
          width: 100%;
          transition: background 0.18s, transform 0.12s;
        }
        .ob-cta:hover:not(:disabled) {
          background: #243548;
          transform: translateY(-1px);
        }
        .ob-cta:active { transform: translateY(0); }
        .ob-cta:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }
        .ob-input {
          width: 100%;
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(26,42,58,0.15);
          border-radius: 4px;
          padding: 16px 18px;
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          color: #1a2a3a;
          outline: none;
          transition: border-color 0.18s, background 0.18s;
          backdrop-filter: blur(4px);
        }
        .ob-input:focus {
          border-color: rgba(26,42,58,0.4);
          background: rgba(255,255,255,0.8);
        }
        .ob-input::placeholder { color: rgba(26,42,58,0.3); }
        .ob-commit-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(26,42,58,0.08);
          border: 1px solid rgba(26,42,58,0.12);
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 10px;
          color: rgba(26,42,58,0.6);
          letter-spacing: 0.1em;
          font-family: 'DM Mono', monospace;
        }
        .noise-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }
      `}</style>

      <div className="noise-overlay" />

      <div style={{ position: 'fixed', top: '-15%', right: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(147,197,235,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-10%', left: '-5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(180,210,240,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'fixed', top: 28, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.25em', color: 'rgba(26,42,58,0.4)', fontWeight: 500 }}>ONE PERCENT</div>
      </div>

      {/* Progress bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, background: 'rgba(26,42,58,0.08)' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'rgba(26,42,58,0.3)', transition: 'width 0.4s ease' }} />
      </div>

      {/* Committed pills */}
      {committed.length > 0 && (
        <div style={{ position: 'fixed', bottom: 28, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', padding: '0 24px' }}>
          {committed.map((c, i) => (
            <div key={i} className="ob-commit-pill">
              <span style={{ color: 'rgba(26,42,58,0.5)' }}>✓</span> {c}
            </div>
          ))}
        </div>
      )}

      {/* Step dots */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 40 }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{
            width: i === step ? 20 : 6, height: 6, borderRadius: 3,
            background: i <= step ? 'rgba(26,42,58,0.5)' : 'rgba(26,42,58,0.12)',
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>

      {/* Card */}
      <div className={`ob-card${animate ? ' visible' : ''}`} style={{ width: '100%', maxWidth: 420 }}>

        <div style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(26,42,58,0.4)', fontWeight: 500, marginBottom: 14 }}>
          {current.eyebrow}
        </div>

        <div style={{ fontSize: 26, fontWeight: 400, color: '#1a2a3a', lineHeight: 1.25, marginBottom: 20, fontFamily: "'DM Sans', sans-serif", letterSpacing: '-0.02em' }}>
          {current.heading}
        </div>

        {current.body && (
          <div style={{ marginBottom: 32 }}>
            {current.body.split('\n\n').map((para, i, arr) => (
              <p key={i} style={{ fontSize: 14, color: 'rgba(26,42,58,0.65)', lineHeight: 1.8, marginBottom: i < arr.length - 1 ? 14 : 0, fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
                {para}
              </p>
            ))}
          </div>
        )}

        {current.isNameStep && (
          <div style={{ marginBottom: 28 }}>
            <input
              className="ob-input"
              type="text"
              placeholder="First name is fine"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && canAdvance && advance()}
              autoFocus
            />
            {user?.email && (
              <div style={{ fontSize: 11, color: 'rgba(26,42,58,0.35)', marginTop: 10, fontFamily: "'DM Mono', monospace", letterSpacing: '0.05em' }}>
                {user.email}
              </div>
            )}
          </div>
        )}

        <button className="ob-cta" onClick={advance} disabled={!canAdvance || submitting}>
          {submitting ? 'ONE MOMENT...' : current.cta}
        </button>

        {current.commitment && (
          <div style={{ marginTop: 14, fontSize: 11, color: 'rgba(26,42,58,0.35)', fontFamily: "'DM Mono', monospace", letterSpacing: '0.05em', textAlign: 'center' }}>
            Tapping commits you to this.
          </div>
        )}

        {step > 0 && (
          <div style={{ marginTop: current.commitment ? 28 : 24, textAlign: 'center' }}>
            <div style={{ display: 'inline-block', fontSize: 10, color: 'rgba(26,42,58,0.28)', letterSpacing: '0.06em', fontFamily: "'DM Mono', monospace", lineHeight: 1.6 }}>
              You can revisit this anytime —{' '}
              <span style={{ color: 'rgba(26,42,58,0.42)' }}>INFO</span> in your library.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
