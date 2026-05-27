'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Paperclip, User } from 'lucide-react'
import { TOTAL_ENTRIES } from '@/lib/config'
import { getUnlockedCount } from '@/lib/unlock'

const GREETINGS = [
  "Sharp minds don't take days off.",
  "One concept. Every day. That's the edge.",
  "What you learn today compounds.",
  "Show up. Do the work. That's it.",
  "Consistency is the only strategy that works.",
  "Today's concept is tomorrow's instinct.",
  "The reps are what matter.",
  "You're here. That counts.",
  "Small inputs. Long-term outputs.",
  "One percent better. Again.",
  "The work doesn't care how you feel.",
  "Keep going.",
  "Most people stop. You didn't.",
  "This is how it adds up.",
  "Do the reading. Apply the thing.",
]

function getDailyGreeting(name) {
  const dayIndex = new Date().getDay() * 3 + new Date().getDate()
  const greeting = GREETINGS[dayIndex % GREETINGS.length]
  return { name: name || 'there', line: greeting }
}

function ThinkingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 5, height: 5, borderRadius: '50%',
          background: '#333',
          animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

function WelcomeOverlay({ fullText, line, fading, onDismiss }) {
  const [displayed, setDisplayed] = useState('')
  const [lineVisible, setLineVisible] = useState(false)

  useEffect(() => {
    let i = 0
    const speed = 90
    const timer = setInterval(() => {
      i++
      setDisplayed(fullText.slice(0, i))
      if (i >= fullText.length) {
        clearInterval(timer)
        setTimeout(() => setLineVisible(true), 400)
      }
    }, speed)
    return () => clearInterval(timer)
  }, [fullText])

  return (
    <div onClick={onDismiss} style={{
      position: 'fixed', inset: 0, zIndex: 999,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 32, cursor: 'pointer',
      background: '#0a0a0a',
      opacity: fading ? 0 : 1,
      transition: 'opacity 0.6s ease',
    }}>
      <div style={{ fontSize: 9, letterSpacing: '0.25em', color: '#333', fontWeight: 600, marginBottom: 32 }}>ONE PERCENT</div>
      <div style={{
        fontSize: 36, fontWeight: 500, color: '#fff',
        letterSpacing: '-0.02em', textAlign: 'center', lineHeight: 1.2,
        marginBottom: 20, minHeight: 88,
        fontFamily: "'Inter', sans-serif",
      }}>
        {displayed}
        <span style={{ opacity: lineVisible ? 0 : 1, transition: 'opacity 0.3s', borderRight: '2px solid #fff', marginLeft: 2 }}>&nbsp;</span>
      </div>
      <div style={{
        fontSize: 13, color: '#444', letterSpacing: '0.04em',
        textAlign: 'center', maxWidth: 260, lineHeight: 1.8,
        opacity: lineVisible ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }}>
        {line}
      </div>
    </div>
  )
}

// TOTAL_ENTRIES imported from @/lib/config

const CATEGORY_COLORS = {
  'AI': '#47FFE8',
  'Sales Craft': '#E8FF47',
  'Vocab & Language': '#FF8C47',
  'Mental Models': '#C847FF',
  'Philosophy': '#FF4778',
  'Neuroscience & Cognition': '#47C8FF',
  'Communication': '#FF8C00',
}

const ENTRIES = [
  { entry: '001', editionId: 'AI.1.1', concept: 'Context Window', category: 'AI' },
  { entry: '002', editionId: 'VL.1', concept: 'Framing Effect', category: 'Vocab & Language' },
  { entry: '003', editionId: 'SC.1.1', concept: 'Discovery Questions', category: 'Sales Craft' },
  { entry: '004', editionId: 'MM.1', concept: 'Inversion', category: 'Mental Models' },
  { entry: '005', editionId: 'PH.1', concept: 'Premeditatio Malorum', category: 'Philosophy' },
  { entry: '006', editionId: 'AI.1.2', concept: 'Prompt Sensitivity', category: 'AI' },
  { entry: '007', editionId: 'SC.1.2', concept: 'Talk/Listen Ratio', category: 'Sales Craft' },
  { entry: '008', editionId: 'AI.2.1', concept: 'Chain-of-Thought Prompting', category: 'AI' },
  { entry: '009', editionId: 'MM.3', concept: 'Survivorship Bias', category: 'Mental Models' },
  { entry: '010', editionId: 'CM.2', concept: 'Feedback That Lands', category: 'Communication' },
  { entry: '011', editionId: 'PH.3', concept: 'Amor Fati', category: 'Philosophy' },
  { entry: '012', editionId: 'CM.3', concept: 'The Ladder of Inference', category: 'Communication' },
  { entry: '013', editionId: 'NC.3', concept: 'Dopamine & Motivation', category: 'Neuroscience & Cognition' },
  { entry: '014', editionId: 'VL.2', concept: 'Euphemism Treadmill', category: 'Vocab & Language' },
  { entry: '015', editionId: 'SC.2.1', concept: 'Anchoring in Negotiation', category: 'Sales Craft' },
  { entry: '016', editionId: 'MM.2', concept: 'Second-Order Thinking', category: 'Mental Models' },
  { entry: '017', editionId: 'AI.2.2', concept: 'Hallucination / Confabulation', category: 'AI' },
  { entry: '018', editionId: 'PH.2', concept: 'Dichotomy of Control', category: 'Philosophy' },
  { entry: '019', editionId: 'NC.1', concept: 'Neuroplasticity', category: 'Neuroscience & Cognition' },
  { entry: '020', editionId: 'SC.2.2', concept: 'Tactical Empathy', category: 'Sales Craft' },
  { entry: '021', editionId: 'CM.1', concept: 'Active Listening', category: 'Communication' },
  { entry: '022', editionId: 'SC.3.1', concept: 'Multi-Threading', category: 'Sales Craft' },
  { entry: '023', editionId: 'AI.3.1', concept: 'RAG (Retrieval-Augmented Generation)', category: 'AI' },
  { entry: '024', editionId: 'VL.3', concept: 'Nominalization', category: 'Vocab & Language' },
  { entry: '025', editionId: 'NC.2', concept: 'Meditation and the Brain', category: 'Neuroscience & Cognition' },
]

