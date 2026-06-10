'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Paperclip, User, Trophy } from 'lucide-react'
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
  { entry: '026', editionId: 'SC.3.2', concept: 'Mirroring', category: 'Sales Craft' },
  { entry: '027', editionId: 'AI.3.2', concept: 'AI Agents', category: 'AI' },
  { entry: '028', editionId: 'VL.4', concept: 'Loaded Language', category: 'Vocab & Language' },
  { entry: '029', editionId: 'SC.4.1', concept: 'Labeling', category: 'Sales Craft' },
  { entry: '030', editionId: 'MM.4', concept: 'Confirmation Bias', category: 'Mental Models' },
  { entry: '031', editionId: 'NC.4', concept: 'Spaced Repetition', category: 'Neuroscience & Cognition' },
  { entry: '032', editionId: 'CM.4', concept: 'The BLUF Principle', category: 'Communication' },
  { entry: '033', editionId: 'PH.4', concept: 'Memento Mori', category: 'Philosophy' },
  { entry: '034', editionId: 'SC.3', concept: 'Calibrated Questions', category: 'Sales Craft' },
  { entry: '035', editionId: 'AI.4.1', concept: 'System Prompts', category: 'AI' },
  { entry: '036', editionId: 'VL.4.1', concept: 'The Overton Window', category: 'Vocab & Language' },
  { entry: '037', editionId: 'SC.5', concept: 'The Accusation Audit', category: 'Sales Craft' },
  { entry: '038', editionId: 'MM.5', concept: 'First Principles Thinking', category: 'Mental Models' },
  { entry: '039', editionId: 'AI.4.2', concept: 'Temperature & Sampling', category: 'AI' },
  { entry: '040', editionId: 'PH.5', concept: 'Epistemic Humility', category: 'Philosophy' },
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
              <option>Entry — Concept</option>
              <option>Entry — In the Wild</option>
              <option>Entry — Lock It In</option>
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
    body: "Full access to everything — every category, every entry, unlocked one per day for 30 days.\n\nEach entry has three parts: the Concept to understand it, In the Wild to see it in action, and Lock It In to test yourself.",
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
            <EobChipRow label="WAS THE CONCEPT / IN THE WILD / LOCK IT IN STRUCTURE RIGHT?" options={['Yes — keep it', 'Needs tweaks', 'Rethink it']} value={structureVerdict} onChange={setStructureVerdict} />
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
  const [signingOut, setSigningOut] = useState(false)
  const [showWhatsNew, setShowWhatsNew] = useState(false)
  const [whatsNewEntry, setWhatsNewEntry] = useState(null)
  const [hasUnseenChangelog, setHasUnseenChangelog] = useState(false)
  const [showWeeklySurvey, setShowWeeklySurvey] = useState(false)
  const [showEndOfBeta, setShowEndOfBeta] = useState(false)
  const [weeklyWeekNumber, setWeeklyWeekNumber] = useState(1)
  const [bookmarks, setBookmarks] = useState({})
  const [activeTab, setActiveTab] = useState('today')
  const [libFilter, setLibFilter] = useState('ALL')
  const [showGoalSheet, setShowGoalSheet] = useState(false)
  const [goalWhat, setGoalWhat] = useState('')
  const [goalWhen, setGoalWhen] = useState('')
  const [goalProof, setGoalProof] = useState('')
  const [goalStep, setGoalStep] = useState(1)
  const [goalWhatInput, setGoalWhatInput] = useState('')
  const [goalWhenInput, setGoalWhenInput] = useState('')
  const [goalProofInput, setGoalProofInput] = useState('')
  const [showCommitRitual, setShowCommitRitual] = useState(false)
  const [ritualText, setRitualText] = useState('')
  const [ritualTyped, setRitualTyped] = useState('')
  const [ritualPhase, setRitualPhase] = useState('typing') // typing | sig | folding | done
  const [leaderboardRank, setLeaderboardRank] = useState(null)
  const [allUserCompletions, setAllUserCompletions] = useState(0)

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      setUser(session.user)

      let { data: prof, error: profError } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
      if (profError) { setLoading(false); return }
      if (!prof) {
        const { data: newProf, error: insertError } = await supabase.from('profiles').insert({ id: session.user.id, email: session.user.email, signup_date: new Date().toISOString() }).select().maybeSingle()
        if (insertError) { setLoading(false); return }
        prof = newProf
      }
      if (!prof?.onboarding_complete) { router.push('/onboarding'); return }

      setProfile(prof)
      if (prof.goal_what) setGoalWhat(prof.goal_what)
      if (prof.goal_when) setGoalWhen(prof.goal_when)
      if (prof.goal_proof) setGoalProof(prof.goal_proof)

      const { data: comps } = await supabase.from('completions').select('entry_number, score, time_to_quiz').eq('user_id', session.user.id)
      const compMap = {}
      if (comps) comps.forEach(c => { compMap[c.entry_number] = c })
      setCompletions(compMap)

      const { data: bmarks } = await supabase.from('bookmarks').select('id, entry_number').eq('user_id', session.user.id)
      const bmarkMap = {}
      if (bmarks) bmarks.forEach(b => { bmarkMap[b.entry_number] = b.id })
      setBookmarks(bmarkMap)

      // Leaderboard rank
      if (!prof.is_admin) {
        const { data: allProfs } = await supabase.from('profiles').select('id').eq('is_admin', false)
        if (allProfs) {
          const counts = await Promise.all(allProfs.map(async p => {
            const { count } = await supabase.from('completions').select('*', { count: 'exact', head: true }).eq('user_id', p.id)
            return { id: p.id, count: count || 0 }
          }))
          counts.sort((a, b) => b.count - a.count)
          const myRank = counts.findIndex(c => c.id === session.user.id) + 1
          setLeaderboardRank(myRank)
        }
      }

      const { data: latestChangelog } = await supabase.from('changelog').select('version, title, description, show_modal').eq('published', true).order('created_at', { ascending: false }).limit(1).maybeSingle()
      if (latestChangelog && latestChangelog.version !== prof.last_seen_changelog_version) {
        setHasUnseenChangelog(true)
        if (latestChangelog.show_modal) { setWhatsNewEntry(latestChangelog); setShowWhatsNew(true) }
      }

      if (prof?.signup_date && !prof?.is_admin) {
        const { data: anyComps } = await supabase.from('completions').select('entry_number').eq('user_id', session.user.id).limit(1)
        if (anyComps && anyComps.length > 0) {
          const daysSince = Math.floor((Date.now() - new Date(prof.signup_date).getTime()) / 86400000)
          const lastSurveyDay = prof.last_weekly_survey_day || 0
          for (const d of [7, 14, 21]) {
            if (daysSince >= d && lastSurveyDay < d) {
              setWeeklyWeekNumber(d / 7)
              setTimeout(() => setShowWeeklySurvey(true), 2000)
              break
            }
          }
        }
      }

      if (!prof?.end_of_beta_survey_done) {
        const { data: completionRows } = await supabase.from('completions').select('entry_number').eq('user_id', session.user.id)
        if (completionRows && completionRows.length >= TOTAL_ENTRIES) setTimeout(() => setShowEndOfBeta(true), 2000)
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
    const { data: latest } = await supabase.from('changelog').select('version').eq('published', true).order('created_at', { ascending: false }).limit(1).maybeSingle()
    if (latest) {
      await supabase.from('profiles').update({ last_seen_changelog_version: latest.version }).eq('id', profile.id)
      setHasUnseenChangelog(false)
    }
  }

  const dismissWhatsNew = async () => { setShowWhatsNew(false); await markChangelogSeen() }

  const toggleBookmark = async (e, entryNumber) => {
    e.stopPropagation()
    if (!user) return
    const existingId = bookmarks[entryNumber]
    if (existingId) {
      setBookmarks(prev => { const next = { ...prev }; delete next[entryNumber]; return next })
      await supabase.from('bookmarks').delete().eq('id', existingId)
    } else {
      const { data } = await supabase.from('bookmarks').insert({ user_id: user.id, entry_number: entryNumber }).select('id').single()
      if (data) setBookmarks(prev => ({ ...prev, [entryNumber]: data.id }))
    }
  }

  // Goal commit
  const commitGoal = async () => {
    const what = goalWhatInput.trim()
    const when = goalWhenInput.trim()
    const proof = goalProofInput.trim()
    if (!what || !when || !proof) return
    // Build sentence
    const sentence = `I will change ${what}.\n\n${when.charAt(0).toUpperCase() + when.slice(1)}, I'll know it worked — ${proof.replace(/\.$/, '')}.`
    setRitualText(sentence)
    setRitualTyped('')
    setRitualPhase('typing')
    setShowGoalSheet(false)
    setShowCommitRitual(true)
    // Save to DB
    await supabase.from('profiles').update({ goal_what: what, goal_when: when, goal_proof: proof }).eq('id', user.id)
    setGoalWhat(what)
    setGoalWhen(when)
    setGoalProof(proof)
    // Typewriter
    let i = 0
    const type = () => {
      if (i <= sentence.length) {
        setRitualTyped(sentence.slice(0, i))
        i++
        const ch = sentence[i - 1] || ''
        let delay = 36
        if (ch === '.') delay = 300
        else if (ch === ',') delay = 160
        else if (ch === '\n') delay = 380
        else if (ch === ' ') delay = 52
        else if (ch === '—') delay = 130
        setTimeout(type, delay)
      } else {
        setRitualPhase('sig')
        setTimeout(() => {
          setRitualPhase('folding')
          setTimeout(() => setRitualPhase('done'), 1900)
        }, 3100)
      }
    }
    setTimeout(type, 900)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg,#f0f4f8 0%,#e8eef5 50%,#dde6f0 100%)' }}>
      <div style={{ display: 'flex', gap: 5 }}>
        {[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: '#1a2a3a', animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`, opacity: 0.4 }} />)}
        <style>{`@keyframes pulse{0%,80%,100%{opacity:0.2;transform:scale(0.8)}40%{opacity:1;transform:scale(1)}}`}</style>
      </div>
    </div>
  )

  const isAdmin = profile?.is_admin || false
  const unlockedCount = profile ? getUnlockedCount(profile.signup_date, isAdmin, TOTAL_ENTRIES) : 0
  const completedCount = Object.keys(completions).length
  const totalScore = Object.values(completions).reduce((a, c) => a + (c.score || 0), 0)
  const avgScore = completedCount > 0 ? (totalScore / completedCount).toFixed(1) : '—'
  const streak = profile?.current_streak || 0
  const totalTimeSeconds = Object.values(completions).reduce((a, c) => a + (c.time_to_quiz || 0), 0)
  const totalTimeMin = Math.round(totalTimeSeconds / 60)

  // Today entry and last completed
  const todayEntry = ENTRIES[unlockedCount - 1] || ENTRIES[0]
  const lastEntry = unlockedCount > 1 ? ENTRIES[unlockedCount - 2] : null
  const onDeckEntry = unlockedCount < ENTRIES.length ? ENTRIES[unlockedCount] : null
  const todayCompleted = !!completions[todayEntry?.entry]
  const todayComp = completions[todayEntry?.entry]

  // Category completion counts
  const catCounts = {}
  const catTotals = {}
  ENTRIES.forEach(e => {
    catTotals[e.category] = (catTotals[e.category] || 0) + 1
    if (completions[e.entry]) catCounts[e.category] = (catCounts[e.category] || 0) + 1
  })

  // Score trend (last 7)
  const recentScores = Object.values(completions).slice(-7).map(c => c.score || 0)

  const CAT_CONFIG = {
    'AI':                       { color: '#47FFE8', short: 'AI',        icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#47FFE8" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/><circle cx="12" cy="3" r="1.2" fill="#47FFE8" stroke="none"/><circle cx="12" cy="21" r="1.2" fill="#47FFE8" stroke="none"/><circle cx="3" cy="12" r="1.2" fill="#47FFE8" stroke="none"/><circle cx="21" cy="12" r="1.2" fill="#47FFE8" stroke="none"/></svg> },
    'Sales Craft':              { color: '#E8FF47', short: 'SALES',      icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E8FF47" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
    'Vocab & Language':         { color: '#FF8C47', short: 'VOCAB',      icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF8C47" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg> },
    'Mental Models':            { color: '#C847FF', short: 'MENTAL',     icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C847FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></svg> },
    'Philosophy':               { color: '#FF4778', short: 'PHILOSOPHY', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF4778" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/></svg> },
    'Neuroscience & Cognition': { color: '#47C8FF', short: 'NEURO',      icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#47C8FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2a2.5 2.5 0 0 1 5 0v.5"/><path d="M9 2.5C5.5 3 3 6 3 9.5c0 4 3 7 6.5 7h5c3.5 0 6.5-3 6.5-7 0-3.5-2.5-6.5-6-7"/><path d="M12 9.5v5"/><path d="M9.5 12h5"/></svg> },
    'Communication':            { color: '#FF8C00', short: 'COMM.',      icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF8C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  }
  const ALL_CATS = ['AI', 'Sales Craft', 'Vocab & Language', 'Mental Models', 'Philosophy', 'Neuroscience & Cognition', 'Communication']

  const accent = todayEntry ? (CATEGORY_COLORS[todayEntry.category] || '#47FFE8') : '#47FFE8'

  const S = {
    page: { minHeight: '100vh', background: 'linear-gradient(160deg,#f0f4f8 0%,#e8eef5 50%,#dde6f0 100%)', fontFamily: "'DM Sans', 'Inter', sans-serif", color: '#1a2a3a', maxWidth: 430, margin: '0 auto', paddingBottom: 80 },
    header: { background: 'rgba(240,244,248,0.96)', backdropFilter: 'blur(14px)', position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid rgba(26,42,58,0.07)' },
    headerTop: { padding: '14px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    wm: { fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500, letterSpacing: '0.16em', color: '#1a2a3a' },
    actionStrip: { padding: '0 20px 9px', display: 'flex', alignItems: 'center', gap: 4, overflowX: 'auto', scrollbarWidth: 'none' },
    asBtn: { fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: '0.1em', padding: '4px 9px', borderRadius: 100, border: '1px solid rgba(26,42,58,0.11)', color: 'rgba(26,42,58,0.55)', background: 'transparent', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, lineHeight: 1 },
    asBtnBug: { fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: '0.1em', padding: '4px 9px', borderRadius: 100, border: '1px solid rgba(255,71,120,0.28)', color: '#FF4778', background: 'transparent', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, lineHeight: 1 },
    sep: { width: 1, height: 12, background: 'rgba(26,42,58,0.09)', flexShrink: 0, margin: '0 1px' },
    av: { width: 30, height: 30, borderRadius: '50%', background: 'rgba(26,42,58,0.09)', border: '1px solid rgba(26,42,58,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
    screen: { padding: '18px 18px 0' },
    secLabel: { fontSize: 13, fontWeight: 600, color: '#1a2a3a', letterSpacing: '-0.01em', marginBottom: 10, marginTop: 2 },
    // nav
    bottomNav: { position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: 'rgba(240,244,248,0.96)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(26,42,58,0.08)', display: 'flex', zIndex: 100 },
    tab: (active) => ({ flex: 1, padding: '10px 0 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, cursor: 'pointer', position: 'relative', opacity: active ? 1 : 0.7 }),
    tabLbl: (active) => ({ fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: '0.12em', color: active ? '#1a2a3a' : 'rgba(26,42,58,0.35)' }),
    tabPip: (active) => ({ position: 'absolute', top: 0, left: '25%', right: '25%', height: 2, background: '#1a2a3a', borderRadius: '0 0 2px 2px', transform: active ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform 0.28s cubic-bezier(0.34,1.56,0.64,1)' }),
    // commitment
    commitment: { background: '#1a2a3a', borderRadius: 18, padding: '18px 20px 18px 22px', cursor: 'pointer', position: 'relative', overflow: 'hidden', borderLeft: '4px solid rgba(255,255,255,0.55)', marginBottom: 18, boxShadow: '0 4px 20px rgba(26,42,58,0.1)' },
    // kpis
    kpiGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 },
    kpi: { background: '#1a2a3a', borderRadius: 14, padding: '14px 8px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 },
    // today card
    todayCard: { background: '#1a2a3a', borderRadius: 18, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 4px 24px rgba(26,42,58,0.13)', marginBottom: 20 },
    // ondeck
    ondeck: { background: '#1a2a3a', borderRadius: 14, padding: '14px 15px', display: 'flex', alignItems: 'center', gap: 13, marginBottom: 20, opacity: 0.72 },
    // last learned
    lastCard: (color) => ({ background: '#1a2a3a', borderRadius: 14, padding: '16px 16px 16px 20px', cursor: 'pointer', borderLeft: `3px solid ${color || '#C847FF'}` }),
    // cat chip
    catChip: (active) => ({ background: active ? '#243548' : '#1a2a3a', borderRadius: 12, padding: '10px 5px 9px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, cursor: 'pointer', border: active ? '1px solid rgba(255,255,255,0.18)' : '1px solid transparent' }),
    // entry row
    entry: (locked) => ({ display: 'flex', alignItems: 'center', gap: 11, padding: '13px 13px', background: '#1a2a3a', borderRadius: 12, cursor: locked ? 'default' : 'pointer', opacity: locked ? 0.28 : 1 }),
  }

  // Goal sheet chip data
  const WHAT_CHIPS = [
    { label: 'knowing vs. doing', val: 'the gap between what I know and what I actually do' },
    { label: 'high-stakes conversations', val: 'how sharp I am in high-stakes conversations' },
    { label: 'AI beyond basics', val: 'how I use AI beyond basic prompting' },
    { label: 'reframing under pressure', val: 'how quickly I can reframe a problem under pressure' },
    { label: 'performing when it matters', val: 'how I perform when it actually matters' },
    { label: 'deliberate communication', val: 'how deliberately I communicate ideas' },
  ]
  const WHEN_CHIPS = [
    { label: 'end of 30 days', val: 'by the end of these 30 days' },
    { label: 'next big moment', val: 'before my next big presentation or conversation' },
    { label: '90 days out', val: 'within 90 days of finishing this' },
    { label: 'end of year', val: 'by the end of this year' },
  ]
  const PROOF_CHIPS = [
    { label: "a win I wouldn't have had", val: 'I win a deal or negotiation I would have lost before' },
    { label: 'catching it in real time', val: 'I catch myself thinking differently in the moment, not in hindsight' },
    { label: 'someone notices the change', val: 'someone asks me how I approach problems differently' },
    { label: 'using it without thinking', val: "I use what I've learned without having to think about it" },
  ]

  const goalSentence = goalWhat && goalWhen && goalProof
    ? `I will change ${goalWhat}. ${goalWhen.charAt(0).toUpperCase() + goalWhen.slice(1)}, I'll know it worked — ${goalProof.replace(/\.$/, '')}.`
    : ''

  const catTotalEntries = ENTRIES.length / 7  // approx per category (40/7 ≈ 5.7, use catTotals)

  return (
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Caveat:wght@400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        .action-strip::-webkit-scrollbar{display:none;}
        .lib-filter-scroll::-webkit-scrollbar{display:none;}
        @keyframes ldot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.2;transform:scale(0.5)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes paperIn{from{transform:translateY(24px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes fold{0%{transform:translateY(0) scaleY(1);opacity:1}25%{transform:translateY(-4px) scaleY(0.65);opacity:1}55%{transform:translateY(12px) scaleY(0.12);opacity:0.7}100%{transform:translateY(80px) scaleY(0);opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn{0%{transform:scale(0.4)}100%{transform:scale(1)}}
      `}</style>

      {/* Modals */}
      {showEndOfBeta && <EndOfBetaModal userId={user?.id} onClose={() => setShowEndOfBeta(false)} />}
      {showWeeklySurvey && <WeeklySurveyModal userId={user?.id} weekNumber={weeklyWeekNumber} onClose={async () => { setShowWeeklySurvey(false); await supabase.from('profiles').update({ last_weekly_survey_day: weeklyWeekNumber * 7 }).eq('id', user.id) }} />}
      {showFeedback && <FeedbackModal userId={user?.id} onClose={() => setShowFeedback(false)} />}
      {showBug && <BugModal userId={user?.id} onClose={() => setShowBug(false)} />}
      {showHowItWorks && <HowItWorksModal onClose={() => setShowHowItWorks(false)} />}
      {showWhatsNew && whatsNewEntry && <WhatsNewModal entry={whatsNewEntry} onDismiss={dismissWhatsNew} />}
      {showWelcome && (() => {
        const firstName = profile?.first_name || (profile?.name ? profile.name.split(' ')[0] : 'there')
        const { line } = getDailyGreeting(profile?.name)
        return <WelcomeOverlay fullText={`Welcome back, ${firstName}.`} line={line} fading={welcomeFading} onDismiss={() => { setWelcomeFading(true); setTimeout(() => setShowWelcome(false), 500) }} />
      })()}

      {/* COMMIT RITUAL OVERLAY */}
      {showCommitRitual && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: '#09090b', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>
          {ritualPhase !== 'done' && (
            <div style={{ width: '100%', background: '#faf7f0', borderRadius: 4, padding: '28px 26px 32px', boxShadow: '0 12px 48px rgba(0,0,0,0.5)', animation: 'paperIn 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s both', ...(ritualPhase === 'folding' ? { animation: 'fold 1s cubic-bezier(0.4,0,0.6,1) forwards' } : {}) }}>
              <div style={{ height: 3, borderRadius: 2, marginBottom: 20, background: 'linear-gradient(90deg,#47FFE8,#C847FF)' }} />
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.2em', color: 'rgba(26,42,58,0.35)', marginBottom: 14 }}>MY COMMITMENT</div>
              <div style={{ fontFamily: "'Caveat', cursive", fontSize: 22, lineHeight: 1.65, color: '#1a2a3a', minHeight: 100, wordBreak: 'break-word' }}>
                {ritualTyped.split('\n').map((line, i) => <span key={i}>{line}{i < ritualTyped.split('\n').length - 1 && <br />}</span>)}
                {ritualPhase === 'typing' && <span style={{ display: 'inline-block', width: 2, height: 21, background: '#1a2a3a', marginLeft: 1, verticalAlign: 'middle', animation: 'blink 0.85s step-end infinite' }} />}
              </div>
              {(ritualPhase === 'sig' || ritualPhase === 'folding') && (
                <div style={{ fontFamily: "'Caveat', cursive", fontSize: 17, color: 'rgba(26,42,58,0.38)', marginTop: 18, borderTop: '1px solid rgba(26,42,58,0.1)', paddingTop: 12, animation: 'fadeUp 0.5s ease' }}>
                  — {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              )}
            </div>
          )}
          {(ritualPhase === 'folding') && (
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)', marginTop: 24, animation: 'fadeUp 0.6s ease' }}>TUCKING THIS AWAY.</div>
          )}
          {ritualPhase === 'done' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 40 }}>
              <div style={{ fontSize: 52, marginBottom: 20, animation: 'popIn 0.6s cubic-bezier(0.34,1.56,0.64,1)' }}>✓</div>
              <div style={{ fontSize: 36, fontWeight: 700, color: '#fff', letterSpacing: '-0.025em', marginBottom: 10, animation: 'fadeUp 0.5s ease 0.1s both' }}>Committed.</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontWeight: 300, lineHeight: 1.7, textAlign: 'center', maxWidth: 280, animation: 'fadeUp 0.5s ease 0.2s both' }}>It's set. Every lesson you open from here will be measured against this.</div>
              <button onClick={() => setShowCommitRitual(false)} style={{ marginTop: 40, fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.14em', padding: '13px 28px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.18)', color: '#ffffff', background: 'transparent', cursor: 'pointer', animation: 'fadeUp 0.5s ease 0.4s both' }}>
                START TODAY'S LESSON →
              </button>
            </div>
          )}
        </div>
      )}

      {/* GOAL SHEET */}
      {showGoalSheet && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(10,14,22,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={e => { if (e.target === e.currentTarget) setShowGoalSheet(false) }}>
          <div style={{ background: 'linear-gradient(160deg,#f0f4f8 0%,#e8eef5 100%)', width: '100%', maxWidth: 430, borderRadius: '20px 20px 0 0', padding: '20px 18px 48px', maxHeight: '92vh', overflowY: 'auto', animation: 'fadeUp 0.3s cubic-bezier(0.22,1,0.36,1)' }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(26,42,58,0.12)', margin: '0 auto 20px' }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
              <button onClick={() => setShowGoalSheet(false)} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.12em', color: 'rgba(26,42,58,0.4)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>CLOSE</button>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.025em', color: '#1a2a3a', lineHeight: 1.15, marginBottom: 6 }}>Make a commitment.</div>
            <div style={{ fontSize: 13, color: 'rgba(26,42,58,0.58)', lineHeight: 1.6, fontWeight: 300, marginBottom: 28 }}>Not a preference. Not a wish. Something you'll actually hold yourself to.</div>

            {/* Step 1 */}
            {[
              { step: 1, label: "What needs to change?", hint: "Be specific enough that it stings a little.", chips: WHAT_CHIPS, val: goalWhatInput, setVal: setGoalWhatInput, color: '#47FFE8', textColor: '#008a7a', onConfirm: () => setGoalStep(2) },
              { step: 2, label: "When will you know?", hint: "Real deadlines create real pressure.", chips: WHEN_CHIPS, val: goalWhenInput, setVal: setGoalWhenInput, color: '#E8FF47', textColor: '#6b7a00', onConfirm: () => setGoalStep(3) },
              { step: 3, label: "What will proof look like?", hint: "If you can't describe proof, you don't have a goal yet.", chips: PROOF_CHIPS, val: goalProofInput, setVal: setGoalProofInput, color: '#C847FF', textColor: '#7a00a8', onConfirm: commitGoal, confirmLabel: 'LOCK IT IN →' },
            ].map(({ step, label, hint, chips, val, setVal, color, textColor, onConfirm, confirmLabel }) => {
              const isDone = goalStep > step
              const isOpen = goalStep === step
              return (
                <div key={step} style={{ border: `1px solid ${isOpen ? 'rgba(26,42,58,0.22)' : 'rgba(26,42,58,0.1)'}`, borderRadius: 14, background: isDone ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.65)', overflow: 'hidden', marginBottom: 8, boxShadow: isOpen ? '0 2px 20px rgba(26,42,58,0.08)' : 'none' }}>
                  <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: isDone ? 'pointer' : 'default' }} onClick={() => isDone && setGoalStep(step)}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: `rgba(${color === '#47FFE8' ? '71,255,232' : color === '#E8FF47' ? '232,255,71' : '200,71,255'},0.15)`, border: `1px solid ${color}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 600, color: textColor, flexShrink: 0 }}>{step}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: isOpen || isDone ? '#1a2a3a' : 'rgba(26,42,58,0.4)', flex: 1 }}>{label}</div>
                    {isDone && val && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(26,42,58,0.5)', maxWidth: 96, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val.length > 18 ? val.slice(0,16)+'…' : val}</div>}
                  </div>
                  {isOpen && (
                    <div style={{ padding: '0 16px 16px' }}>
                      <div style={{ fontSize: 12, color: 'rgba(26,42,58,0.5)', lineHeight: 1.6, marginBottom: 12, fontStyle: 'italic' }}>{hint}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                        {chips.map(c => (
                          <div key={c.val} onClick={() => setVal(c.val)} style={{ padding: '7px 13px', borderRadius: 20, border: `1px solid ${val === c.val ? '#1a2a3a' : color + '55'}`, fontSize: 12, color: val === c.val ? '#ffffff' : '#1a2a3a', background: val === c.val ? '#1a2a3a' : 'transparent', cursor: 'pointer', lineHeight: 1.3, fontWeight: 400 }}>{c.label}</div>
                        ))}
                      </div>
                      <input value={val} onChange={e => setVal(e.target.value)} placeholder="Or be even more specific…" style={{ width: '100%', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(26,42,58,0.14)', borderRadius: 8, padding: '11px 13px', fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#1a2a3a', outline: 'none', boxSizing: 'border-box' }} />
                      <button onClick={() => { if (val.trim()) onConfirm() }} style={{ marginTop: 10, width: '100%', padding: '12px 16px', background: '#1a2a3a', color: '#ffffff', border: 'none', borderRadius: 8, fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', cursor: 'pointer' }}>{confirmLabel || 'CONFIRM →'}</button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={S.header}>
        <div style={S.headerTop}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={S.wm}>ONE PERCENT</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.1em', padding: '4px 8px', borderRadius: 5, fontWeight: 600, background: 'rgba(184,204,0,0.15)', color: '#6b7800', border: '1px solid rgba(184,204,0,0.4)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#8a9800', flexShrink: 0 }} />BETA
              </span>
              {isAdmin && (
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.1em', padding: '4px 8px', borderRadius: 5, fontWeight: 600, background: 'rgba(0,196,173,0.12)', color: '#007a6b', border: '1px solid rgba(0,196,173,0.35)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#009b89', flexShrink: 0 }} />ADMIN
                </span>
              )}
            </div>
          </div>
          <button onClick={() => router.push('/profile')} style={S.av}>
            {profile?.avatar_url ? <img src={profile.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : <User size={14} strokeWidth={1.5} color="rgba(26,42,58,0.5)" />}
          </button>
        </div>
        <div className="action-strip" style={S.actionStrip}>
          <button style={S.asBtn} onClick={() => router.push('/about')}>ABOUT</button>
          <button style={{ ...S.asBtn, color: hasUnseenChangelog ? '#b8a000' : 'rgba(26,42,58,0.55)', fontWeight: hasUnseenChangelog ? 600 : 400 }} onClick={() => { router.push('/changelog'); markChangelogSeen() }}>CHANGELOG{hasUnseenChangelog ? ' •' : ''}</button>
          <div style={S.sep} />
          <button style={S.asBtnBug} onClick={() => setShowBug(true)}>BUG</button>
          <button style={S.asBtn} onClick={() => setShowFeedback(true)}>FEEDBACK</button>
          <button style={S.asBtn} onClick={() => setShowHowItWorks(true)}>INFO</button>
          {isAdmin && <><div style={S.sep} /><button style={{ ...S.asBtn, color: '#47FFE8', borderColor: 'rgba(71,255,232,0.3)' }} onClick={() => router.push('/admin')}>ADMIN →</button></>}
          <div style={S.sep} />
          <button style={S.asBtn} onClick={handleSignOut} disabled={signingOut}>{signingOut ? 'SIGNING OUT…' : 'SIGN OUT'}</button>
        </div>
      </div>

      {/* ── TODAY TAB ── */}
      {activeTab === 'today' && (
        <div style={S.screen}>
          {/* Commitment */}
          <div style={S.commitment} onClick={() => { setGoalStep(1); setShowGoalSheet(true) }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.55)', marginBottom: 7 }}>WHY I'M HERE</div>
            <div style={{ fontSize: 13, color: goalSentence ? 'rgba(232,238,245,0.92)' : 'rgba(232,238,245,0.35)', lineHeight: 1.6, fontStyle: goalSentence ? 'italic' : 'normal' }}>
              {goalSentence || 'What are you actually trying to change? Tap to set your goal.'}
            </div>
            <div style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', color: 'rgba(232,238,245,0.15)', fontSize: 22, fontWeight: 300 }}>›</div>
          </div>

          {/* KPIs */}
          <div style={S.kpiGrid}>
            {[
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#47FFE8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>, val: completedCount, lbl: 'COMPLETED' },
              { icon: <span style={{ fontSize: 20, lineHeight: 1 }}>🔥</span>, val: streak, lbl: 'DAY STREAK' },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8FF47" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1.5" fill="#E8FF47" stroke="none"/></svg>, val: avgScore, lbl: 'AVG SCORE' },
            ].map((k, i) => (
              <div key={i} style={S.kpi}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 22 }}>{k.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1 }}>{k.val}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: '0.1em', color: 'rgba(232,238,245,0.55)', textAlign: 'center' }}>{k.lbl}</div>
              </div>
            ))}
          </div>

          {/* Today */}
          <div style={S.secLabel}>Today</div>
          {todayEntry && (() => {
            const cat = CAT_CONFIG[todayEntry.category] || {}
            const entryAccent = cat.color || '#47FFE8'
            const comp = completions[todayEntry.entry]
            const conceptDone = !!comp
            // determine which moment is active based on completion
            return (
              <div style={S.todayCard} onClick={() => router.push(`/entry/${todayEntry.entry}`)}>
                <div style={{ padding: '20px 20px 16px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: entryAccent }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.12em', color: 'rgba(232,238,245,0.45)' }}>{todayEntry.editionId} · ENTRY {todayEntry.entry}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.1em', color: entryAccent }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: entryAccent, animation: 'ldot 2s ease-in-out infinite' }} />
                      {todayCompleted ? 'COMPLETE' : 'UNLOCKED'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: entryAccent + '1a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 3 }}>
                      {cat.icon && React.cloneElement(cat.icon, { width: 18, height: 18 })}
                    </div>
                    <div style={{ fontSize: 27, fontWeight: 700, letterSpacing: '-0.025em', color: '#fff', lineHeight: 1.1 }}>{todayEntry.concept}</div>
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(232,238,245,0.55)', fontWeight: 300, fontStyle: 'italic', lineHeight: 1.55, marginBottom: 18 }}>
                    {/* hook from entry JSON not loaded here — use category tagline */}
                    {todayEntry.category}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: entryAccent, flexShrink: 0 }} />
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.1em', color: entryAccent }}>{todayEntry.category.toUpperCase()}</span>
                    </div>
                    <button onClick={e => { e.stopPropagation(); router.push(`/entry/${todayEntry.entry}`) }} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', padding: '11px 22px', borderRadius: 10, border: 'none', background: entryAccent, color: '#061410', cursor: 'pointer' }}>
                      {todayCompleted ? 'REVIEW →' : 'BEGIN →'}
                    </button>
                  </div>
                </div>
                {/* Moment strip */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  {['CONCEPT', 'IN THE WILD', 'LOCK IT IN'].map((label, i) => {
                    const isDone = todayCompleted && i < 3
                    const isActive = !todayCompleted && i === 0
                    return (
                      <div key={label} style={{ padding: '12px 10px', background: isDone && i === 0 ? entryAccent + '1a' : '#152030', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: isDone ? 'rgba(232,238,245,0.55)' : isActive ? entryAccent : 'rgba(255,255,255,0.12)' }} />
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: '0.08em', color: isDone ? 'rgba(232,238,245,0.6)' : isActive ? 'rgba(232,238,245,0.85)' : 'rgba(232,238,245,0.28)', textAlign: 'center' }}>{label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })()}

          {/* On Deck */}
          {onDeckEntry && (() => {
            const cat = CAT_CONFIG[onDeckEntry.category] || {}
            return (
              <>
                <div style={S.secLabel}>On Deck</div>
                <div style={S.ondeck}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: (cat.color || '#fff') + '1a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {cat.icon && React.cloneElement(cat.icon, { width: 14, height: 14 })}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: '0.12em', color: 'rgba(232,238,245,0.5)', marginBottom: 3 }}>UP NEXT · UNLOCKS TOMORROW</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#e8eef5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{onDeckEntry.concept}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.06em', color: cat.color || '#fff' }}>{onDeckEntry.editionId} · {onDeckEntry.category.toUpperCase()}</div>
                  </div>
                  <span style={{ color: 'rgba(232,238,245,0.2)', fontSize: 18, flexShrink: 0 }}>›</span>
                </div>
              </>
            )
          })()}

          {/* Last Learned */}
          {lastEntry && (() => {
            const cat = CAT_CONFIG[lastEntry.category] || {}
            const lastComp = completions[lastEntry.entry]
            return (
              <>
                <div style={S.secLabel}>Last Learned</div>
                <div style={S.lastCard(cat.color)} onClick={() => router.push(`/entry/${lastEntry.entry}`)}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: '0.18em', color: 'rgba(232,238,245,0.45)', marginBottom: 5 }}>ENTRY {lastEntry.entry} · {lastEntry.category.toUpperCase()} · {lastEntry.editionId}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#e8eef5', marginBottom: 6 }}>{lastEntry.concept}</div>
                  <div style={{ fontSize: 12, color: 'rgba(232,238,245,0.65)', lineHeight: 1.65, fontWeight: 300, fontStyle: 'italic' }}>
                    {lastComp ? `You scored ${lastComp.score}/3 on this one.` : 'Tap to revisit.'}
                  </div>
                  <div style={{ marginTop: 10, fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.1em', color: (cat.color || '#C847FF') + 'cc' }}>REVISIT THIS LESSON →</div>
                </div>
              </>
            )
          })()}
        </div>
      )}

      {/* ── LIBRARY TAB ── */}
      {activeTab === 'library' && (
        <div style={S.screen}>
          {/* Category chips 4x2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 7, marginBottom: 16 }}>
            {[{ key: 'ALL', label: 'ALL', color: 'rgba(232,238,245,0.7)', bg: 'rgba(255,255,255,0.07)', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(232,238,245,0.7)" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>, count: `${completedCount}/${TOTAL_ENTRIES}` },
              ...ALL_CATS.map(c => ({ key: c, label: CAT_CONFIG[c]?.short || c, color: CAT_CONFIG[c]?.color, bg: (CAT_CONFIG[c]?.color || '#fff') + '1f', icon: CAT_CONFIG[c]?.icon, count: `${catCounts[c] || 0}/${catTotals[c] || 0}` }))
            ].map(chip => (
              <div key={chip.key} onClick={() => setLibFilter(chip.key)} style={S.catChip(libFilter === chip.key)}>
                <div style={{ width: 24, height: 24, borderRadius: 7, background: chip.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{chip.icon}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: '0.06em', color: libFilter === chip.key ? '#fff' : (chip.color || 'rgba(232,238,245,0.6)'), textAlign: 'center', lineHeight: 1.2 }}>{chip.label}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, color: libFilter === chip.key ? 'rgba(232,238,245,0.7)' : 'rgba(232,238,245,0.35)', textAlign: 'center' }}>{chip.count}</div>
              </div>
            ))}
          </div>
          <div style={{ height: 1, background: 'rgba(26,42,58,0.08)', marginBottom: 14 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingBottom: 20 }}>
            {ENTRIES
              .filter(e => {
                if (libFilter === 'ALL') return true
                if (libFilter === 'Saved') return !!bookmarks[e.entry]
                return e.category === libFilter
              })
              .map((e, idx) => {
                const entryNum = ENTRIES.indexOf(e) + 1
                const unlocked = entryNum <= unlockedCount
                const completed = !!completions[e.entry]
                const cat = CAT_CONFIG[e.category] || {}
                const isToday = entryNum === unlockedCount
                return (
                  <div key={e.entry} onClick={() => unlocked && router.push(`/entry/${e.entry}`)} style={{ ...S.entry(!unlocked), border: isToday ? `1px solid ${cat.color || '#47FFE8'}40` : '1px solid transparent' }}>
                    <div style={{ width: 3, height: 34, borderRadius: 2, flexShrink: 0, background: cat.color || '#fff', opacity: !unlocked ? 0.12 : completed ? 0.5 : 1 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: completed ? 400 : 600, color: completed ? 'rgba(232,238,245,0.58)' : '#e8eef5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{e.concept}</div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: isToday ? cat.color : 'rgba(232,238,245,0.4)' }}>{e.editionId} · {isToday ? 'TODAY' : e.category.toUpperCase()}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
                      {completed && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 700, color: cat.color }}>{completions[e.entry]?.score}/3</span>}
                      {isToday && !completed && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.08em', color: cat.color, fontWeight: 700 }}>NOW →</span>}
                      {unlocked && !isToday && !completed && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.08em', color: 'rgba(232,238,245,0.4)' }}>START →</span>}
                      {!unlocked && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.08em', color: 'rgba(232,238,245,0.4)' }}>LOCKED</span>}
                      {unlocked && (
                        <button onClick={ev => toggleBookmark(ev, e.entry)} style={{ fontSize: 13, background: 'none', border: 'none', padding: 2, cursor: 'pointer', color: bookmarks[e.entry] ? '#E8FF47' : 'rgba(232,238,245,0.2)', lineHeight: 1 }}>
                          {bookmarks[e.entry] ? '★' : '☆'}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* ── PROMPTS TAB ── */}
      {activeTab === 'prompts' && (
        <div style={S.screen}>
          <div style={{ background: '#1a2a3a', borderRadius: 18, padding: '26px 22px', textAlign: 'center', marginBottom: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 15, background: 'rgba(200,71,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C847FF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: '#fff', marginBottom: 7 }}>Prompt Farm</div>
            <div style={{ fontSize: 13, color: 'rgba(232,238,245,0.6)', lineHeight: 1.6, fontWeight: 300 }}>Every concept you've learned has a prompt built for it. Copy it into Claude and put the idea to work on a real problem.</div>
          </div>
          {/* Category chips */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 7, marginBottom: 14 }}>
            {[{ key: 'ALL', label: 'ALL', color: 'rgba(232,238,245,0.7)', bg: 'rgba(255,255,255,0.07)', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(232,238,245,0.7)" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>, count: `${completedCount}/${TOTAL_ENTRIES}` },
              ...ALL_CATS.map(c => ({ key: c, label: CAT_CONFIG[c]?.short || c, color: CAT_CONFIG[c]?.color, bg: (CAT_CONFIG[c]?.color || '#fff') + '1f', icon: CAT_CONFIG[c]?.icon, count: `${catCounts[c] || 0}/${catTotals[c] || 0}` }))
            ].map(chip => (
              <div key={chip.key} style={S.catChip(false)}>
                <div style={{ width: 24, height: 24, borderRadius: 7, background: chip.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{chip.icon}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: '0.06em', color: chip.color || 'rgba(232,238,245,0.6)', textAlign: 'center', lineHeight: 1.2 }}>{chip.label}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, color: 'rgba(232,238,245,0.35)', textAlign: 'center' }}>{chip.count}</div>
              </div>
            ))}
          </div>
          <div style={{ height: 8 }} />
          {/* Prompt cards from completed entries with ai_prompt */}
          {ENTRIES.filter(e => completions[e.entry]).map(e => {
            const cat = CAT_CONFIG[e.category] || {}
            return (
              <div key={e.entry} style={{ background: '#1a2a3a', borderRadius: 13, padding: '15px 17px', marginBottom: 7, borderLeft: `3px solid ${cat.color || '#C847FF'}` }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: '0.16em', color: 'rgba(232,238,245,0.45)', marginBottom: 7 }}>{e.category.toUpperCase()} · {e.concept.toUpperCase()}</div>
                <div style={{ fontSize: 13, color: 'rgba(232,238,245,0.82)', lineHeight: 1.55, fontWeight: 300, fontStyle: 'italic', marginBottom: 10 }}>
                  Tap to open a conversation about {e.concept} in Claude.
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.1em', color: (cat.color || '#C847FF') + 'cc' }}>OPEN IN CLAUDE →</div>
              </div>
            )
          })}
          {completedCount === 0 && <div style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(26,42,58,0.4)', fontSize: 13, fontStyle: 'italic' }}>Complete your first lesson to unlock prompts.</div>}
        </div>
      )}

      {/* ── PROGRESS TAB ── */}
      {activeTab === 'progress' && (
        <div style={{ ...S.screen, paddingBottom: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Streak */}
            <div style={{ background: '#1a2a3a', borderRadius: 18, padding: '22px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 24, lineHeight: 1 }}>🔥</span>
                <span style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1 }}>{streak}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(232,238,245,0.55)', letterSpacing: '0.08em', paddingBottom: 5, alignSelf: 'flex-end' }}>DAY STREAK</span>
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: 'rgba(232,238,245,0.35)', letterSpacing: '0.08em', marginBottom: 18 }}>PERSONAL BEST · {profile?.longest_streak || streak || 0} DAYS</div>
              {/* Week row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 5 }}>
                {['M','T','W','T','F','S','S'].map((d, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: 'rgba(232,238,245,0.4)' }}>{d}</span>
                    <div style={{ width: '100%', aspectRatio: 1, borderRadius: 7, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontFamily: "'DM Mono', monospace", fontWeight: 700 }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Concepts + Time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div style={{ background: '#1a2a3a', borderRadius: 14, padding: '16px 16px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(71,255,232,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#47FFE8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: '#47FFE8', lineHeight: 1, marginBottom: 3 }}>{completedCount}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: '0.1em', color: 'rgba(232,238,245,0.5)' }}>CONCEPTS<br/>LOCKED IN</div>
                </div>
              </div>
              <div style={{ background: '#1a2a3a', borderRadius: 14, padding: '16px 16px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(232,255,71,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#E8FF47" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: '#E8FF47', lineHeight: 1, marginBottom: 3 }}>{totalTimeMin}m</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: '0.1em', color: 'rgba(232,238,245,0.5)' }}>TIME SPENT<br/>LEARNING</div>
                </div>
              </div>
            </div>

            {/* Score trend */}
            {recentScores.length > 0 && (
              <div style={{ background: '#1a2a3a', borderRadius: 14, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.14em', color: 'rgba(232,238,245,0.45)' }}>QUIZ SCORE TREND</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, color: 'rgba(232,238,245,0.28)', marginTop: 3 }}>LAST {recentScores.length} ENTRIES</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#47FFE8', letterSpacing: '-0.02em' }}>{(recentScores.reduce((a,b) => a+b, 0) / recentScores.length).toFixed(1)}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, color: 'rgba(71,255,232,0.6)', marginTop: 2 }}>AVG</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 36, marginBottom: 10 }}>
                  {recentScores.map((s, i) => {
                    const colors = ['#47FFE8','#E8FF47','#47FFE8','#C847FF','#E8FF47','#47FFE8','#47FFE8']
                    return <div key={i} style={{ flex: 1, borderRadius: '3px 3px 0 0', background: colors[i % colors.length], opacity: 0.4 + s/3*0.6, height: `${Math.round(s/3*100)}%`, minHeight: 3 }} />
                  })}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(232,238,245,0.5)', fontStyle: 'italic', fontWeight: 300, lineHeight: 1.5, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10 }}>
                  Your scores are improving. Keep going.
                </div>
              </div>
            )}

            {/* Leaderboard */}
            <div onClick={() => router.push('/leaderboard')} style={{ background: '#1a2a3a', borderRadius: 14, padding: '15px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(232,255,71,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8FF47" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#e8eef5', marginBottom: 2 }}>Leaderboard</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: 'rgba(232,238,245,0.4)' }}>{leaderboardRank ? `YOU'RE #${leaderboardRank} OF 6 TESTERS` : 'SEE HOW YOU STACK UP'}</div>
                </div>
              </div>
              {leaderboardRank && <div style={{ fontSize: 26, fontWeight: 700, color: '#E8FF47', letterSpacing: '-0.02em' }}>#{leaderboardRank}</div>}
            </div>

            {/* Category mastery rings */}
            <div style={{ background: '#1a2a3a', borderRadius: 14, padding: '18px 18px 16px' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.14em', color: 'rgba(232,238,245,0.45)', marginBottom: 16 }}>CATEGORY MASTERY</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                {ALL_CATS.map(catName => {
                  const cat = CAT_CONFIG[catName] || {}
                  const done = catCounts[catName] || 0
                  const total = catTotals[catName] || 1
                  const pct = Math.round((done / total) * 100)
                  const R = 22, S = 58, CIRC = 2 * Math.PI * R
                  const dash = CIRC * (pct / 100)
                  const active = pct > 0
                  return (
                    <div key={catName} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
                      <div style={{ position: 'relative', width: S, height: S }}>
                        <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={{ position: 'absolute', top: 0, left: 0 }}>
                          <circle cx={S/2} cy={S/2} r={R} stroke="rgba(255,255,255,0.07)" strokeWidth="3.5" fill="none" />
                          {active && <circle cx={S/2} cy={S/2} r={R} stroke={cat.color || '#fff'} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeDasharray={`${dash.toFixed(1)} ${(CIRC-dash).toFixed(1)}`} transform={`rotate(-90 ${S/2} ${S/2})`} />}
                        </svg>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: active ? 1 : 0.25 }}>
                          {cat.icon && React.cloneElement(cat.icon, { width: 16, height: 16 })}
                        </div>
                      </div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 6, letterSpacing: '0.06em', color: active ? 'rgba(232,238,245,0.7)' : 'rgba(232,238,245,0.28)', textAlign: 'center', lineHeight: 1.3 }}>{cat.short || catName}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      <div style={S.bottomNav}>
        {[
          { id: 'today', label: 'TODAY', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" stroke={activeTab==='today'?'#1a2a3a':'rgba(26,42,58,0.3)'}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg> },
          { id: 'library', label: 'LIBRARY', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" stroke={activeTab==='library'?'#1a2a3a':'rgba(26,42,58,0.3)'}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
          { id: 'prompts', label: 'PROMPTS', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" stroke={activeTab==='prompts'?'#1a2a3a':'rgba(26,42,58,0.3)'} strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg> },
          { id: 'progress', label: 'PROGRESS', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" stroke={activeTab==='progress'?'#1a2a3a':'rgba(26,42,58,0.3)'}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
        ].map(t => (
          <div key={t.id} onClick={() => setActiveTab(t.id)} style={S.tab(activeTab === t.id)}>
            <div style={S.tabPip(activeTab === t.id)} />
            <div style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t.icon}</div>
            <span style={S.tabLbl(activeTab === t.id)}>{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
