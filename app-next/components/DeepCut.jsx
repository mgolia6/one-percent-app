'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const CAT_COLORS = ['#47FFE8','#E8FF47','#FF8C47','#C847FF','#FF4778','#47C8FF','#FF8C00']

const CAT_CONFIG = {
  'AI':                       '#47FFE8',
  'Sales Craft':              '#E8FF47',
  'Vocab & Language':         '#FF8C47',
  'Mental Models':            '#C847FF',
  'Philosophy':               '#FF4778',
  'Neuroscience & Cognition': '#47C8FF',
  'Communication':            '#FF8C00',
}

// ── FAB — circle, color cycling ──
export function DeepCutFAB({ onClick }) {
  const [colorIdx, setColorIdx] = useState(0)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true)
      setTimeout(() => {
        setColorIdx(i => (i + 1) % CAT_COLORS.length)
        setPulse(false)
      }, 400)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const color = CAT_COLORS[colorIdx]

  return (
    <div
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: 82,
        right: 16,
        width: 52, height: 52,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 4px 20px ${color}55, 0 2px 8px rgba(0,0,0,0.4)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', zIndex: 99,
        transition: 'background 0.6s ease, box-shadow 0.6s ease',
        userSelect: 'none',
      }}
    >
      {/* Pulse ring */}
      <div style={{
        position: 'absolute', inset: -6,
        borderRadius: '50%',
        border: `1.5px solid ${color}`,
        opacity: pulse ? 0 : 0.6,
        transform: pulse ? 'scale(1.3)' : 'scale(1)',
        transition: pulse
          ? 'transform 0.4s ease-out, opacity 0.4s ease-out'
          : 'none',
        pointerEvents: 'none',
      }} />
      {/* Scissors icon */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
        <line x1="20" y1="4" x2="8.12" y2="15.88"/>
        <line x1="14.47" y1="14.48" x2="20" y2="20"/>
        <line x1="8.12" y1="8.12" x2="12" y2="12"/>
      </svg>
    </div>
  )
}

// ── SOURCE PILLS ──
function SourcePills({ sources }) {
  if (!sources?.length) return null
  return (
    <div style={{ padding: '10px 16px 4px', display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center', flexShrink: 0 }}>
      <span style={{ fontSize: 8, color: 'rgba(232,238,245,0.25)', letterSpacing: '0.12em', fontFamily: "'DM Mono', monospace", flexShrink: 0 }}>SOURCES</span>
      {sources.map((s, i) => (
        <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 3,
          padding: '4px 9px', borderRadius: 100,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          fontSize: 8, color: 'rgba(232,238,245,0.35)',
          fontFamily: "'DM Mono', monospace", textDecoration: 'none', whiteSpace: 'nowrap',
        }}>
          [{i+1}] {s.label.slice(0, 22)}{s.label.length > 22 ? '…' : ''}
          <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      ))}
    </div>
  )
}

// ── MESSAGE ──
function Message({ role, content, accent }) {
  const isUser = role === 'user'
  const rendered = content
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(⚠[^<\n]+)/g, '<span style="color:#FF8C47;font-style:italic;">$1</span>')
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', padding: '3px 16px' }}>
      <div
        dangerouslySetInnerHTML={{ __html: rendered }}
        style={{
          maxWidth: '84%', padding: '11px 14px',
          fontSize: 13, lineHeight: 1.65, fontWeight: 300,
          color: 'rgba(232,238,245,0.88)',
          fontFamily: "'DM Sans', sans-serif",
          whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          background: isUser ? `${accent}18` : 'rgba(255,255,255,0.05)',
          border: isUser ? `1px solid ${accent}33` : '1px solid rgba(255,255,255,0.07)',
          borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
        }}
      />
    </div>
  )
}

// ── TYPING INDICATOR ──
function TypingIndicator({ accent }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '3px 16px' }}>
      <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px 14px 14px 4px', display: 'flex', alignItems: 'center', gap: 5 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: accent, animation: `dctype 1.2s ease-in-out ${i*0.2}s infinite` }} />
        ))}
      </div>
    </div>
  )
}