function FeedbackModal({ userId, onClose }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const submit = async () => {
    if (!rating) return
    setSubmitting(true)
    let image_url = null
    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const path = `feedback/${userId}-${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('screenshots').upload(path, imageFile)
      if (!uploadError) {
        const { data } = supabase.storage.from('screenshots').getPublicUrl(path)
        image_url = data.publicUrl
      }
    }
    await supabase.from('feedback').insert({
      user_id: userId,
      feedback_type: 'landing',
      overall_rating: rating,
      comment: comment.trim() || null,
      image_url,
    })
    setDone(true)
    setTimeout(onClose, 1500)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
      <div style={{ background: '#111', border: '1px solid #222', borderRadius: 8, padding: 32, maxWidth: 400, width: '100%' }}>
        {done ? (
          <div style={{ textAlign: 'center', fontSize: 13, color: '#47FFE8', letterSpacing: '0.08em' }}>FEEDBACK RECEIVED</div>
        ) : (
          <>
            <div style={{ fontSize: 11, letterSpacing: '0.15em', color: '#555', marginBottom: 8, fontWeight: 600 }}>FEEDBACK</div>
            <div style={{ fontSize: 16, color: '#fff', fontWeight: 500, marginBottom: 24 }}>How's One Percent working for you?</div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setRating(n)} style={{
                  flex: 1, padding: '12px 0', borderRadius: 4, border: `1px solid ${rating >= n ? '#47FFE8' : '#222'}`,
                  background: rating >= n ? '#47FFE822' : '#111', color: rating >= n ? '#47FFE8' : '#555',
                  fontSize: 14, cursor: 'pointer', fontFamily: "'Inter',sans-serif"
                }}>{n}</button>
              ))}
            </div>
            <div style={{ fontSize: 10, color: '#333', letterSpacing: '0.1em', marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
              <span>NOT USEFUL</span><span>ESSENTIAL</span>
            </div>

            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Anything specific? (optional)"
              style={{ width: '100%', background: '#0a0a0a', border: '1px solid #222', borderRadius: 4, padding: '12px 14px', fontSize: 13, color: '#bbb', fontFamily: "'Inter',sans-serif", resize: 'vertical', minHeight: 80, outline: 'none' }}
            />

            <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, cursor: 'pointer' }}>
              <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#888', border: '1px solid #222', borderRadius: 4, padding: '7px 12px', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif" }}><Paperclip size={11} strokeWidth={1.5} />ATTACH SCREENSHOT</span>
              {imagePreview && <img src={imagePreview} alt="preview" style={{ height: 36, borderRadius: 4, border: '1px solid #333', objectFit: 'cover' }} />}
            </label>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={onClose} style={{ flex: 1, padding: '12px 0', background: 'none', border: '1px solid #222', borderRadius: 4, fontSize: 11, color: '#555', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif" }}>CANCEL</button>
              <button onClick={submit} disabled={!rating || submitting} style={{ flex: 2, padding: '12px 0', background: rating ? '#47FFE8' : '#1a1a1a', border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 600, color: '#0a0a0a', cursor: rating ? 'pointer' : 'not-allowed', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif", opacity: submitting ? 0.6 : 1 }}>
                {submitting ? 'SENDING...' : 'SEND'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function WhatsNewModal({ entry, onDismiss }) {
  const bullets = entry.description.split('\n').filter(l => l.trim())
  const preview = bullets.slice(0, 4)
  const remaining = bullets.length - 4

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
      <div style={{ background: '#111', border: '1px solid #E8FF4733', borderRadius: 12, padding: 28, maxWidth: 400, width: '100%' }}>
        <div style={{ fontSize: 9, color: '#E8FF47', letterSpacing: '0.2em', fontWeight: 700, marginBottom: 6, fontFamily: "'Inter',sans-serif" }}>
          WHAT'S NEW — v{entry.version}
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em', marginBottom: 20, lineHeight: 1.3, fontFamily: "'Inter',sans-serif" }}>
          {entry.title}
        </div>
        {preview.map((line, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
            <div style={{ color: '#E8FF47', fontSize: 10, marginTop: 3, flexShrink: 0 }}>•</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, fontFamily: "'Inter',sans-serif" }}>{line.replace(/^•\s*/, '')}</div>
          </div>
        ))}
        {remaining > 0 && (
          <div style={{ fontSize: 11, color: '#444', marginTop: 4, marginLeft: 20, fontFamily: "'Inter',sans-serif" }}>+{remaining} more in the changelog</div>
        )}
        <button
          onClick={onDismiss}
          style={{ width: '100%', marginTop: 24, background: '#E8FF47', border: 'none', borderRadius: 6, padding: '13px', fontSize: 11, fontWeight: 700, color: '#0a0a0a', cursor: 'pointer', letterSpacing: '0.1em', fontFamily: "'Inter',sans-serif" }}
        >
          GOT IT
        </button>
      </div>
    </div>
  )
}

function BugModal({ userId, onClose }) {
  const [description, setDescription] = useState('')
  const [page, setPage] = useState('Library')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const submit = async () => {
    if (!description.trim()) return
    setSubmitting(true)
    let image_url = null
    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const path = `bugs/${userId}-${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('screenshots').upload(path, imageFile)
      if (!uploadError) {
        const { data } = supabase.storage.from('screenshots').getPublicUrl(path)
        image_url = data.publicUrl
      }
    }
    await supabase.from('bug_reports').insert({
      user_id: userId,
      page,
      description: description.trim(),
      browser_info: navigator.userAgent,
      image_url,
    })
    setDone(true)
    setTimeout(onClose, 1500)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
      <div style={{ background: '#111', border: '1px solid #222', borderRadius: 8, padding: 32, maxWidth: 400, width: '100%' }}>
        {done ? (
          <div style={{ textAlign: 'center', fontSize: 13, color: '#FF4778', letterSpacing: '0.08em' }}>REPORTED — THANKS</div>
        ) : (
          <>
            <div style={{ fontSize: 11, letterSpacing: '0.15em', color: '#555', marginBottom: 8, fontWeight: 600 }}>REPORT A BUG</div>
            <div style={{ fontSize: 16, color: '#fff', fontWeight: 500, marginBottom: 24 }}>What broke?</div>

            <select value={page} onChange={e => setPage(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #222', borderRadius: 4, padding: '10px 14px', fontSize: 13, color: '#bbb', fontFamily: "'Inter',sans-serif", marginBottom: 12, outline: 'none' }}>
              <option>Library</option>
              <option>Entry — Morning</option>
              <option>Entry — Midday</option>
              <option>Entry — Evening / Quiz</option>
              <option>Onboarding</option>
              <option>Info</option>
              <option>Login</option>
              <option>Other</option>
            </select>

            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe what happened..."
              style={{ width: '100%', background: '#0a0a0a', border: '1px solid #222', borderRadius: 4, padding: '12px 14px', fontSize: 13, color: '#bbb', fontFamily: "'Inter',sans-serif", resize: 'vertical', minHeight: 100, outline: 'none' }}
            />

            <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, cursor: 'pointer' }}>
              <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#888', border: '1px solid #222', borderRadius: 4, padding: '7px 12px', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif" }}><Paperclip size={11} strokeWidth={1.5} />ATTACH SCREENSHOT</span>
              {imagePreview && <img src={imagePreview} alt="preview" style={{ height: 36, borderRadius: 4, border: '1px solid #333', objectFit: 'cover' }} />}
            </label>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={onClose} style={{ flex: 1, padding: '12px 0', background: 'none', border: '1px solid #222', borderRadius: 4, fontSize: 11, color: '#555', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif" }}>CANCEL</button>
              <button onClick={submit} disabled={!description.trim() || submitting} style={{ flex: 2, padding: '12px 0', background: description.trim() ? '#FF4778' : '#1a1a1a', border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 600, color: '#fff', cursor: description.trim() ? 'pointer' : 'not-allowed', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif", opacity: submitting ? 0.6 : 1 }}>
                {submitting ? 'SENDING...' : 'REPORT'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const HOW_IT_WORKS = [
  {
    eyebrow: 'WELCOME',
    heading: "You're in the beta.",
    body: "One Percent is a daily micro-learning system — one concept, every day, across seven categories. Sales. AI. Language. Mental models. Philosophy. Neuroscience. Communication.\n\nVerified sources. Real content. No filler.",
  },
  {
    eyebrow: 'WHAT YOU\'RE GETTING',
    heading: '30 days. All seven categories. Daily.',
    body: "Full access to everything — every category, every entry, unlocked one per day for 30 days.\n\nEach entry has three parts: a Morning Brief to start your day sharp, a Midday Reframe to apply it, and an Evening Quiz to lock it in.",
  },
  {
    eyebrow: 'FEEDBACK — 1 OF 4',
    heading: 'Something breaks — tell me.',
    body: "There's a BUG button in the top right of your library. Hit it, describe what happened, pick which page it was on.\n\nThat's it. I get the report instantly. Don't hold bugs — they slow everything down.",
  },
  {
    eyebrow: 'FEEDBACK — 2 OF 4',
    heading: 'General feedback — anytime.',
    body: "FEEDBACK button, same spot in the library header. Use it whenever something feels off, something lands well, or you have a thought that doesn't fit anywhere else.\n\nNot just for problems. If something works, that's signal too.",
  },
  {
    eyebrow: 'FEEDBACK — 3 OF 4',
    heading: 'Rate every entry. Every day.',
    body: "After the quiz, you'll get three quick ratings — the topic, the content, the quiz itself. Takes 20 seconds.\n\nThis is not optional. This daily signal is the whole point of having beta users. Without it, I'm building blind.\n\nDon't save it for later. Do it right after you finish while it's fresh.",
  },
  {
    eyebrow: 'FEEDBACK — 4 OF 4',
    heading: 'Every 7 days: go deeper.',
    body: "Every week, a check-in appears automatically when you open an entry. It asks about clarity, relevance, the quiz, whether you'd recommend it — and what's missing.\n\nThis one needs actual words. Be specific. Be honest. Nice feedback is useless feedback.",
  },
  {
    eyebrow: 'END OF BETA',
    heading: 'One more ask at the end.',
    body: "At day 30, you'll get a final feedback form — same questions but zoomed out across the whole experience.\n\nIf you want to talk through it directly, I'm available for that too. No pressure on the call. The form is the real ask. But the offer stands.",
  },
]

// ── Weekly survey modal (fires at day 7, 14, 21) ─────────────────────────
const SURVEY_CATS = ['Sales Craft', 'AI', 'Vocab & Language', 'Mental Models', 'Philosophy', 'Neuroscience & Cognition', 'Communication']

function WkChipRow({ label, options, value, onChange }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, color: '#666', letterSpacing: '0.1em', marginBottom: 8, fontWeight: 600 }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {options.map(opt => (
          <button key={opt} onClick={() => onChange(opt)} style={{
            padding: '8px 14px', borderRadius: 3, fontSize: 12, cursor: 'pointer',
            fontFamily: "'Inter',sans-serif", fontWeight: 500,
            border: '1px solid ' + (value === opt ? '#47FFE8' : '#222'),
            background: value === opt ? '#47FFE822' : '#0a0a0a',
            color: value === opt ? '#47FFE8' : '#555', transition: 'all 0.15s',
          }}>{opt}</button>
        ))}
      </div>
    </div>
  )
}

function WkRatingRow({ label, question, value, onChange }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 9, color: '#47FFE8', letterSpacing: '0.15em', fontWeight: 700, marginBottom: 3 }}>{label}</div>
      {question && <div style={{ fontSize: 13, color: '#888', marginBottom: 8, lineHeight: 1.4 }}>{question}</div>}
      <div style={{ display: 'flex', gap: 6 }}>
        {[1,2,3,4,5].map(n => (
          <button key={n} onClick={() => onChange(n)} style={{
            flex: 1, padding: '10px 0', borderRadius: 3,
            border: '1px solid ' + (value >= n ? '#47FFE8' : '#222'),
            background: value >= n ? '#47FFE822' : '#0a0a0a',
            color: value >= n ? '#47FFE8' : '#555',
            fontSize: 13, cursor: 'pointer', fontFamily: "'Inter',sans-serif", transition: 'all 0.15s',
          }}>{n}</button>
        ))}
      </div>
    </div>
  )
}

function WkOpenText({ label, value, onChange, placeholder, minHeight }) {
  return (
    <div style={{ marginBottom: 20 }}>
      {label && <div style={{ fontSize: 11, color: '#666', letterSpacing: '0.1em', marginBottom: 8, fontWeight: 600 }}>{label}</div>}
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || 'Be specific.'} style={{
        width: '100%', background: '#060606', border: '1px solid #222', borderRadius: 4,
        padding: '12px 14px', fontSize: 13, color: '#bbb', fontFamily: "'Inter',sans-serif",
        resize: 'vertical', minHeight: minHeight || 64, outline: 'none', boxSizing: 'border-box',
      }} />
    </div>
  )
}

function WkSection({ title }) {
  return <div style={{ fontSize: 9, color: '#333', letterSpacing: '0.2em', fontWeight: 700, marginBottom: 16, marginTop: 28, paddingBottom: 8, borderBottom: '1px solid #1a1a1a' }}>{title}</div>
}

// ── End-of-Beta Survey components ───────────────────────────────────────────
const EOB_ACCENT = '#FF4778'
const EOB_CATS = ['Sales Craft', 'AI', 'Vocab & Language', 'Mental Models', 'Philosophy', 'Neuroscience & Cognition', 'Communication']

function EobRatingRow({ label, question, value, onChange }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 9, color: EOB_ACCENT, letterSpacing: '0.15em', fontWeight: 700, marginBottom: 3 }}>{label}</div>
      {question && <div style={{ fontSize: 13, color: '#aaa', marginBottom: 8, lineHeight: 1.4 }}>{question}</div>}
      <div style={{ display: 'flex', gap: 6 }}>
        {[1,2,3,4,5].map(n => (
          <button key={n} onClick={() => onChange(n)} style={{
            flex: 1, padding: '10px 0', borderRadius: 3,
            border: '1px solid ' + (value >= n ? EOB_ACCENT : '#222'),
            background: value >= n ? EOB_ACCENT + '22' : '#111',
            color: value >= n ? EOB_ACCENT : '#555',
            fontSize: 13, cursor: 'pointer', fontFamily: "'Inter',sans-serif", transition: 'all 0.15s',
          }}>{n}</button>
        ))}
      </div>
    </div>
  )
}

