'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function ChangelogEntry({ entry, defaultOpen, isLatest }) {
  const [open, setOpen] = useState(defaultOpen)
  const bullets = entry.description.split('\n').filter(l => l.trim())

  // One-line summary: first bullet, stripped of bullet char
  const summary = bullets[0]?.replace(/^•\s*/, '') || ''

  const formatDate = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div style={{
      background: '#111',
      border: `1px solid ${isLatest ? '#E8FF4733' : '#1a1a1a'}`,
      borderRadius: 10,
      overflow: 'hidden',
    }}>
      {/* Header — always visible, tappable */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{ padding: '18px 22px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
      >
        {/* Version badge */}
        <div style={{
          fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
          color: isLatest ? '#E8FF47' : 'rgba(255,255,255,0.62)',
          background: isLatest ? '#E8FF4711' : '#1a1a1a',
          border: `1px solid ${isLatest ? '#E8FF4733' : '#222'}`,
          borderRadius: 3, padding: '2px 7px', flexShrink: 0,
          fontFamily: "'Inter',sans-serif",
        }}>
          v{entry.version}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: 500,
            color: isLatest ? '#fff' : '#bbb',
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {entry.title}
          </div>
          {!open && (
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', marginTop: 3, letterSpacing: '0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {summary}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {isLatest && (
            <div style={{
              fontSize: 8, fontWeight: 700, letterSpacing: '0.12em',
              color: '#0a0a0a', background: '#E8FF47',
              borderRadius: 3, padding: '2px 6px',
              fontFamily: "'Inter',sans-serif",
            }}>NEW</div>
          )}
          <div style={{
            fontSize: 10, color: 'rgba(255,255,255,0.55)',
            transition: 'transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}>▾</div>
        </div>
      </div>

      {/* Expanded content */}
      {open && (
        <div style={{ borderTop: '1px solid #1a1a1a', padding: '14px 22px 20px' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.62)', letterSpacing: '0.08em', marginBottom: 14 }}>
            {formatDate(entry.created_at)}
          </div>
          {bullets.map((line, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
              <div style={{ color: '#E8FF47', fontSize: 10, marginTop: 3, flexShrink: 0 }}>•</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
                {line.replace(/^•\s*/, '')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ChangelogPage() {
  const router = useRouter()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('changelog')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
      if (!error && data) setEntries(data)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0e141c', fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0;}`}</style>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px 80px' }}>

        {/* Header */}
        <div style={{ padding: '20px 0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, letterSpacing: '0.22em', fontWeight: 600, color: '#e8eef5', fontFamily: "'DM Mono', monospace" }}>ONE PERCENT</span>
          <button
            onClick={() => router.back()}
            style={{ background: '#1a1a1a', border: 'none', borderRadius: 6, padding: '7px 12px', fontSize: 9, color: '#bbb', cursor: 'pointer', letterSpacing: '0.08em', fontWeight: 400, fontFamily: "'Inter',sans-serif" }}
          >
            ← BACK
          </button>
        </div>

        {/* Title block */}
        <div style={{ background: '#111', borderRadius: 10, padding: '28px', marginBottom: 12 }}>
          <div style={{ fontSize: 9, color: '#47FFE8', letterSpacing: '0.18em', fontWeight: 600, marginBottom: 10 }}>WHAT'S NEW</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: 10 }}>
            Changelog
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
            Everything that's shipped, in plain English. Tap any version to expand.
          </div>
        </div>

        {/* Entries */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, fontSize: 11, color: '#888', letterSpacing: '0.1em' }}>LOADING...</div>
        ) : entries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, fontSize: 11, color: '#888', letterSpacing: '0.1em' }}>NOTHING YET</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {entries.map((entry, i) => (
              <ChangelogEntry
                key={entry.id}
                entry={entry}
                defaultOpen={i === 0}
                isLatest={i === 0}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
