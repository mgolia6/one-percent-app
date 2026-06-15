'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const ACCENT = '#C847FF' // default — overridden by entry accent

function SourcePills({ sources }) {
  if (!sources?.length) return null
  return (
    <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      <span style={{ fontSize: 8, color: 'rgba(232,238,245,0.3)', letterSpacing: '0.14em', fontFamily: "'DM Mono', monospace", alignSelf: 'center', flexShrink: 0 }}>SOURCES</span>
      {sources.map((s, i) => (
        <a
          key={i}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '4px 10px', borderRadius: 100,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: 9, color: 'rgba(232,238,245,0.5)',
            fontFamily: "'DM Mono', monospace", letterSpacing: '0.06em',
            textDecoration: 'none', whiteSpace: 'nowrap',
            transition: 'border-color 0.15s, color 0.15s',
          }}
        >
          [{i + 1}] {s.label.split('—')[0].trim().slice(0, 28)}{s.label.length > 28 ? '…' : ''}
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      ))}
    </div>
  )
}

function Message({ role, content, accent }) {
  const isUser = role === 'user'
  // Highlight [source flags] in assistant messages
  const renderContent = (text) => {
    const flagPattern = /(\[This goes beyond the verified sources[^\]]*\]|This goes beyond the verified sources[^.]+\.)/g
    const parts = text.split(flagPattern)
    return parts.map((part, i) =>
      flagPattern.test(part)
        ? <span key={i} style={{ color: '#FF8C47', fontSize: 11, fontStyle: 'italic' }}>{part}</span>
        : part
    )
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      padding: '4px 16px',
      marginBottom: 4,
    }}>
      <div style={{
        maxWidth: '85%',
        padding: isUser ? '10px 14px' : '12px 14px',
        borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
        background: isUser ? (accent || ACCENT) + '22' : 'rgba(255,255,255,0.05)',
        border: isUser ? `1px solid ${accent || ACCENT}44` : '1px solid rgba(255,255,255,0.07)',
        fontSize: 13,
        color: 'rgba(232,238,245,0.88)',
        lineHeight: 1.65,
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 300,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {isUser ? content : renderContent(content)}
      </div>
    </div>
  )
}