function EobChipRow({ label, options, value, onChange }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, color: '#666', letterSpacing: '0.1em', marginBottom: 8, fontWeight: 600 }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {options.map(opt => (
          <button key={opt} onClick={() => onChange(opt)} style={{
            padding: '8px 14px', borderRadius: 3, fontSize: 12, cursor: 'pointer',
            fontFamily: "'Inter',sans-serif", fontWeight: 500,
            border: '1px solid ' + (value === opt ? EOB_ACCENT : '#222'),
            background: value === opt ? EOB_ACCENT + '22' : '#111',
            color: value === opt ? EOB_ACCENT : '#555', transition: 'all 0.15s',
          }}>{opt}</button>
        ))}
      </div>
    </div>
  )
}

function EobOpenText({ label, value, onChange, placeholder, minHeight }) {
  return (
    <div style={{ marginBottom: 20 }}>
      {label && <div style={{ fontSize: 11, color: '#666', letterSpacing: '0.1em', marginBottom: 8, fontWeight: 600 }}>{label}</div>}
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || 'Be specific.'} style={{
        width: '100%', background: '#0a0a0a', border: '1px solid #222', borderRadius: 4,
        padding: '12px 14px', fontSize: 13, color: '#bbb', fontFamily: "'Inter',sans-serif",
        resize: 'vertical', minHeight: minHeight || 64, outline: 'none', boxSizing: 'border-box',
      }} />
    </div>
  )
}

function EobSection({ title }) {
  return <div style={{ fontSize: 9, color: '#444', letterSpacing: '0.2em', fontWeight: 700, marginBottom: 16, marginTop: 28, paddingBottom: 8, borderBottom: '1px solid #1a1a1a' }}>{title}</div>
}

