'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { supabase } from '@/lib/supabase'
import analytics from '@/lib/analytics'

// Section Feedback — redesigned rating sheet (design handoff, 2026-07). Rises as a
// bottom sheet over Lock It In. Three 1–5 rows + optional note (mic dictation),
// Submit disabled until all three rated. Persists to the same `feedback` table
// columns as the classic post-entry feedback.

const ROWS = [
  { kicker: 'THE CONCEPT', question: 'Did this click for you?', col: 'topic_rating' },
  { kicker: 'IN THE WILD', question: 'Did it shift how you think about it?', col: 'clarity_rating' },
  { kicker: 'LOCK IT IN', question: 'Could you explain this to someone else now?', col: 'quiz_rating' },
]

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '')
  return m ? `${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)}` : '61,232,138'
}

export default function SectionFeedback({ entryNumber, userId, accent = '#3DE88A', onClose }) {
  const A = accent
  const rgb = hexToRgb(accent)
  const [ratings, setRatings] = useState([0, 0, 0])
  const [note, setNote] = useState('')
  const [listening, setListening] = useState(false)
  const [voiceOk, setVoiceOk] = useState(false)
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [mounted, setMounted] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(() => {
    setMounted(true)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)
    if (SR) setVoiceOk(true)
    return () => { document.body.style.overflow = prev; recognitionRef.current?.stop?.() }
  }, [])

  const complete = ratings.every((r) => r > 0)

  const toggleMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    if (listening) { recognitionRef.current?.stop(); setListening(false); return }
    const rec = new SR()
    rec.continuous = true; rec.interimResults = true; rec.lang = 'en-US'
    let finalT = note
    rec.onresult = (e) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalT += e.results[i][0].transcript + ' '
        else interim = e.results[i][0].transcript
      }
      setNote(finalT + interim)
    }
    rec.onend = () => { setNote(finalT.trim()); setListening(false) }
    rec.onerror = () => setListening(false)
    recognitionRef.current = rec
    rec.start(); setListening(true)
  }

  const submit = async () => {
    if (!complete || submitting) return
    if (!userId) { setError('Not signed in — reload and try again.'); return }
    setSubmitting(true); setError(null)
    const { error: err } = await supabase.from('feedback').insert({
      user_id: userId,
      feedback_type: 'post_entry',
      entry_number: entryNumber,
      topic_rating: ratings[0],
      clarity_rating: ratings[1],
      quiz_rating: ratings[2],
      comment: note.trim() || null,
    })
    if (err) { setSubmitting(false); setError(err.message || 'Something went wrong — tap to retry.'); return }
    if (typeof analytics.feedbackSubmitted === 'function') {
      analytics.feedbackSubmitted({ entryNumber, morningRating: ratings[0], middayRating: ratings[1], quizRating: ratings[2], hasComment: !!note.trim() })
    }
    setDone(true)
    setTimeout(() => onClose?.(), 950)
  }

  const overlay = (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2100, fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`
        @keyframes sfUp{from{transform:translateY(30px)}to{transform:translateY(0)}}
        @keyframes sfRise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .sf-ta::placeholder{color:rgba(232,238,245,0.32)}
        .sf-ta:focus{outline:none}
      `}</style>

      {/* scrim */}
      <div onClick={() => !submitting && onClose?.()} style={{ position: 'absolute', inset: 0, background: 'rgba(4,7,11,0.6)' }} />

      {/* sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: '12%', bottom: 0,
        background: 'radial-gradient(120% 55% at 50% 0%, #17222e 0%, #0e161e 46%, #0b1017 100%)',
        borderTopLeftRadius: 30, borderTopRightRadius: 30, borderTop: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 -30px 60px -30px rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column',
        animation: 'sfUp .5s cubic-bezier(.2,.7,.2,1) both', paddingTop: 'env(safe-area-inset-top, 0px)',
      }}>
        <div style={{ width: 38, height: 4, borderRadius: 999, background: 'rgba(232,238,245,0.22)', margin: '12px auto 0', flex: 'none' }} />
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: '18px 26px calc(26px + env(safe-area-inset-bottom, 0px))' }}>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: '0.28em', color: A }}>SECTION FEEDBACK</div>
          <div style={{ fontSize: 21, fontWeight: 600, letterSpacing: '-0.02em', color: '#f1f6fb', marginTop: 8 }}>Rate each part of today's entry.</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 26 }}>
            {ROWS.map((row, ri) => (
              <div key={ri} style={{ animation: 'sfRise .45s ease both' }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9.5, letterSpacing: '0.2em', color: A }}>{row.kicker}</div>
                <div style={{ fontSize: 15, fontWeight: 500, color: 'rgba(241,246,251,0.92)', marginTop: 6 }}>{row.question}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  {[1, 2, 3, 4, 5].map((n) => {
                    const on = ratings[ri] === n
                    return (
                      <button key={n} onClick={() => setRatings((prev) => { const r = prev.slice(); r[ri] = n; return r })} style={{
                        flex: 1, appearance: 'none', cursor: 'pointer', padding: '13px 0', borderRadius: 11,
                        fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, transition: 'all .18s ease',
                        color: on ? '#06140c' : 'rgba(232,238,245,0.7)',
                        background: on ? `radial-gradient(circle at 40% 30%, #7dffba, ${A})` : 'rgba(255,255,255,0.045)',
                        border: on ? '1px solid transparent' : '1px solid rgba(255,255,255,0.1)',
                        boxShadow: on ? `0 6px 18px -6px rgba(${rgb},0.6)` : 'none',
                      }}>{n}</button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div style={{ position: 'relative', marginTop: 26 }}>
            <textarea className="sf-ta" rows={3} value={note} onChange={(e) => setNote(e.target.value)}
              placeholder={voiceOk ? 'Anything else? Tap the mic to speak. (optional)' : 'Anything else? (optional)'}
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: voiceOk ? '14px 44px 14px 15px' : '14px 15px', fontSize: 14.5, lineHeight: 1.5, color: '#f1f6fb', fontFamily: "'DM Sans',sans-serif", resize: 'none', boxSizing: 'border-box' }}
            />
            {voiceOk && (
              <button onClick={toggleMic} style={{ position: 'absolute', top: 10, right: 10, width: 30, height: 30, appearance: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 9, color: listening ? '#06140c' : 'rgba(232,238,245,0.6)', background: listening ? `radial-gradient(circle at 40% 30%, #7dffba, ${A})` : 'rgba(255,255,255,0.05)', border: listening ? '1px solid transparent' : '1px solid rgba(255,255,255,0.1)', transition: 'all .2s ease' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
              </button>
            )}
          </div>

          {error && <div style={{ fontSize: 12, color: '#FF4778', marginTop: 12 }}>{error}</div>}

          <button onClick={submit} disabled={!complete || submitting} style={{
            width: '100%', appearance: 'none', cursor: complete && !submitting ? 'pointer' : 'default', marginTop: 24, padding: 16, borderRadius: 14, border: 'none',
            fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, letterSpacing: '0.01em',
            color: complete ? '#06140c' : 'rgba(232,238,245,0.4)',
            background: complete ? `linear-gradient(180deg, #6cffb0 0%, ${A} 60%, #2fc676 100%)` : 'rgba(255,255,255,0.05)',
            boxShadow: complete ? `0 12px 30px -8px rgba(${rgb},0.55), inset 0 1px 0 rgba(255,255,255,0.5)` : 'none', transition: 'all .25s ease',
          }}>{done ? 'Thanks — got it ✓' : submitting ? 'Saving…' : 'Submit'}</button>

          <div onClick={() => !submitting && onClose?.()} style={{ textAlign: 'center', marginTop: 14, fontSize: 13, color: 'rgba(232,238,245,0.4)', cursor: 'pointer' }}>Skip for now</div>
        </div>
      </div>
    </div>
  )

  return mounted ? createPortal(overlay, document.body) : null
}