function TypingIndicator({ accent }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '4px 16px', marginBottom: 4 }}>
      <div style={{
        padding: '12px 16px', borderRadius: '14px 14px 14px 4px',
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', gap: 5,
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 5, height: 5, borderRadius: '50%',
            background: accent || ACCENT,
            animation: `dcPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  )
}

function SuggestedPrompts({ onSelect, accent }) {
  const prompts = [
    'Can you give me a real example of this in action?',
    'How does this connect to what I\'ve already learned?',
    'What\'s the strongest argument against this?',
    'How do I apply this to my actual work?',
  ]
  return (
    <div style={{ padding: '8px 16px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: 8, color: 'rgba(232,238,245,0.25)', letterSpacing: '0.14em', fontFamily: "'DM Mono', monospace", marginBottom: 2 }}>EXPLORE</div>
      {prompts.map(p => (
        <button key={p} onClick={() => onSelect(p)} style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 8, padding: '9px 12px', textAlign: 'left',
          fontSize: 12, color: 'rgba(232,238,245,0.55)',
          fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
          transition: 'border-color 0.15s, color 0.15s',
        }}>
          {p}
        </button>
      ))}
    </div>
  )
}

export default function DeepCut({ entry, userContext, onClose }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [visible, setVisible] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const accent = entry?.accent || ACCENT

  useEffect(() => {
    setTimeout(() => setVisible(true), 20)
    // Seed with the ai_prompt as first exchange
    if (entry?.ai_prompt) {
      const seedMsg = entry.ai_prompt.replace(/\[describe your situation\]/gi, '').replace(/\[state your position\]/gi, '').trim()
      const intro = [
        {
          role: 'assistant',
          content: `You've just studied **${entry.concept}**. I'm Deep Cut — ask me anything about it.\n\nI'm grounded in the verified sources for this entry${entry.sources?.length ? ` (${entry.sources.length} below)` : ''}. If you ask something outside them, I'll tell you.\n\nWant to start with the built-in prompt for this concept, or jump straight to a question?`
        }
      ]
      setMessages(intro)
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText])

  const send = useCallback(async (text) => {
    const userMsg = text || input.trim()
    if (!userMsg || streaming) return
    setInput('')
    setShowSuggestions(false)

    const newMessages = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setStreaming(true)
    setStreamingText('')

    try {
      // Only send user/assistant turns to the API (not our seeded assistant intro)
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }))

      const res = await fetch('/api/deep-cut', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          entry,
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
        const chunk = decoder.decode(value, { stream: true })
        full += chunk
        setStreamingText(full)
      }

      setMessages(prev => [...prev, { role: 'assistant', content: full }])
      setStreamingText('')
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Something went wrong on my end. Try again.'
      }])
    } finally {
      setStreaming(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [input, messages, streaming, entry, userContext])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 300)
  }

  const useAiPrompt = () => {
    setInput(entry.ai_prompt)
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  return (
    <>
      <style>{`
        @keyframes dcPulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }
        .dc-input::placeholder { color: rgba(232,238,245,0.2); }
        .dc-input:focus { outline: none; }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 201,
        maxWidth: 430, margin: '0 auto',
        height: '92dvh',
        background: '#0e141c',
        borderRadius: '20px 20px 0 0',
        border: '1px solid rgba(255,255,255,0.08)',
        borderBottom: 'none',
        display: 'flex', flexDirection: 'column',
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)',
        overflow: 'hidden',
      }}>

        {/* Header */}
        <div style={{
          padding: '14px 16px 12px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
        }}>
          {/* Accent dot */}
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: accent, flexShrink: 0, boxShadow: `0 0 8px ${accent}88` }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#e8eef5', letterSpacing: '-0.01em' }}>
              DEEP CUT
            </div>
            <div style={{ fontSize: 10, color: 'rgba(232,238,245,0.35)', fontFamily: "'DM Mono', monospace", letterSpacing: '0.06em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {entry?.concept?.toUpperCase()} · {entry?.category?.toUpperCase()}
            </div>
          </div>
          {/* Use AI Prompt button */}
          {entry?.ai_prompt && (
            <button onClick={useAiPrompt} style={{
              background: `${accent}18`, border: `1px solid ${accent}44`,
              borderRadius: 6, padding: '5px 10px',
              fontSize: 8, color: accent, fontFamily: "'DM Mono', monospace",
              letterSpacing: '0.1em', cursor: 'pointer', flexShrink: 0,
              whiteSpace: 'nowrap',
            }}>
              USE PROMPT
            </button>
          )}
          <button onClick={handleClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(232,238,245,0.35)', fontSize: 20, lineHeight: 1,
            padding: '2px 4px', flexShrink: 0,
          }}>×</button>
        </div>

        {/* Sources */}
        <SourcePills sources={entry?.sources} />

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', paddingTop: 12, paddingBottom: 4 }}>
          {messages.map((m, i) => (
            <Message key={i} role={m.role} content={m.content} accent={accent} />
          ))}
          {streaming && streamingText && (
            <Message role="assistant" content={streamingText} accent={accent} />
          )}
          {streaming && !streamingText && <TypingIndicator accent={accent} />}
          {showSuggestions && !streaming && messages.length <= 1 && (
            <SuggestedPrompts onSelect={send} accent={accent} />
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: '10px 12px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0,
          display: 'flex', gap: 8, alignItems: 'flex-end',
        }}>
          <textarea
            ref={inputRef}
            className="dc-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
            }}
            placeholder="Ask anything about this concept…"
            rows={1}
            style={{
              flex: 1, background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12, padding: '10px 14px',
              fontSize: 13, color: '#e8eef5',
              fontFamily: "'DM Sans', sans-serif",
              resize: 'none', maxHeight: 120, overflow: 'auto',
              lineHeight: 1.5,
            }}
            onInput={e => {
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
            }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || streaming}
            style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: input.trim() && !streaming ? accent : 'rgba(255,255,255,0.06)',
              border: 'none', cursor: input.trim() && !streaming ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={input.trim() && !streaming ? '#0a1420' : 'rgba(232,238,245,0.2)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5"/>
              <polyline points="5 12 12 5 19 12"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