function EndOfBetaModal({ userId, onClose }) {
  const [overallRating, setOverallRating] = useState(0)
  const [perceptionChange, setPerceptionChange] = useState(null)
  const [whyStopped, setWhyStopped] = useState('')
  const [clarityRating, setClarityRating] = useState(0)
  const [relevanceRating, setRelevanceRating] = useState(0)
  const [quizRating, setQuizRating] = useState(0)
  const [mostValueCat, setMostValueCat] = useState(null)
  const [couldCutCat, setCouldCutCat] = useState(null)
  const [structureVerdict, setStructureVerdict] = useState(null)
  const [structureDetail, setStructureDetail] = useState('')
  const [commitment, setCommitment] = useState(null)
  const [topicToAdd, setTopicToAdd] = useState('')
  const [peakStreak, setPeakStreak] = useState(null)
  const [openDriver, setOpenDriver] = useState(null)
  const [skipReason, setSkipReason] = useState('')
  const [leaderboardEffect, setLeaderboardEffect] = useState(null)
  const [mustChange, setMustChange] = useState('')
  const [mustKeep, setMustKeep] = useState('')
  const [brokenThing, setBrokenThing] = useState('')
  const [devicePref, setDevicePref] = useState(null)
  const [nameVerdict, setNameVerdict] = useState(null)
  const [nameSuggestion, setNameSuggestion] = useState('')
  const [publicPitch, setPublicPitch] = useState('')
  const [notFor, setNotFor] = useState('')
  const [wouldPay, setWouldPay] = useState(null)
  const [priceRange, setPriceRange] = useState(null)
  const [wouldRefer, setWouldRefer] = useState(null)
  const [referDetail, setReferDetail] = useState('')
  const [launchModel, setLaunchModel] = useState(null)
  const [sixMonth, setSixMonth] = useState(0)
  const [toTen, setToTen] = useState('')
  const [biggestWin, setBiggestWin] = useState('')
  const [ifYouWereMe, setIfYouWereMe] = useState('')
  const [anythingElse, setAnythingElse] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const coreReady = overallRating && perceptionChange && clarityRating && relevanceRating && quizRating && mostValueCat && structureVerdict && commitment && peakStreak && openDriver && leaderboardEffect && mustChange && mustKeep && devicePref && nameVerdict && wouldPay && wouldRefer && launchModel && sixMonth && biggestWin && ifYouWereMe

  const submit = async () => {
    if (!coreReady) return
    setSubmitting(true)
    const parts = [
      perceptionChange && ('perception:' + perceptionChange),
      whyStopped && ('why_stopped:' + whyStopped),
      mostValueCat && ('most_value:' + mostValueCat),
      couldCutCat && ('could_cut:' + couldCutCat),
      structureVerdict && ('structure:' + structureVerdict),
      structureDetail && ('structure_detail:' + structureDetail),
      commitment && ('commitment:' + commitment),
      topicToAdd && ('topic_add:' + topicToAdd),
      peakStreak && ('peak_streak:' + peakStreak),
      openDriver && ('open_driver:' + openDriver),
      skipReason && ('skip_reason:' + skipReason),
      leaderboardEffect && ('leaderboard:' + leaderboardEffect),
      mustChange && ('must_change:' + mustChange),
      mustKeep && ('must_keep:' + mustKeep),
      brokenThing && ('broken:' + brokenThing),
      devicePref && ('device:' + devicePref),
      nameVerdict && ('name:' + nameVerdict),
      nameSuggestion && ('name_suggestion:' + nameSuggestion),
      publicPitch && ('pitch:' + publicPitch),
      notFor && ('not_for:' + notFor),
      wouldPay && ('would_pay:' + wouldPay),
      priceRange && ('price:' + priceRange),
      referDetail && ('refer_detail:' + referDetail),
      launchModel && ('launch_model:' + launchModel),
      sixMonth && ('six_month:' + sixMonth),
      toTen && ('to_ten:' + toTen),
      ifYouWereMe && ('if_you_were_me:' + ifYouWereMe),
    ].filter(Boolean)
    const { error } = await supabase.from('feedback').insert({
      user_id: userId,
      feedback_type: 'end_of_beta',
      overall_rating: overallRating,
      clarity_rating: clarityRating,
      topic_rating: relevanceRating,
      quiz_rating: quizRating,
      would_recommend: wouldRefer,
      missing_topics: parts.join(' | '),
      biggest_win: biggestWin || null,
      comment: anythingElse || null,
    })
    if (!error) {
      await supabase.from('profiles').update({ end_of_beta_survey_done: true }).eq('id', userId)
    }
    setSubmitting(false)
    if (!error) setDone(true)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000, background: '#0a0a0a',
      overflowY: 'auto', fontFamily: "'Inter',sans-serif",
    }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '48px 24px 80px' }}>
        {done ? (
          <div style={{ textAlign: 'center', paddingTop: 80 }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>✓</div>
            <div style={{ fontSize: 18, color: '#fff', fontWeight: 700, marginBottom: 8 }}>Done. Thank you.</div>
            <div style={{ fontSize: 13, color: '#555', marginBottom: 32 }}>This shapes what comes next.</div>
            <button onClick={onClose} style={{ background: EOB_ACCENT, border: 'none', borderRadius: 4, padding: '12px 32px', fontSize: 11, fontWeight: 600, color: '#fff', cursor: 'pointer', letterSpacing: '0.1em' }}>BACK TO APP</button>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 9, letterSpacing: '0.2em', color: EOB_ACCENT, marginBottom: 6, fontWeight: 600 }}>END OF BETA</div>
            <div style={{ fontSize: 24, color: '#fff', fontWeight: 700, marginBottom: 6 }}>All done. Zoom out.</div>
            <div style={{ fontSize: 13, color: '#555', marginBottom: 32, lineHeight: 1.6 }}>This is the full debrief. Be specific — this one shapes v1.</div>

            <EobSection title="OVERALL" />
            <EobRatingRow label="OVERALL RATING" question="How would you rate One Percent?" value={overallRating} onChange={setOverallRating} />
            <EobChipRow label="COMPARED TO DAY 1, HOW HAS YOUR PERCEPTION CHANGED?" options={['Much better', 'Somewhat better', 'About the same', 'Worse', 'I stopped using it']} value={perceptionChange} onChange={setPerceptionChange} />
            {(perceptionChange === 'Worse' || perceptionChange === 'I stopped using it') && <EobOpenText value={whyStopped} onChange={setWhyStopped} placeholder="What happened?" />}

            <EobSection title="CONTENT AND DEPTH" />
            <EobRatingRow label="CLARITY" question="How clear was the content overall?" value={clarityRating} onChange={setClarityRating} />
            <EobRatingRow label="RELEVANCE" question="How useful to your actual work?" value={relevanceRating} onChange={setRelevanceRating} />
            <EobRatingRow label="QUIZ QUALITY" question="Was it testing the right things?" value={quizRating} onChange={setQuizRating} />
            <EobChipRow label="WHICH CATEGORY DELIVERED THE MOST VALUE?" options={EOB_CATS} value={mostValueCat} onChange={setMostValueCat} />
            <EobChipRow label="WHICH CATEGORY COULD BE CUT WITHOUT YOU NOTICING?" options={[...EOB_CATS, 'None']} value={couldCutCat} onChange={setCouldCutCat} />
            <EobChipRow label="WAS THE MORNING BRIEF / MIDDAY REFRAME / EVENING QUIZ STRUCTURE RIGHT?" options={['Yes — keep it', 'Needs tweaks', 'Rethink it']} value={structureVerdict} onChange={setStructureVerdict} />
            {structureVerdict && structureVerdict !== 'Yes — keep it' && <EobOpenText value={structureDetail} onChange={setStructureDetail} placeholder="What would you change?" />}
            <EobChipRow label="WAS 10 MINUTES THE RIGHT COMMITMENT?" options={['Too short', 'Just right', 'Too long', 'Inconsistent']} value={commitment} onChange={setCommitment} />
            <EobOpenText label="WHAT TOPIC DO YOU MOST WANT ADDED BEFORE PUBLIC LAUNCH?" value={topicToAdd} onChange={setTopicToAdd} placeholder="Be specific." />

            <EobSection title="HABIT AND RETENTION" />
            <EobChipRow label="AT YOUR PEAK, HOW MANY DAYS IN A ROW DID YOU USE IT?" options={['1', '2-3', '4-6', '7+', 'Every day']} value={peakStreak} onChange={setPeakStreak} />
            <EobChipRow label="BIGGEST DRIVER OF OPENING THE APP ON ANY GIVEN DAY?" options={['Reminder email', 'Habit', 'Curiosity', 'Streak', 'Nothing consistent']} value={openDriver} onChange={setOpenDriver} />
            <EobOpenText label="BIGGEST REASON YOU SKIPPED A DAY?" value={skipReason} onChange={setSkipReason} placeholder="Honest answer." />
            <EobChipRow label="DID THE LEADERBOARD AFFECT YOUR BEHAVIOR?" options={['Yes — kept me coming back', 'Yes — made me feel behind', 'No effect', 'I ignored it']} value={leaderboardEffect} onChange={setLeaderboardEffect} />

            <EobSection title="PRODUCT AND UX" />
            <EobOpenText label="ONE THING THAT NEEDS TO CHANGE BEFORE PUBLIC LAUNCH?" value={mustChange} onChange={setMustChange} placeholder="Non-negotiable." />
            <EobOpenText label="ONE THING YOU'D FIGHT TO KEEP EXACTLY AS IT IS?" value={mustKeep} onChange={setMustKeep} placeholder="Don't lose this." />
            <EobOpenText label="ANYTHING EVER FEEL BROKEN, CONFUSING, OR OUT OF PLACE?" value={brokenThing} onChange={setBrokenThing} placeholder="Optional but valuable." />
            <EobChipRow label="MOBILE OR DESKTOP — WHICH FELT BETTER?" options={['Mobile', 'Desktop', 'Equal', 'I only used one']} value={devicePref} onChange={setDevicePref} />

            <EobSection title="POSITIONING AND NAME" />
            <EobChipRow label="ONE PERCENT — DOES THE NAME WORK FOR PUBLIC LAUNCH?" options={["Yes it's strong", "It's fine", 'No — needs work', 'I have a suggestion']} value={nameVerdict} onChange={setNameVerdict} />
            {nameVerdict === 'I have a suggestion' && <EobOpenText value={nameSuggestion} onChange={setNameSuggestion} placeholder="What would you call it?" />}
            <EobOpenText label="HOW WOULD YOU PITCH THIS TO SOMEONE WHO'S NEVER HEARD OF IT?" value={publicPitch} onChange={setPublicPitch} placeholder="How you'd actually say it." />
            <EobOpenText label="WHAT KIND OF PERSON IS THIS NOT FOR?" value={notFor} onChange={setNotFor} placeholder="Be direct." />

            <EobSection title="GTM SIGNAL" />
            <EobChipRow label="WOULD YOU PAY FOR THIS?" options={['Yes', 'No', 'Depends on the price']} value={wouldPay} onChange={setWouldPay} />
            {wouldPay === 'Yes' && <EobChipRow label="WHAT MONTHLY PRICE FEELS FAIR?" options={['Under $5', '$5-10', '$10-20', '$20+']} value={priceRange} onChange={setPriceRange} />}
            <EobChipRow label="WOULD YOU REFER THIS TO SOMEONE SPECIFIC?" options={['Yes — who and why', 'No', 'Maybe']} value={wouldRefer} onChange={setWouldRefer} />
            {wouldRefer === 'Yes — who and why' && <EobOpenText value={referDetail} onChange={setReferDetail} placeholder="Who and why?" />}
            <EobChipRow label="WHICH LAUNCH MODEL WOULD MAKE YOU MOST LIKELY TO SHARE IT?" options={['Free with premium tier', 'One-time purchase', 'Subscription', 'Free forever', "Doesn't matter"]} value={launchModel} onChange={setLaunchModel} />
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: '#666', letterSpacing: '0.1em', marginBottom: 8, fontWeight: 600 }}>HOW LIKELY ARE YOU TO STILL BE USING THIS IN 6 MONTHS? (1-10)</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <button key={n} onClick={() => setSixMonth(n)} style={{
                    flex: 1, padding: '8px 0', borderRadius: 3,
                    border: '1px solid ' + (sixMonth >= n ? EOB_ACCENT : '#222'),
                    background: sixMonth >= n ? EOB_ACCENT + '22' : '#111',
                    color: sixMonth >= n ? EOB_ACCENT : '#555',
                    fontSize: 11, cursor: 'pointer', fontFamily: "'Inter',sans-serif",
                  }}>{n}</button>
                ))}
              </div>
            </div>
            <EobOpenText label="WHAT WOULD HAVE TO BE TRUE FOR YOUR ANSWER TO BE A 10?" value={toTen} onChange={setToTen} placeholder="Specific is better." />

            <EobSection title="FINAL WORD" />
            <EobOpenText label="BIGGEST PERSONAL WIN FROM THE BETA" value={biggestWin} onChange={setBiggestWin} placeholder="Something you learned, used, or now think differently about." minHeight={80} />
            <EobOpenText label="IF YOU WERE ME, WHAT WOULD YOU DO NEXT?" value={ifYouWereMe} onChange={setIfYouWereMe} placeholder="Don't hold back." minHeight={80} />
            <EobOpenText label="ANYTHING ELSE." value={anythingElse} onChange={setAnythingElse} placeholder="Optional." />

            <button onClick={submit} disabled={!coreReady || submitting} style={{
              width: '100%', padding: '14px 0', marginTop: 8,
              background: coreReady ? EOB_ACCENT : '#1a1a1a', border: 'none', borderRadius: 4,
              fontSize: 11, fontWeight: 600, color: coreReady ? '#fff' : '#333',
              cursor: coreReady ? 'pointer' : 'not-allowed', letterSpacing: '0.1em',
              fontFamily: "'Inter',sans-serif", opacity: submitting ? 0.6 : 1,
            }}>
              {submitting ? 'SUBMITTING...' : 'SUBMIT FINAL SURVEY'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function WeeklySurveyModal({ userId, weekNumber, onClose }) {
  const [entriesCompleted, setEntriesCompleted] = useState(null)
  const [timeOfDay, setTimeOfDay] = useState(null)
  const [device, setDevice] = useState(null)
  const [clarityRating, setClarityRating] = useState(0)
  const [relevanceRating, setRelevanceRating] = useState(0)
  const [quizRating, setQuizRating] = useState(0)
  const [mostUsefulCat, setMostUsefulCat] = useState(null)
  const [leastRelevantCat, setLeastRelevantCat] = useState(null)
  const [topicsWanted, setTopicsWanted] = useState('')
  const [appliedLearning, setAppliedLearning] = useState(null)
  const [appliedDetail, setAppliedDetail] = useState('')
  const [frictionFreq, setFrictionFreq] = useState(null)
  const [frictionDetail, setFrictionDetail] = useState('')
  const [leaderboard, setLeaderboard] = useState(null)
  const [emailReceived, setEmailReceived] = useState(null)
  const [nameResonate, setNameResonate] = useState(null)
  const [nameSuggestion, setNameSuggestion] = useState('')
  const [pitch, setPitch] = useState('')
  const [whoNeedsIt, setWhoNeedsIt] = useState('')
  const [wouldContinue, setWouldContinue] = useState(null)
  const [openMore, setOpenMore] = useState('')
  const [anythingElse, setAnythingElse] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const coreReady = entriesCompleted && timeOfDay && device && clarityRating && relevanceRating && quizRating && mostUsefulCat && appliedLearning && frictionFreq && wouldContinue

  const submit = async () => {
    if (!coreReady) return
    setSubmitting(true)
    const parts = [
      entriesCompleted && ('entries:' + entriesCompleted),
      timeOfDay && ('time:' + timeOfDay),
      device && ('device:' + device),
      mostUsefulCat && ('most_useful:' + mostUsefulCat),
      leastRelevantCat && ('least_relevant:' + leastRelevantCat),
      topicsWanted && ('topics_wanted:' + topicsWanted),
      appliedLearning && ('applied:' + appliedLearning),
      appliedDetail && ('applied_detail:' + appliedDetail),
      frictionFreq && ('friction:' + frictionFreq),
      frictionDetail && ('friction_detail:' + frictionDetail),
      leaderboard && ('leaderboard:' + leaderboard),
      emailReceived && ('email:' + emailReceived),
      nameResonate && ('name:' + nameResonate),
      nameSuggestion && ('name_suggestion:' + nameSuggestion),
      pitch && ('pitch:' + pitch),
      whoNeedsIt && ('who_needs_it:' + whoNeedsIt),
      openMore && ('open_more:' + openMore),
    ].filter(Boolean)
    await supabase.from('feedback').insert({
      user_id: userId,
      feedback_type: 'weekly',
      clarity_rating: clarityRating,
      topic_rating: relevanceRating,
      quiz_rating: quizRating,
      would_recommend: wouldContinue,
      missing_topics: parts.join(' | '),
      biggest_win: anythingElse || null,
    })
    // Mark survey taken for this week
    const dayNumber = weekNumber * 7
    await supabase.from('profiles').update({ last_weekly_survey_day: dayNumber }).eq('id', userId)
    setSubmitting(false)
    setDone(true)
    setTimeout(onClose, 2000)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 1000, overflowY: 'auto', padding: '24px 16px' }}>
      <div style={{ background: '#111', border: '1px solid #222', borderRadius: 10, padding: 28, maxWidth: 480, width: '100%', marginTop: 'auto', marginBottom: 'auto' }}>
        {done ? (
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>✓</div>
            <div style={{ fontSize: 13, color: '#47FFE8', letterSpacing: '0.08em' }}>CHECK-IN LOGGED. THANKS.</div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 9, color: '#47FFE8', letterSpacing: '0.2em', fontWeight: 700, marginBottom: 6 }}>WEEK {weekNumber} CHECK-IN</div>
                <div style={{ fontSize: 18, color: '#fff', fontWeight: 700, marginBottom: 4 }}>How's it landing?</div>
                <div style={{ fontSize: 12, color: '#555', lineHeight: 1.5 }}>Don't be nice — be useful. This shapes what's next.</div>
              </div>

            </div>

            <WkSection title="USAGE" />
            <WkChipRow label="HOW MANY ENTRIES DID YOU COMPLETE THIS WEEK?" options={['0', '1-2', '3-4', '5+']} value={entriesCompleted} onChange={setEntriesCompleted} />
            <WkChipRow label="WHEN DO YOU USUALLY OPEN THE APP?" options={['Morning', 'Midday', 'Evening', 'No pattern']} value={timeOfDay} onChange={setTimeOfDay} />
            <WkChipRow label="PRIMARY DEVICE?" options={['Phone', 'Desktop', 'Both equally']} value={device} onChange={setDevice} />

            <WkSection title="CONTENT" />
            <WkRatingRow label="CLARITY" question="How clear is the content?" value={clarityRating} onChange={setClarityRating} />
            <WkRatingRow label="RELEVANCE" question="How useful to your actual work?" value={relevanceRating} onChange={setRelevanceRating} />
            <WkRatingRow label="QUIZ QUALITY" question="Is it testing the right things?" value={quizRating} onChange={setQuizRating} />
            <WkChipRow label="MOST USEFUL CATEGORY?" options={SURVEY_CATS} value={mostUsefulCat} onChange={setMostUsefulCat} />
            <WkChipRow label="LEAST RELEVANT TO YOU?" options={[...SURVEY_CATS, 'Too early to say']} value={leastRelevantCat} onChange={setLeastRelevantCat} />
            <WkOpenText label="WHAT TOPICS DO YOU WANT TO SEE NEXT?" value={topicsWanted} onChange={setTopicsWanted} placeholder="No topic too niche." />
            <WkChipRow label="HAS ANYTHING YOU LEARNED COME UP IN YOUR ACTUAL WORK THIS WEEK?" options={['Yes - tell us', 'Not yet', "Doesn't apply"]} value={appliedLearning} onChange={setAppliedLearning} />
            {appliedLearning === 'Yes - tell us' && <WkOpenText value={appliedDetail} onChange={setAppliedDetail} placeholder="What happened?" />}

            <WkSection title="EXPERIENCE" />
            <WkChipRow label="HOW OFTEN DID YOU HIT FRICTION?" options={['Never', 'Once', 'A few times', 'Often']} value={frictionFreq} onChange={setFrictionFreq} />
            {frictionFreq && frictionFreq !== 'Never' && <WkOpenText value={frictionDetail} onChange={setFrictionDetail} placeholder="Describe it." />}
            <WkChipRow label="THE LEADERBOARD?" options={['Motivates me', 'Irrelevant', 'Creates pressure', "Haven't noticed it"]} value={leaderboard} onChange={setLeaderboard} />
            <WkChipRow label="DID THE DAILY REMINDER EMAIL REACH YOU?" options={['Yes', 'No', "Haven't seen one"]} value={emailReceived} onChange={setEmailReceived} />

            <WkSection title="POSITIONING" />
            <WkChipRow label='"ONE PERCENT" — DOES THE NAME RESONATE?' options={['Yes it clicks', "It's fine", 'Not really', 'I have a better idea']} value={nameResonate} onChange={setNameResonate} />
            {nameResonate === 'I have a better idea' && <WkOpenText value={nameSuggestion} onChange={setNameSuggestion} placeholder="What would you call it?" />}
            <WkOpenText label="HOW WOULD YOU DESCRIBE THIS APP TO A COLLEAGUE IN ONE SENTENCE?" value={pitch} onChange={setPitch} placeholder="Be natural." />
            <WkOpenText label="WHO SPECIFICALLY COMES TO MIND — WHO NEEDS THIS?" value={whoNeedsIt} onChange={setWhoNeedsIt} placeholder="Name, role, or type." />

            <WkSection title="SIGNAL" />
            <WkChipRow label="WOULD YOU KEEP USING THIS AFTER THE BETA?" options={['Definitely', 'Probably', 'Not sure', 'Probably not']} value={wouldContinue} onChange={setWouldContinue} />
            <WkOpenText label="WHAT WOULD MAKE YOU OPEN THE APP MORE CONSISTENTLY?" value={openMore} onChange={setOpenMore} placeholder="Be specific." />
            <WkOpenText label="ANYTHING ELSE?" value={anythingElse} onChange={setAnythingElse} placeholder="Optional." />

            <div style={{ marginTop: 8 }}>
              <button onClick={submit} disabled={!coreReady || submitting} style={{
                width: '100%', padding: '12px 0', background: coreReady ? '#47FFE8' : '#1a1a1a',
                border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 600,
                color: '#0a0a0a', cursor: coreReady ? 'pointer' : 'not-allowed',
                letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif", opacity: submitting ? 0.6 : 1,
              }}>
                {submitting ? 'SUBMITTING...' : 'SUBMIT CHECK-IN'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}


function HowItWorksModal({ onClose }) {
  const [step, setStep] = useState(0)
  const [animate, setAnimate] = useState(true)

  const current = HOW_IT_WORKS[step]
  const isLast = step === HOW_IT_WORKS.length - 1
  const isFirst = step === 0
  const progress = (step / (HOW_IT_WORKS.length - 1)) * 100

  const go = (dir) => {
    setAnimate(false)
    setTimeout(() => {
      setStep(s => s + dir)
      setAnimate(true)
    }, 160)
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'linear-gradient(160deg, #f0f4f8 0%, #e8eef5 50%, #dde6f0 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '24px', overflow: 'hidden',
        fontFamily: "'DM Mono', 'Courier New', monospace",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
        .hiw-card { opacity: 0; transform: translateY(14px); transition: opacity 0.28s ease, transform 0.28s ease; }
        .hiw-card.visible { opacity: 1; transform: translateY(0); }
        .hiw-btn { background: #1a2a3a; color: #e8eef5; border: none; border-radius: 4px; padding: 14px 24px; font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 500; letter-spacing: 0.12em; cursor: pointer; transition: background 0.15s, transform 0.1s; }
        .hiw-btn:hover { background: #243548; transform: translateY(-1px); }
        .hiw-btn:active { transform: translateY(0); }
        .hiw-btn-ghost { background: none; border: 1px solid rgba(26,42,58,0.15); color: rgba(26,42,58,0.45); border-radius: 4px; padding: 14px 24px; font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.12em; cursor: pointer; transition: border-color 0.15s, color 0.15s; }
        .hiw-btn-ghost:hover { border-color: rgba(26,42,58,0.3); color: rgba(26,42,58,0.65); }
        .noise-hiw { position: fixed; inset: 0; pointer-events: none; opacity: 0.025; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); background-size: 200px 200px; }
      `}</style>

      <div className="noise-hiw" />
      <div style={{ position: 'fixed', top: '-15%', right: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(147,197,235,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-10%', left: '-5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(180,210,240,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Progress bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, background: 'rgba(26,42,58,0.08)' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'rgba(26,42,58,0.3)', transition: 'width 0.4s ease' }} />
      </div>

      {/* Top bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.25em', color: 'rgba(26,42,58,0.4)', fontWeight: 500 }}>HOW IT WORKS</div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 16, color: 'rgba(26,42,58,0.35)', cursor: 'pointer', padding: 4, lineHeight: 1 }}>✕</button>
      </div>

      {/* Step dots */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 40 }} onClick={e => e.stopPropagation()}>
        {HOW_IT_WORKS.map((_, i) => (
          <div
            key={i}
            onClick={() => { setAnimate(false); setTimeout(() => { setStep(i); setAnimate(true) }, 160) }}
            style={{
              width: i === step ? 20 : 6, height: 6, borderRadius: 3,
              background: i <= step ? 'rgba(26,42,58,0.5)' : 'rgba(26,42,58,0.12)',
              transition: 'all 0.3s ease', cursor: 'pointer',
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div className={`hiw-card${animate ? ' visible' : ''}`} style={{ width: '100%', maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(26,42,58,0.4)', fontWeight: 500, marginBottom: 14 }}>
          {current.eyebrow}
        </div>
        <div style={{ fontSize: 26, fontWeight: 400, color: '#1a2a3a', lineHeight: 1.25, marginBottom: 20, fontFamily: "'DM Sans', sans-serif", letterSpacing: '-0.02em' }}>
          {current.heading}
        </div>
        <div style={{ marginBottom: 36 }}>
          {current.body.split('\n\n').map((para, i, arr) => (
            <p key={i} style={{ fontSize: 14, color: 'rgba(26,42,58,0.65)', lineHeight: 1.8, marginBottom: i < arr.length - 1 ? 14 : 0, fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
              {para}
            </p>
          ))}
        </div>

        {/* Nav buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          {!isFirst && (
            <button className="hiw-btn-ghost" onClick={() => go(-1)} style={{ flex: 1 }}>← BACK</button>
          )}
          {!isLast ? (
            <button className="hiw-btn" onClick={() => go(1)} style={{ flex: isFirst ? 1 : 2 }}>NEXT →</button>
          ) : (
            <button className="hiw-btn" onClick={onClose} style={{ flex: isFirst ? 1 : 2 }}>DONE →</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [completions, setCompletions] = useState({})
  const [loading, setLoading] = useState(true)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showBug, setShowBug] = useState(false)
  const [showHowItWorks, setShowHowItWorks] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [welcomeFading, setWelcomeFading] = useState(false)
  const [filter, setFilter] = useState('All')
  const [signingOut, setSigningOut] = useState(false)
  const [showWhatsNew, setShowWhatsNew] = useState(false)
  const [whatsNewEntry, setWhatsNewEntry] = useState(null)
  const [hasUnseenChangelog, setHasUnseenChangelog] = useState(false)
  const [showWeeklySurvey, setShowWeeklySurvey] = useState(false)
  const [showEndOfBeta, setShowEndOfBeta] = useState(false)
  const [weeklyWeekNumber, setWeeklyWeekNumber] = useState(1)
  const libraryRef = useRef(null)

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      setUser(session.user)

      let { data: prof, error: profError } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
      console.log('[library] profile fetch:', prof, profError)
      if (profError) {
        console.error('Profile fetch error:', profError)
        setLoading(false)
        return
      }
      if (!prof) {
        const { data: newProf, error: insertError } = await supabase.from('profiles').insert({ id: session.user.id, email: session.user.email, signup_date: new Date().toISOString() }).select().maybeSingle()
        if (insertError) {
          console.error('Profile insert error:', insertError)
          setLoading(false)
          return
        }
        prof = newProf
      }

      // New users go through onboarding first
      if (!prof?.onboarding_complete) {
        router.push('/onboarding')
        return
      }

      setProfile(prof)

      const { data: comps } = await supabase.from('completions').select('entry_number, score, time_to_quiz').eq('user_id', session.user.id)
      const compMap = {}
      if (comps) comps.forEach(c => { compMap[c.entry_number] = c })
      setCompletions(compMap)

      // Check for unseen changelog entries
      const { data: latestChangelog } = await supabase
        .from('changelog')
        .select('version, title, description, show_modal')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (latestChangelog && latestChangelog.version !== prof.last_seen_changelog_version) {
        setHasUnseenChangelog(true)
        if (latestChangelog.show_modal) {
          setWhatsNewEntry(latestChangelog)
          setShowWhatsNew(true)
        }
      }

      // Weekly survey trigger: fires at day 7, 14, 21 (skip 28, handled by end-of-beta)
      if (prof?.signup_date) {
        const daysSince = Math.floor((Date.now() - new Date(prof.signup_date).getTime()) / 86400000)
        const lastSurveyDay = prof.last_weekly_survey_day || 0
        const SURVEY_DAYS = [7, 14, 21]
        for (const d of SURVEY_DAYS) {
          if (daysSince >= d && lastSurveyDay < d) {
            const weekNum = d / 7
            setWeeklyWeekNumber(weekNum)
            setTimeout(() => setShowWeeklySurvey(true), 2000)
            break
          }
        }
      }

      // End-of-beta trigger: fires once when all entries are completed
      if (!prof?.end_of_beta_survey_done) {
        const { data: completionRows } = await supabase.from('completions').select('entry_number').eq('user_id', session.user.id)
        if (completionRows && completionRows.length >= TOTAL_ENTRIES) {
          setTimeout(() => setShowEndOfBeta(true), 2000)
        }
      }
      setLoading(false)
      if (!sessionStorage.getItem('welcomed')) {
        sessionStorage.setItem('welcomed', '1')
        setShowWelcome(true)
        setTimeout(() => setWelcomeFading(true), 6000)
        setTimeout(() => setShowWelcome(false), 6700)
      }
    }
    init()
  }, [router])

  const handleSignOut = async () => {
    setSigningOut(true)
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const markChangelogSeen = async () => {
    if (!profile || !hasUnseenChangelog) return
    const { data: latest } = await supabase
      .from('changelog')
      .select('version')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (latest) {
      await supabase.from('profiles').update({ last_seen_changelog_version: latest.version }).eq('id', profile.id)
      setHasUnseenChangelog(false)
    }
  }

  const dismissWhatsNew = async () => {
    setShowWhatsNew(false)
    await markChangelogSeen()
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <ThinkingDots />
    </div>
  )

  const isAdmin = profile?.is_admin || false
  const unlockedCount = profile ? getUnlockedCount(profile.signup_date, isAdmin, TOTAL_ENTRIES) : 0
  const completedCount = Object.keys(completions).length
  const totalScore = Object.values(completions).reduce((a, c) => a + (c.score || 0), 0)
  const avgScore = completedCount > 0 ? (totalScore / completedCount).toFixed(1) : '—'
  const streak = profile?.current_streak || 0

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Inter',sans-serif", color: '#fff' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap'); *{box-sizing:border-box;margin:0;padding:0;}`}</style>

      {showEndOfBeta && <EndOfBetaModal userId={user?.id} onClose={() => setShowEndOfBeta(false)} />}
      {showWeeklySurvey && <WeeklySurveyModal userId={user?.id} weekNumber={weeklyWeekNumber} onClose={async () => { setShowWeeklySurvey(false); await supabase.from('profiles').update({ last_weekly_survey_day: weeklyWeekNumber * 7 }).eq('id', user.id) }} />}
      {showFeedback && <FeedbackModal userId={user?.id} onClose={() => setShowFeedback(false)} />}
      {showBug && <BugModal userId={user?.id} onClose={() => setShowBug(false)} />}
      {showHowItWorks && <HowItWorksModal onClose={() => setShowHowItWorks(false)} />}
      {showWhatsNew && whatsNewEntry && <WhatsNewModal entry={whatsNewEntry} onDismiss={dismissWhatsNew} />}

      {/* Welcome overlay */}
      {showWelcome && (() => {
        const { line } = getDailyGreeting(profile?.name)
        const firstName = profile?.first_name || (profile?.name ? profile.name.split(' ')[0] : 'there')
        const fullText = `Welcome back, ${firstName}.`
        return (
          <WelcomeOverlay
            fullText={fullText}
            line={line}
            fading={welcomeFading}
            onDismiss={() => { setWelcomeFading(true); setTimeout(() => setShowWelcome(false), 500) }}
          />
        )
      })()}

      {/* Header */}
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* Row 1 — wordmark */}
        <div style={{ padding: '20px 24px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, letterSpacing: '0.22em', fontWeight: 600, color: '#0a0a0a' }}>ONE PERCENT</span>
            <span style={{ fontSize: 9, background: '#1a1a1a', color: '#E8FF47', border: '1px solid #E8FF4766', borderRadius: 3, padding: '2px 7px', letterSpacing: '0.1em', fontWeight: 600 }}>BETA</span>
            {isAdmin && (
              <span style={{ fontSize: 9, background: '#1a1a1a', color: '#47FFE8', border: '1px solid #47FFE866', borderRadius: 3, padding: '2px 7px', letterSpacing: '0.1em', fontWeight: 600 }}>ADMIN</span>
            )}
          </div>
          {/* Profile avatar */}
          <button
            onClick={() => router.push('/profile')}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: '#1a1a1a', border: '1px solid #333',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 14, color: '#999',
              padding: 0, overflow: 'hidden', flexShrink: 0,
            }}
          >
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <User size={16} strokeWidth={1.5} color='#555' />
            }
          </button>
        </div>

        {/* Row 2 — action bar, scrollable */}
        <style>{`.action-bar::-webkit-scrollbar { display: none; }`}</style>
        <div style={{ padding: '0 24px 10px' }}>
          <div className="action-bar" style={{
            background: '#1e1e1e', borderRadius: 8, padding: '4px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0,
            overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
          }}>
            <div style={{ display: 'flex', gap: 0 }}>
              <button onClick={() => router.push('/about')} style={{ background: 'transparent', border: 'none', borderRadius: 6, padding: '7px 12px', fontSize: 9, color: '#bbb', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap', flexShrink: 0, fontWeight: 400, opacity: 0.85, transition: 'opacity 0.15s ease' }}>ABOUT</button>
              <button onClick={() => { router.push('/changelog'); markChangelogSeen() }} style={{ background: 'transparent', border: 'none', borderRadius: 6, padding: '7px 12px', fontSize: 9, color: hasUnseenChangelog ? '#E8FF47' : '#bbb', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap', flexShrink: 0, fontWeight: hasUnseenChangelog ? 600 : 400, opacity: 0.85, transition: 'opacity 0.15s ease', position: 'relative' }}>
                CHANGELOG
                {hasUnseenChangelog && <span style={{ position: 'absolute', top: 4, right: 4, width: 5, height: 5, borderRadius: '50%', background: '#E8FF47', display: 'block' }} />}
              </button>
              <button onClick={() => setShowBug(true)} style={{ background: 'transparent', border: 'none', borderRadius: 6, padding: '7px 12px', fontSize: 9, color: '#FF4778', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap', flexShrink: 0, fontWeight: 600, opacity: 0.85, transition: 'opacity 0.15s ease' }}>BUG</button>
              <button onClick={() => setShowFeedback(true)} style={{ background: 'transparent', border: 'none', borderRadius: 6, padding: '7px 12px', fontSize: 9, color: '#bbb', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap', flexShrink: 0, fontWeight: 400, opacity: 0.85, transition: 'opacity 0.15s ease' }}>FEEDBACK</button>
              <button onClick={() => setShowHowItWorks(true)} style={{ background: 'transparent', border: 'none', borderRadius: 6, padding: '7px 12px', fontSize: 9, color: '#bbb', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap', flexShrink: 0, fontWeight: 400, opacity: 0.85, transition: 'opacity 0.15s ease' }}>INFO</button>
              {isAdmin && (
                <button onClick={() => router.push('/admin')} style={{ background: 'transparent', border: 'none', borderRadius: 6, padding: '7px 12px', fontSize: 9, color: '#47FFE8', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap', flexShrink: 0, fontWeight: 600, opacity: 0.85, transition: 'opacity 0.15s ease' }}>ADMIN →</button>
              )}
            </div>
            {/* Sign out pushed to right */}
            <button onClick={handleSignOut} disabled={signingOut} style={{ background: 'transparent', border: 'none', borderRadius: 6, padding: '7px 12px', fontSize: 9, color: '#bbb', cursor: signingOut ? 'default' : 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap', flexShrink: 0, fontWeight: 400, opacity: signingOut ? 0.4 : 0.85, transition: 'opacity 0.15s ease' }}>{signingOut ? 'SIGNING OUT...' : 'SIGN OUT'}</button>
          </div>
        </div>

      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '12px 24px 80px' }}>

        {/* Analytics label */}
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em', marginBottom: 3 }}>
              {profile?.name ? `${profile.name}'s Analytics` : 'Your Analytics'}
            </div>
            <div style={{ fontSize: 10, color: '#0a0a0a', letterSpacing: '0.1em' }}>
              THE DATA DOESN'T LIE
            </div>
          </div>
          <button
            onClick={() => router.push('/leaderboard')}
            style={{
              background: '#1e1e1e', border: 'none', borderRadius: 6,
              padding: '8px 14px', fontSize: 9, color: '#E8FF47',
              cursor: 'pointer', letterSpacing: '0.1em',
              fontFamily: "'Inter',sans-serif", fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6,
              flexShrink: 0,
            }}
          >
            🏆 LEADERBOARD
          </button>
        </div>

        {/* Stats bar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 32 }}>
          {[
            { label: 'STREAK', value: streak > 0 ? `${streak} day${streak !== 1 ? 's' : ''}` : '—' },
            { label: 'COMPLETED', value: `${completedCount}/${unlockedCount}` },
            { label: 'AVG SCORE', value: avgScore !== '—' ? `${avgScore}/3` : '—' },
            { label: 'UNLOCKED', value: `${unlockedCount}` },
          ].map(s => (
            <div key={s.label} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 4, padding: '14px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 500, color: '#fff', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 9, color: '#fff', letterSpacing: '0.12em', opacity: 0.6 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Entry list */}
        <div style={{ fontSize: 10, color: '#0a0a0a', letterSpacing: '0.15em', marginBottom: 12, fontWeight: 600 }}>YOUR LIBRARY</div>
        
        {/* Category filter tabs */}
        <style>{`.filter-tabs::-webkit-scrollbar { display: none; }`}</style>
        <div style={{ background: '#1e1e1e', borderRadius: 8, padding: '4px', marginBottom: 16 }}>
          <div className="filter-tabs" style={{ display: 'flex', gap: 0, overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
            {['All', 'Unlocked', 'Completed', 'Sales Craft', 'AI', 'Vocab & Language', 'Mental Models', 'Philosophy', 'Neuroscience & Cognition', 'Communication'].map(cat => {
              const isSelected = filter === cat
              const categoryColor = CATEGORY_COLORS[cat]
              const isSystemTab = ['All', 'Unlocked', 'Completed'].includes(cat)
              const activeColor = isSystemTab ? '#fff' : categoryColor
              const restColor = isSystemTab ? '#bbb' : categoryColor


              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  style={{
                    background: isSelected ? 'rgba(255,255,255,0.07)' : 'transparent',
                    color: isSelected ? activeColor : restColor,
                    border: 'none',
                    outline: 'none',
                    borderRadius: 6,
                    padding: '7px 12px',
                    fontSize: 9,
                    fontWeight: isSelected ? 700 : 400,
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    fontFamily: "'Inter',sans-serif",
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    opacity: isSelected ? 1 : 0.9,
                    transition: 'background 0.15s ease, color 0.15s ease, opacity 0.15s ease',
                  }}
                >
                  {cat.toUpperCase()}
                </button>
              )
            })}
          </div>
        </div>

        <div ref={libraryRef} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ENTRIES
            .filter((e, idx) => {
              const entryNum = idx + 1
              const unlocked = entryNum <= unlockedCount
              const completed = !!completions[e.entry]
              
              if (filter === 'All') return true
              if (filter === 'Unlocked') return unlocked
              if (filter === 'Completed') return completed
              return e.category === filter
            })
            .map((e, idx) => {
            const entryNum = idx + 1
            const unlocked = entryNum <= unlockedCount
            const completed = !!completions[e.entry]
            const accent = CATEGORY_COLORS[e.category] || '#fff'
            const comp = completions[e.entry]

            return (
              <div
                key={e.entry}
                onClick={() => unlocked && router.push(`/entry/${e.entry}`)}
                style={{
                  background: '#111', border: `1px solid ${unlocked ? '#1a1a1a' : '#111'}`,
                  borderRadius: 4, padding: '16px 18px', cursor: unlocked ? 'pointer' : 'default',
                  opacity: unlocked ? 1 : 0.35, transition: 'border-color 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: completed ? accent : '#333', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 14, color: unlocked ? '#fff' : '#555', fontWeight: 500, marginBottom: 2 }}>{e.concept}</div>
                    <div style={{ fontSize: 10, color: accent, letterSpacing: '0.08em', opacity: 0.8 }}>{e.editionId} · {e.category}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                  {completed && <span style={{ fontSize: 11, color: accent, fontWeight: 600 }}>{comp.score}/3</span>}
                  {!unlocked && <span style={{ fontSize: 10, color: '#333' }}>🔒</span>}
                  {unlocked && !completed && <span style={{ fontSize: 10, color: accent, letterSpacing: '0.08em' }}>START →</span>}
                  {completed && <span style={{ fontSize: 10, color: '#888', letterSpacing: '0.08em' }}>REVIEW →</span>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
