'use client'

import { useRouter } from 'next/navigation'

export default function AboutPage() {
  const router = useRouter()

  return (
    <div style={{ minHeight: '100vh', background: '#dadada', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px 80px' }}>

        {/* Header */}
        <div style={{ padding: '20px 0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, letterSpacing: '0.22em', fontWeight: 600, color: '#0a0a0a' }}>ONE PERCENT</span>
          <button
            onClick={() => router.back()}
            style={{ background: '#1a1a1a', border: 'none', borderRadius: 6, padding: '7px 12px', fontSize: 9, color: '#bbb', cursor: 'pointer', letterSpacing: '0.08em', fontWeight: 400 }}
          >
            ← BACK
          </button>
        </div>

        {/* Hero */}
        <div style={{ background: '#111', borderRadius: 10, padding: '32px 28px', marginBottom: 16 }}>
          <div style={{ fontSize: 9, color: '#E8FF47', letterSpacing: '0.18em', fontWeight: 600, marginBottom: 12 }}>WHAT IS THIS</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: 16 }}>
            One concept.<br />One percent better.<br />Every day.
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
            One Percent is a daily micro-learning system built around one idea: small, consistent gains compound into real capability over time. Each entry takes under five minutes and covers one concept — no fluff, no filler.
          </div>
        </div>

        {/* How it works */}
        <div style={{ background: '#1e1e1e', borderRadius: 10, padding: '24px 28px', marginBottom: 16 }}>
          <div style={{ fontSize: 9, color: '#bbb', letterSpacing: '0.18em', fontWeight: 600, marginBottom: 20 }}>HOW IT WORKS</div>
          {[
            { color: '#E8FF47', label: 'MORNING BRIEF', body: 'A sharp, focused explanation of the day\'s concept. Read it, absorb it, move on.' },
            { color: '#47FFE8', label: 'MIDDAY REFRAME', body: 'A prompt to apply the concept to something real in your day. Takes 60 seconds.' },
            { color: '#FF4778', label: 'EVENING QUIZ', body: 'Three questions to lock it in. No grade, no pressure — just a signal for what stuck.' },
            { color: '#C847FF', label: 'AI PROMPT', body: 'After the quiz, a ready-to-use prompt appears — built around the day\'s concept. Copy it into any AI and take the learning somewhere real.' },
          ].map(({ color, label, body }) => (
            <div key={label} style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
              <div style={{ width: 3, borderRadius: 2, background: color, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 9, color, letterSpacing: '0.12em', fontWeight: 700, marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{body}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div style={{ background: '#1e1e1e', borderRadius: 10, padding: '24px 28px', marginBottom: 16 }}>
          <div style={{ fontSize: 9, color: '#bbb', letterSpacing: '0.18em', fontWeight: 600, marginBottom: 20 }}>THE CATEGORIES</div>
          {[
            { color: '#E8FF47', label: 'Sales Craft', body: 'The mechanics of selling — discovery, negotiation, influence, and everything in between.' },
            { color: '#47FFE8', label: 'AI', body: 'How large language models actually work. Practical literacy for the moment we\'re in.' },
            { color: '#FF8C47', label: 'Vocab & Language', body: 'Words that change how you think — and how others hear you.' },
            { color: '#C847FF', label: 'Mental Models', body: 'Frameworks for clearer thinking, faster decisions, and fewer blind spots.' },
            { color: '#FF4778', label: 'Philosophy', body: 'Old ideas that still cut. Stoicism, ethics, and the examined life — applied.' },
            { color: '#47C8FF', label: 'Neuroscience & Cognition', body: 'How your brain actually works, and what to do about it.' },
            { color: '#FF8C00', label: 'Communication', body: 'Listening, framing, presence. The skills that make everything else work.' },
          ].map(({ color, label, body }) => (
            <div key={label} style={{ display: 'flex', gap: 14, marginBottom: 18, alignItems: 'flex-start' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 4 }} />
              <div>
                <div style={{ fontSize: 11, color, fontWeight: 600, marginBottom: 3, letterSpacing: '0.03em' }}>{label}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{body}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Philosophy */}
        <div style={{ background: '#111', borderRadius: 10, padding: '24px 28px' }}>
          <div style={{ fontSize: 9, color: '#bbb', letterSpacing: '0.18em', fontWeight: 600, marginBottom: 16 }}>THE ETHOS</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8 }}>
            This isn't a course. There's no certificate at the end. One Percent is a practice — something you return to daily because the compounding is the point. One entry. One concept. One percent better.
          </div>
        </div>

      </div>
    </div>
  )
}
