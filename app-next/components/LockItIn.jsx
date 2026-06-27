'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// Three bounded "moves" — recall, apply, transfer. Fixed client-side so the
// exercise is always exactly three turns (predictable length and API cost).
const MOVES = [
  (concept) => `In your own words — what is **${concept}**, and why does it matter?`,
  () => `Where could you put this to work in the next few days? Be specific.`,
  () => `What's the strongest objection or failure case for this idea — and how would you handle it?`,
]

function render(md) {
  return md.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
}

export default function LockItIn({ entry, accent, theme: T, onComplete, onSwitch }) {
  const concept = entry.concept
  const [turns, setTurns] = useState([{ role: 'assistant', content: MOVES[0](concept) }])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [finished, setFinished] = useState(false)
  const [result, setResult] = useState(null) // { score, recap }
  const moveIndex = useRef(0)
  const qa = useRef([])
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [turns, streamingText, result])

  const send = useCallback(async () => {
    const answer = input.trim()
    if (!answer || busy || finished) return
    const idx = moveIndex.current
    setInput('')
    setBusy(true)
    setTurns((t) => [...t, { role: 'user', content: answer }])
    qa.current.push({ q: MOVES[idx](concept).replace(/\*\*/g, ''), a: answer })

    // 1. Stream a short coaching reply to this answer.
    let coaching = ''
    try {
      const res = await fetch('/api/lock-it-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'coach',
          entry,
          messages: [{ role: 'user', content: `Question ${idx + 1}: ${qa.current[idx].q}\nMy answer: ${answer}` }],
        }),
      })
      if (!res.ok) throw new Error('coach failed')
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      setStreamingText('')
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        coaching += decoder.decode(value, { stream: true })
        setStreamingText(coaching)
      }
    } catch {
      coaching = "Good — that's the kind of thinking that makes it stick. Let's keep going."
    }
    setStreamingText('')
    setTurns((t) => [...t, { role: 'assistant', content: coaching }])

    // 2. Advance to the next move, or grade after the third.
    if (idx < MOVES.length - 1) {
      moveIndex.current = idx + 1
      setTurns((t) => [...t, { role: 'assistant', content: MOVES[idx + 1](concept) }])
      setBusy(false)
      setTimeout(() => inputRef.current?.focus(), 100)
      return
    }

    // Final move done — grade the three answers into a 0–3 score.
    setTurns((t) => [...t, { role: 'assistant', content: 'Locking it in…' }])
    let score = 3
    let recap = ''
    try {
      const res = await fetch('/api/lock-it-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'grade', entry, qa: qa.current }),
      })
      const data = await res.json()
      if (typeof data.score === 'number') { score = data.score; recap = data.recap || '' }
    } catch {
      // grading unreachable — default to a passing score rather than penalize.
    }
    setFinished(true)
    setResult({ score, recap })
    setBusy(false)
    if (onComplete) onComplete({ score, recap, answers: { mode: 'chat' } })
  }, [input, busy, finished, entry, concept, onComplete])

  return (
    <div>
      <style>{`
        @keyframes liType{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1)}}
        .li-textarea::placeholder{color:${T.textFaint}}
        .li-textarea:focus{outline:none;border-color:${accent}66}
      `}</style>

      <div style={{ fontSize: 11, color: T.textDim, lineHeight: 1.6, marginBottom: 16 }}>
        A short back-and-forth to lock the concept in. Answer in your own words — there are no multiple-choice options.
        {onSwitch && (
          <button onClick={onSwitch} disabled={qa.current.length > 0} style={{
            background: 'none', border: 'none', color: qa.current.length > 0 ? T.textFaint : accent,
            cursor: qa.current.length > 0 ? 'default' : 'pointer', fontSize: 11, fontWeight: 600,
            fontFamily: "'Inter',sans-serif", marginLeft: 8, padding: 0,
          }}>
            {qa.current.length > 0 ? '' : 'Prefer the quiz?'}
          </button>
        )}
      </div>

      {/* Conversation */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        {turns.map((m, i) => {
          const isUser = m.role === 'user'
          return (
            <div key={i} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
              <div
                dangerouslySetInnerHTML={{ __html: render(m.content) }}
                style={{
                  maxWidth: '88%', padding: '11px 14px', fontSize: 14, lineHeight: 1.65,
                  fontFamily: "'Inter',sans-serif", whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  color: isUser ? '#eee' : T.textMid,
                  background: isUser ? `${accent}1f` : T.surface,
                  border: isUser ? `1px solid ${accent}44` : `1px solid ${T.surfaceBorder}`,
                  borderRadius: isUser ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                }}
              />
            </div>
          )
        })}

        {busy && streamingText && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div dangerouslySetInnerHTML={{ __html: render(streamingText) }} style={{
              maxWidth: '88%', padding: '11px 14px', fontSize: 14, lineHeight: 1.65, fontFamily: "'Inter',sans-serif",
              whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: T.textMid, background: T.surface,
              border: `1px solid ${T.surfaceBorder}`, borderRadius: '12px 12px 12px 4px',
            }} />
          </div>
        )}
        {busy && !streamingText && !finished && (
          <div style={{ display: 'flex', gap: 5, padding: '6px 14px' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: accent, animation: `liType 1.2s ease-in-out ${i * 0.2}s infinite` }} />
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input (hidden once finished) */}
      {!finished && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <textarea
            ref={inputRef}
            className="li-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="Type your answer…"
            rows={2}
            disabled={busy}
            style={{
              flex: 1, background: T.quizOpt, border: `1px solid ${T.borderMid}`, borderRadius: 6,
              padding: '11px 13px', fontSize: 14, color: T.text, fontFamily: "'Inter',sans-serif",
              resize: 'none', lineHeight: 1.5, opacity: busy ? 0.6 : 1,
            }}
          />
          <button onClick={send} disabled={!input.trim() || busy} style={{
            background: input.trim() && !busy ? accent : T.quizOpt, color: '#0A0A0A', border: 'none',
            borderRadius: 6, padding: '0 18px', height: 44, fontSize: 12, fontWeight: 600, letterSpacing: '0.06em',
            cursor: input.trim() && !busy ? 'pointer' : 'default', fontFamily: "'Inter',sans-serif", flexShrink: 0,
          }}>
            {moveIndex.current === MOVES.length - 1 ? 'FINISH' : 'SEND'}
          </button>
        </div>
      )}

      {/* Result */}
      {finished && result && (
        <div className="op-score-box op-score-close" style={{ border: `2px solid ${result.score === 3 ? accent : '#606060'}` }}>
          <div style={{ fontSize: 36, fontWeight: 500, color: result.score === 3 ? accent : '#ccc' }}>{result.score}/3</div>
          <div style={{ fontSize: 13, letterSpacing: '0.15em', color: T.textDim, marginTop: 6 }}>LOCKED IN</div>
          {result.recap && <div style={{ fontSize: 13, color: T.textMid, marginTop: 10, lineHeight: 1.6 }}>{result.recap}</div>}
        </div>
      )}
    </div>
  )
}
