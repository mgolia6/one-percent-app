'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// Three learning-focused moves: recall, recognize (AI guides), distill a keeper.
// Fixed client-side so the exercise is always three turns (predictable cost).
const MOVES = [
  (c) => `In your own words — what is **${c}**, and why does it matter?`,
  () => `Can you think of an example of this in action — where it shows up, or where it could come in handy?`,
  (c) => `Last one: if you kept a single sentence about **${c}** — the thing you don't want to forget — what's the keeper?`,
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
  const [result, setResult] = useState(null) // { score, recap, hook, keeperOk, theirKeeper, suggested }
  const [keeperDraft, setKeeperDraft] = useState('')
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

    // Moves 1 & 2 — stream a short coaching reply, then advance.
    if (idx < MOVES.length - 1) {
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
        coaching = "Good — that's the kind of thinking that makes it stick."
      }
      setStreamingText('')
      setTurns((t) => [...t, { role: 'assistant', content: coaching }])
      moveIndex.current = idx + 1
      setTurns((t) => [...t, { role: 'assistant', content: MOVES[idx + 1](concept) }])
      setBusy(false)
      setTimeout(() => inputRef.current?.focus(), 100)
      return
    }

    // Final move (the keeper) — close out: score + memory hook + keeper check.
    let r = { score: 3, recap: '', hook: '', keeper_ok: true, keeper_suggested: answer }
    try {
      const res = await fetch('/api/lock-it-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'close', entry, qa: qa.current }),
      })
      const data = await res.json()
      if (data && typeof data.score === 'number') r = data
    } catch {
      // close unreachable — keep their keeper, pass.
    }
    const theirKeeper = answer
    const suggested = r.keeper_suggested || theirKeeper
    setResult({ score: r.score, recap: r.recap, hook: r.hook, keeperOk: r.keeper_ok !== false, theirKeeper, suggested })
    setKeeperDraft(r.keeper_ok !== false ? theirKeeper : suggested)
    setFinished(true)
    setBusy(false)
  }, [input, busy, finished, entry, concept])

  // Continue — record the (approved) keeper and advance to the post-entry flow.
  const finish = () => {
    if (!result) return
    const keeper = (keeperDraft || '').trim() || result.theirKeeper
    if (onComplete) onComplete({ score: result.score, answers: { mode: 'chat', keeper } })
  }

  const eq = (a, b) => (a || '').trim() === (b || '').trim()

  return (
    <div>
      <style>{`
        @keyframes liType{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1)}}
        .li-input::placeholder{color:${T.textFaint}}
        .li-input:focus{outline:none;border-color:${accent}66}
      `}</style>

      <div style={{ fontSize: 11, color: T.textDim, lineHeight: 1.6, marginBottom: 16 }}>
        A short back-and-forth to lock the concept in. Answer in your own words.
        {onSwitch && qa.current.length === 0 && (
          <button onClick={onSwitch} style={{ background: 'none', border: 'none', color: accent, cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: "'Inter',sans-serif", marginLeft: 8, padding: 0 }}>
            Prefer the quiz?
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
            className="li-input"
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

      {/* Result: score + memory hook + keeper sharpen */}
      {finished && result && (
        <div>
          <div className="op-score-box op-score-close" style={{ border: `2px solid ${result.score === 3 ? accent : '#606060'}` }}>
            <div style={{ fontSize: 36, fontWeight: 500, color: result.score === 3 ? accent : '#ccc' }}>{result.score}/3</div>
            <div style={{ fontSize: 13, letterSpacing: '0.15em', color: T.textDim, marginTop: 6 }}>LOCKED IN</div>
            {result.recap && <div style={{ fontSize: 13, color: T.textMid, marginTop: 10, lineHeight: 1.6 }}>{result.recap}</div>}
          </div>

          {/* Memory hook (AI-offered association/image) */}
          {result.hook && (
            <div style={{ background: `${accent}0d`, border: `1px solid ${accent}33`, borderRadius: 8, padding: '14px 16px', marginTop: 12 }}>
              <div style={{ fontSize: 9, letterSpacing: '0.14em', fontWeight: 700, color: accent, marginBottom: 6 }}>🧠 MAKE IT STICK</div>
              <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6 }}>{result.hook}</div>
            </div>
          )}

          {/* Keeper — accuracy-checked, learner-approved before it's saved */}
          <div style={{ background: T.surface, border: `1px solid ${T.surfaceBorder}`, borderRadius: 8, padding: '14px 16px', marginTop: 12 }}>
            <div style={{ fontSize: 9, letterSpacing: '0.14em', fontWeight: 700, color: T.textDim, marginBottom: 8 }}>YOUR KEEPER — saved to revisit</div>
            {!result.keeperOk && (
              <div style={{ fontSize: 11, color: accent, marginBottom: 8, lineHeight: 1.5 }}>
                Tightened this so what you revisit later is accurate — edit it to sound like you.
              </div>
            )}
            <textarea
              className="li-input"
              value={keeperDraft}
              onChange={(e) => setKeeperDraft(e.target.value)}
              rows={2}
              style={{
                width: '100%', background: T.quizOpt, border: `1px solid ${T.borderMid}`, borderRadius: 6,
                padding: '10px 12px', fontSize: 14, color: T.text, fontFamily: "'Inter',sans-serif",
                resize: 'none', lineHeight: 1.5,
              }}
            />
            {!eq(result.suggested, result.theirKeeper) && (
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button onClick={() => setKeeperDraft(result.theirKeeper)} style={{
                  flex: 1, background: eq(keeperDraft, result.theirKeeper) ? `${accent}22` : 'none',
                  border: `1px solid ${eq(keeperDraft, result.theirKeeper) ? accent : T.borderMid}`,
                  borderRadius: 6, padding: '8px', fontSize: 11, fontWeight: 600, color: T.textMid,
                  cursor: 'pointer', fontFamily: "'Inter',sans-serif",
                }}>Your version</button>
                <button onClick={() => setKeeperDraft(result.suggested)} style={{
                  flex: 1, background: eq(keeperDraft, result.suggested) ? `${accent}22` : 'none',
                  border: `1px solid ${eq(keeperDraft, result.suggested) ? accent : T.borderMid}`,
                  borderRadius: 6, padding: '8px', fontSize: 11, fontWeight: 600, color: T.textMid,
                  cursor: 'pointer', fontFamily: "'Inter',sans-serif",
                }}>Sharper version</button>
              </div>
            )}
          </div>

          <button onClick={finish} disabled={!keeperDraft.trim()} style={{
            width: '100%', marginTop: 16, background: keeperDraft.trim() ? accent : T.quizOpt, color: '#0A0A0A',
            border: 'none', borderRadius: 6, padding: '13px', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em',
            cursor: keeperDraft.trim() ? 'pointer' : 'default', fontFamily: "'Inter',sans-serif",
          }}>
            LOCK IT IN →
          </button>
        </div>
      )}
    </div>
  )
}
