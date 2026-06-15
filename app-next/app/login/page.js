'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState('login') // 'login' | 'forgot' | 'forgot-sent'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Incorrect email or password.')
      setLoading(false)
    } else {
      router.push('/')
    }
  }

  const handleForgot = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setMode('forgot-sent')
      setLoading(false)
    }
  }

  const inputStyle = {
    background: '#111',
    border: '1px solid #222',
    borderRadius: 6,
    padding: '14px 16px',
    fontSize: 14,
    color: '#fff',
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
    width: '100%',
    transition: 'border-color 0.15s',
  }

  const btnStyle = (active) => ({
    background: '#47FFE8',
    color: '#0A0A0A',
    border: 'none',
    borderRadius: 6,
    padding: '14px',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.12em',
    cursor: active ? 'pointer' : 'not-allowed',
    opacity: active ? 1 : 0.4,
    fontFamily: "'DM Mono', monospace",
    width: '100%',
    transition: 'opacity 0.15s',
  })

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0e141c',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus { border-color: rgba(71,255,232,0.4) !important; }
        input::placeholder { color: #333; }
      `}</style>

      <div style={{ width: '100%', maxWidth: 380 }}>

        {/* Wordmark */}
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11, letterSpacing: '0.22em',
            color: '#fff', fontWeight: 500, marginBottom: 8
          }}>ONE PERCENT</div>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10, letterSpacing: '0.14em',
            color: 'rgba(255,255,255,0.25)'
          }}>CLOSED BETA</div>
        </div>

        {/* LOGIN */}
        {mode === 'login' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin(e)}
              style={inputStyle}
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin(e)}
              style={inputStyle}
              autoComplete="current-password"
            />
            {error && (
              <div style={{
                fontSize: 12, color: '#ff6b6b',
                fontFamily: "'DM Mono', monospace",
                letterSpacing: '0.04em'
              }}>{error}</div>
            )}
            <button
              onClick={handleLogin}
              disabled={!email || !password || loading}
              style={btnStyle(email && password && !loading)}
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN →'}
            </button>
            <button
              onClick={() => { setMode('forgot'); setError(null) }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: "'DM Mono', monospace",
                fontSize: 10, letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.3)',
                marginTop: 4, padding: '6px 0',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}
            >
              Forgot password?
            </button>
          </div>
        )}

        {/* FORGOT PASSWORD */}
        {mode === 'forgot' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13, color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.6, marginBottom: 6
            }}>
              Enter your email and we'll send a reset link.
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleForgot(e)}
              style={inputStyle}
              autoComplete="email"
            />
            {error && (
              <div style={{
                fontSize: 12, color: '#ff6b6b',
                fontFamily: "'DM Mono', monospace",
                letterSpacing: '0.04em'
              }}>{error}</div>
            )}
            <button
              onClick={handleForgot}
              disabled={!email || loading}
              style={btnStyle(email && !loading)}
            >
              {loading ? 'SENDING...' : 'SEND RESET LINK →'}
            </button>
            <button
              onClick={() => { setMode('login'); setError(null) }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: "'DM Mono', monospace",
                fontSize: 10, letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.3)',
                marginTop: 4, padding: '6px 0',
              }}
              onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}
            >
              ← Back to sign in
            </button>
          </div>
        )}

        {/* FORGOT SENT */}
        {mode === 'forgot-sent' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 16 }}>✉️</div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14, color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.7, marginBottom: 8
            }}>
              Reset link sent to<br />
              <span style={{ color: '#47FFE8' }}>{email}</span>
            </div>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10, color: 'rgba(255,255,255,0.25)',
              letterSpacing: '0.06em', marginBottom: 28
            }}>
              Check your inbox — link expires in 1 hour.
            </div>
            <button
              onClick={() => setMode('login')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: "'DM Mono', monospace",
                fontSize: 10, letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.3)',
              }}
            >
              ← Back to sign in
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
