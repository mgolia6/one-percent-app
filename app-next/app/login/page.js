'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/` }
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSent(true)
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0A0A0A', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter',sans-serif", padding: '24px'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.2em', color: '#fff', fontWeight: 600, marginBottom: 8 }}>ONE PERCENT</div>
          <div style={{ fontSize: 13, color: '#555', letterSpacing: '0.05em' }}>Daily micro-learning · Beta</div>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 16 }}>✉️</div>
            <div style={{ fontSize: 15, color: '#bbb', lineHeight: 1.7, marginBottom: 8 }}>
              Check your email
            </div>
            <div style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>
              We sent a magic link to <span style={{ color: '#fff' }}>{email}</span>.<br />
              Click it to sign in — no password needed.
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 14, color: '#888', lineHeight: 1.7, marginBottom: 28, textAlign: 'center' }}>
              Enter your email to get a magic link.<br />No password. No friction.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin(e)}
                style={{
                  background: '#111', border: '1px solid #222', borderRadius: 4,
                  padding: '14px 16px', fontSize: 14, color: '#fff', outline: 'none',
                  fontFamily: "'Inter',sans-serif", width: '100%'
                }}
              />
              <button
                onClick={handleLogin}
                disabled={!email || loading}
                style={{
                  background: '#47FFE8', color: '#0A0A0A', border: 'none', borderRadius: 4,
                  padding: '14px', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em',
                  cursor: email && !loading ? 'pointer' : 'not-allowed',
                  opacity: email && !loading ? 1 : 0.4,
                  fontFamily: "'Inter',sans-serif"
                }}
              >
                {loading ? 'SENDING...' : 'SEND MAGIC LINK'}
              </button>
            </div>
            {error && <div style={{ fontSize: 12, color: '#f87171', marginTop: 12, textAlign: 'center' }}>{error}</div>}
          </div>
        )}
      </div>
    </div>
  )
}
