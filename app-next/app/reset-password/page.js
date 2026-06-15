'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [done, setDone] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Supabase puts the recovery token in the URL hash — it auto-processes on load
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleReset = async (e) => {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords don\'t match.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setDone(true)
      setTimeout(() => router.push('/'), 2000)
    }
  }

  const inputStyle = {
    background: '#111', border: '1px solid #222', borderRadius: 6,
    padding: '14px 16px', fontSize: 14, color: '#fff', outline: 'none',
    fontFamily: "'DM Sans', sans-serif", width: '100%',
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0e141c',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus { border-color: rgba(71,255,232,0.4) !important; }
        input::placeholder { color: #333; }
      `}</style>

      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.22em', color: '#fff', fontWeight: 500 }}>
            ONE PERCENT
          </div>
        </div>

        {done ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 16 }}>✓</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
              Password updated. Redirecting…
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
              SET NEW PASSWORD
            </div>
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={inputStyle}
              autoComplete="new-password"
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleReset(e)}
              style={inputStyle}
              autoComplete="new-password"
            />
            {error && (
              <div style={{ fontSize: 12, color: '#ff6b6b', fontFamily: "'DM Mono', monospace", letterSpacing: '0.04em' }}>
                {error}
              </div>
            )}
            <button
              onClick={handleReset}
              disabled={!password || !confirm || loading}
              style={{
                background: '#47FFE8', color: '#0A0A0A', border: 'none', borderRadius: 6,
                padding: '14px', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em',
                cursor: password && confirm && !loading ? 'pointer' : 'not-allowed',
                opacity: password && confirm && !loading ? 1 : 0.4,
                fontFamily: "'DM Mono', monospace", width: '100%',
              }}
            >
              {loading ? 'UPDATING...' : 'UPDATE PASSWORD →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