// ── ENTRY PICKER ──
function EntryPicker({ entries, onSelect, onBegin, selectedEntry }) {
  const [catFilter, setCatFilter] = useState('all')
  const cats = [
    { key: 'all', label: 'ALL', color: null },
    { key: 'AI', label: 'AI', color: '#47FFE8' },
    { key: 'Sales Craft', label: 'SALES', color: '#E8FF47' },
    { key: 'Mental Models', label: 'MENTAL MODELS', color: '#C847FF' },
    { key: 'Philosophy', label: 'PHILOSOPHY', color: '#FF4778' },
    { key: 'Vocab & Language', label: 'VOCAB', color: '#FF8C47' },
    { key: 'Neuroscience & Cognition', label: 'NEURO', color: '#47C8FF' },
    { key: 'Communication', label: 'COMM', color: '#FF8C00' },
  ]
  const visible = catFilter === 'all' ? entries : entries.filter(e => e.category === catFilter)

  return (
    <>
      {/* Picker scroll */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.18em', color: 'rgba(232,238,245,0.35)', marginBottom: 14 }}>
          WHAT DO YOU WANT TO GO DEEPER ON?
        </div>
        {/* Category chips */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none', marginBottom: 16 }}>
          {cats.map(c => (
            <button key={c.key} onClick={() => setCatFilter(c.key)} style={{
              fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.08em',
              padding: '5px 12px', borderRadius: 100, whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0,
              background: catFilter === c.key ? 'rgba(255,255,255,0.07)' : 'transparent',
              border: catFilter === c.key ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(255,255,255,0.09)',
              color: catFilter === c.key ? '#e8eef5' : (c.color || 'rgba(232,238,245,0.35)'),
              transition: 'all 0.15s',
            }}>
              {c.label}
            </button>
          ))}
        </div>
        {/* Entry list */}
        {visible.map(e => {
          const color = CAT_CONFIG[e.category] || '#fff'
          const isSelected = selectedEntry?.entry === e.entry
          return (
            <div key={e.entry} onClick={() => onSelect(e)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '13px 14px', borderRadius: 12, marginBottom: 7,
              background: isSelected ? `${color}0d` : 'rgba(255,255,255,0.03)',
              border: isSelected ? `1px solid ${color}44` : '1px solid rgba(255,255,255,0.06)',
              cursor: 'pointer', transition: 'background 0.15s, border-color 0.15s',
            }}>
              <div style={{ width: 3, alignSelf: 'stretch', minHeight: 36, borderRadius: 2, background: color, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#e8eef5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.concept}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(232,238,245,0.35)', marginTop: 3 }}>{e.category.toUpperCase()}</div>
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 700, color, flexShrink: 0 }}>
                {e.score != null ? `${e.score}/3` : ''}
              </div>
            </div>
          )
        })}
      </div>
      {/* Begin bar */}
      <div style={{ padding: '12px 16px 28px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <button
          onClick={onBegin}
          disabled={!selectedEntry}
          style={{
            width: '100%', padding: 15, borderRadius: 12, border: 'none',
            fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
            cursor: selectedEntry ? 'pointer' : 'default',
            background: selectedEntry ? (CAT_CONFIG[selectedEntry.category] || '#fff') : 'rgba(255,255,255,0.05)',
            color: selectedEntry ? '#0a0a0a' : 'rgba(232,238,245,0.2)',
            boxShadow: selectedEntry ? `0 4px 20px ${CAT_CONFIG[selectedEntry.category] || '#fff'}44` : 'none',
            transition: 'all 0.25s',
          }}
        >
          {selectedEntry ? `GO DEEP ON "${selectedEntry.concept}" →` : 'SELECT A CONCEPT ABOVE'}
        </button>
      </div>
    </>
  )
}

// ── MAIN DEEP CUT COMPONENT ──
export default function DeepCut({ entries, todayEntry, completions, userContext, onClose }) {
  const [visible, setVisible] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [chatActive, setChatActive] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [orbColor, setOrbColor] = useState(CAT_COLORS[0])
  const [orbIdx, setOrbIdx] = useState(0)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Completed entries only, most recent first
  const completedEntries = entries.filter(e => completions[e.entry])

  // Orb cycles with FAB color
  useEffect(() => {
    setTimeout(() => setVisible(true), 20)
    const interval = setInterval(() => {
      setOrbIdx(i => {
        const next = (i + 1) % CAT_COLORS.length
        setOrbColor(CAT_COLORS[next])
        return next
      })
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText])

  const accent = selectedEntry ? (CAT_CONFIG[selectedEntry.category] || '#C847FF') : orbColor

  const beginChat = () => {
    if (!selectedEntry) return
    setChatActive(true)
    setMessages([{
      role: 'assistant',
      content: `You studied **${selectedEntry.concept}**${selectedEntry.score != null ? ` and scored ${selectedEntry.score}/3` : ''}.\n\nI'm grounded in the verified sources for this entry. Ask me anything — or start with today's prompt.`,
    }])
    setShowSuggestions(true)
    setTimeout(() => inputRef.current?.focus(), 300)
  }

  const send = useCallback(async (text) => {
    const msg = text || input.trim()
    if (!msg || streaming) return
    setInput('')
    setShowSuggestions(false)

    const newMessages = [...messages, { role: 'user', content: msg }]
    setMessages(newMessages)
    setStreaming(true)
    setStreamingText('')

    try {
      const res = await fetch('/api/deep-cut', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          entry: selectedEntry,
          userContext,
        }),
      })
      if (!res.ok) throw new Error('API error')
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let full = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        full += decoder.decode(value, { stream: true })
        setStreamingText(full)
      }
      setMessages(prev => [...prev, { role: 'assistant', content: full }])
      setStreamingText('')
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong — try again.' }])
    } finally {
      setStreaming(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [input, messages, streaming, selectedEntry, userContext])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 320)
  }

  const backToPicker = () => {
    setChatActive(false)
    setMessages([])
    setShowSuggestions(true)
    setStreamingText('')
  }

  const todayAiPrompt = todayEntry?.ai_prompt || null

  return (
    <>
      <style>{`
        @keyframes dctype { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }
        .dc-textarea-el::placeholder { color: rgba(232,238,245,0.2); }
        .dc-textarea-el:focus { outline: none; }
        .dc-textarea-el { scrollbar-width: none; }
      `}</style>

      {/* Backdrop */}
      <div onClick={handleClose} style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)',
        opacity: visible ? 1 : 0, transition: 'opacity 0.3s ease',
      }} />

      {/* Drawer */}
      <div style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 201,
        maxWidth: 430, margin: '0 auto',
        height: '92dvh', background: '#070c12',
        borderRadius: '20px 20px 0 0',
        border: '1px solid rgba(255,255,255,0.1)', borderBottom: 'none',
        display: 'flex', flexDirection: 'column',
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.38s cubic-bezier(0.22,1,0.36,1)',
        overflow: 'hidden',
      }}>
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.12)', margin: '12px auto 0', flexShrink: 0 }} />

        {/* Header */}
        <div style={{ padding: '12px 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: orbColor, boxShadow: `0 0 8px ${orbColor}88`, flexShrink: 0, transition: 'background 0.6s ease, box-shadow 0.6s ease' }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#e8eef5', letterSpacing: '0.06em', fontFamily: "'DM Mono', monospace" }}>DEEP CUT</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(232,238,245,0.35)', letterSpacing: '0.1em', marginTop: 2 }}>
              {chatActive ? selectedEntry?.concept?.toUpperCase() : 'SELECT A CONCEPT TO EXPLORE'}
            </div>
          </div>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', color: 'rgba(232,238,245,0.35)', fontSize: 22, lineHeight: 1, cursor: 'pointer', padding: '2px 6px', marginLeft: 'auto' }}>×</button>
        </div>

        {/* PICKER STATE */}
        {!chatActive && (
          <EntryPicker
            entries={completedEntries}
            selectedEntry={selectedEntry}
            onSelect={setSelectedEntry}
            onBegin={beginChat}
          />
        )}

        {/* CHAT STATE */}
        {chatActive && (
          <>
            {/* Context pill */}
            <div onClick={backToPicker} style={{
              display: 'flex', alignItems: 'center', gap: 9,
              margin: '12px 16px 0', padding: '9px 13px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 10, cursor: 'pointer', flexShrink: 0, transition: 'background 0.15s',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: 'rgba(232,238,245,0.25)', letterSpacing: '0.1em' }}>EXPLORING</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(232,238,245,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>{selectedEntry?.concept}</div>
              </div>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: accent, flexShrink: 0 }} />
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: 'rgba(232,238,245,0.3)', flexShrink: 0 }}>SWITCH ›</div>
            </div>

            {/* Sources */}
            <SourcePills sources={selectedEntry?.sources} />

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', paddingTop: 8, paddingBottom: 4 }}>
              {messages.map((m, i) => <Message key={i} role={m.role} content={m.content} accent={accent} />)}
              {streaming && streamingText && <Message role="assistant" content={streamingText} accent={accent} />}
              {streaming && !streamingText && <TypingIndicator accent={accent} />}

              {/* Suggestions */}
              {showSuggestions && !streaming && (
                <div style={{ padding: '6px 16px 10px' }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.14em', color: 'rgba(232,238,245,0.25)', marginBottom: 8 }}>EXPLORE</div>

                  {/* Today's ai_prompt — first, visually distinct */}
                  {todayAiPrompt && selectedEntry?.entry === todayEntry?.number && (
                    <button onClick={() => send(todayAiPrompt)} style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '11px 14px', borderRadius: 10, marginBottom: 8, border: 'none',
                      background: `${accent}12`, border: `1px solid ${accent}33`,
                      fontSize: 12, color: 'rgba(232,238,245,0.7)', lineHeight: 1.55,
                      fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic', cursor: 'pointer',
                    }}>
                      <span style={{
                        fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: '0.12em',
                        fontWeight: 700, fontStyle: 'normal', display: 'inline-block',
                        padding: '2px 6px', borderRadius: 3, marginRight: 7,
                        background: `${accent}22`, color: accent, verticalAlign: 'middle',
                      }}>TODAY'S PROMPT</span>
                      {todayAiPrompt.slice(0, 120)}{todayAiPrompt.length > 120 ? '…' : ''}
                    </button>
                  )}

                  {/* Standard prompts */}
                  {[
                    'Can you give me a real example of this in action?',
                    'How does this connect to what I\'ve already learned?',
                    'What\'s the strongest argument against this?',
                    'How do I apply this to my actual work right now?',
                  ].map(p => (
                    <button key={p} onClick={() => send(p)} style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '10px 13px', borderRadius: 9, marginBottom: 6,
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                      fontSize: 12, color: 'rgba(232,238,245,0.45)',
                      fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
                    }}>
                      {p}
                    </button>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '10px 12px 28px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0, display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <textarea
                ref={inputRef}
                className="dc-textarea-el"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                placeholder="Ask anything about this concept…"
                rows={1}
                style={{
                  flex: 1, background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12, padding: '10px 14px',
                  fontSize: 13, color: '#e8eef5',
                  fontFamily: "'DM Sans', sans-serif",
                  resize: 'none', maxHeight: 120, overflow: 'auto', lineHeight: 1.5,
                }}
                onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px' }}
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || streaming}
                style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0, border: 'none',
                  background: input.trim() && !streaming ? accent : 'rgba(255,255,255,0.06)',
                  cursor: input.trim() && !streaming ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={input.trim() && !streaming ? '#0a1420' : 'rgba(232,238,245,0.2)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
