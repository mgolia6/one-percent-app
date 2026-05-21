'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

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

  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

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

        {/* Title block */}
        <div style={{ background: '#111', borderRadius: 10, padding: '28px', marginBottom: 16 }}>
          <div style={{ fontSize: 9, color: '#47FFE8', letterSpacing: '0.18em', fontWeight: 600, marginBottom: 10 }}>WHAT'S NEW</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: 10 }}>
            Changelog
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
            Everything that's shipped, in plain English. No jargon, no commit hashes — just what changed and why it matters.
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
              <div
                key={entry.id}
                style={{ background: '#1e1e1e', borderRadius: 10, padding: '20px 24px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {entry.version && (
                      <span style={{ fontSize: 9, background: '#47FFE818', color: '#47FFE8', border: '1px solid #47FFE833', borderRadius: 3, padding: '2px 7px', letterSpacing: '0.1em', fontWeight: 600 }}>
                        v{entry.version}
                      </span>
                    )}
                    {i === 0 && (
                      <span style={{ fontSize: 9, background: '#E8FF4718', color: '#E8FF47', border: '1px solid #E8FF4733', borderRadius: 3, padding: '2px 7px', letterSpacing: '0.1em', fontWeight: 600 }}>
                        LATEST
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                    {formatDate(entry.created_at)}
                  </div>
                </div>
                <div style={{ fontSize: 13, color: '#fff', fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 8 }}>
                  {entry.title}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
                  {entry.description}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
