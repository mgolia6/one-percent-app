'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [message, setMessage] = useState(null)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (error) {
      console.error('Profile load error:', error)
      setLoading(false)
      return
    }

    if (data) {
      setProfile(data)
      setFirstName(data.first_name || '')
      setLastName(data.last_name || '')
      setEmail(data.email || user.email || '')
    }

    setLoading(false)
  }

  const handleSave = async () => {
    if (!profile) return

    setSaving(true)
    setMessage(null)

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: firstName.trim() || null,
        last_name: lastName.trim() || null,
      })
      .eq('id', profile.id)

    if (error) {
      console.error('Profile update error:', error)
      setMessage({ type: 'error', text: 'Update failed — try again' })
      setSaving(false)
      return
    }

    setMessage({ type: 'success', text: 'Saved' })
    setSaving(false)

    // Reload to show updated data
    setTimeout(() => {
      loadProfile()
      setMessage(null)
    }, 1500)
  }

  const handleSignOut = async () => {
    setSigningOut(true)
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 13, color: '#333', letterSpacing: '0.1em' }}>LOADING...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ fontSize: 13, color: '#f87171', marginBottom: 20, letterSpacing: '0.08em' }}>No profile found</div>
        <button onClick={() => router.push('/')} style={{ background: '#E8FF47', color: '#0A0A0A', border: 'none', borderRadius: 3, padding: '10px 20px', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', cursor: 'pointer' }}>
          BACK TO LIBRARY
        </button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: "'Inter',sans-serif", color: '#fff' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '40px 24px' }}>
        
        {/* Back button */}
        <button onClick={() => router.push('/')} style={{ background: 'none', border: '1px solid #1a1a1a', borderRadius: 3, padding: '6px 12px', fontSize: 10, color: '#555', cursor: 'pointer', letterSpacing: '0.1em', fontFamily: "'Inter',sans-serif", marginBottom: 32 }}>
          ← BACK
        </button>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 28, fontWeight: 600, color: '#fff', marginBottom: 8, letterSpacing: '-0.01em' }}>Profile</div>
          <div style={{ fontSize: 13, color: '#666', lineHeight: 1.6 }}>Update your account details</div>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* First Name */}
          <div>
            <label style={{ display: 'block', fontSize: 11, color: '#888', letterSpacing: '0.08em', marginBottom: 8, fontWeight: 500 }}>FIRST NAME</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter first name"
              style={{
                width: '100%',
                background: '#111',
                border: '1px solid #1a1a1a',
                borderRadius: 4,
                padding: '12px 14px',
                fontSize: 15,
                color: '#fff',
                fontFamily: "'Inter',sans-serif",
                outline: 'none',
              }}
            />
          </div>

          {/* Last Name */}
          <div>
            <label style={{ display: 'block', fontSize: 11, color: '#888', letterSpacing: '0.08em', marginBottom: 8, fontWeight: 500 }}>LAST NAME</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter last name"
              style={{
                width: '100%',
                background: '#111',
                border: '1px solid #1a1a1a',
                borderRadius: 4,
                padding: '12px 14px',
                fontSize: 15,
                color: '#fff',
                fontFamily: "'Inter',sans-serif",
                outline: 'none',
              }}
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label style={{ display: 'block', fontSize: 11, color: '#888', letterSpacing: '0.08em', marginBottom: 8, fontWeight: 500 }}>EMAIL</label>
            <input
              type="email"
              value={email}
              readOnly
              style={{
                width: '100%',
                background: '#0a0a0a',
                border: '1px solid #141414',
                borderRadius: 4,
                padding: '12px 14px',
                fontSize: 15,
                color: '#555',
                fontFamily: "'Inter',sans-serif",
                outline: 'none',
                cursor: 'not-allowed',
              }}
            />
            <div style={{ fontSize: 11, color: '#444', marginTop: 6, letterSpacing: '0.02em' }}>Email cannot be changed</div>
          </div>

          {/* Message */}
          {message && (
            <div style={{
              fontSize: 12,
              color: message.type === 'success' ? '#4ade80' : '#f87171',
              textAlign: 'center',
              padding: '10px',
              background: message.type === 'success' ? '#4ade8011' : '#f8717111',
              borderRadius: 4,
              letterSpacing: '0.05em',
            }}>
              {message.text}
            </div>
          )}

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              width: '100%',
              background: '#E8FF47',
              color: '#0A0A0A',
              border: 'none',
              borderRadius: 4,
              padding: '14px',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.1em',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: "'Inter',sans-serif",
              opacity: saving ? 0.5 : 1,
            }}
          >
            {saving ? 'SAVING...' : 'SAVE CHANGES'}
          </button>

          {/* Divider */}
          <div style={{ borderTop: '1px solid #141414', margin: '20px 0' }} />

          {/* Sign out button */}
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            style={{
              width: '100%',
              background: 'none',
              color: '#f87171',
              border: '1px solid #2a1a1e',
              borderRadius: 4,
              padding: '12px',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.08em',
              cursor: signingOut ? 'default' : 'pointer',
              fontFamily: "'Inter',sans-serif",
              opacity: signingOut ? 0.5 : 1,
            }}
          >
            {signingOut ? 'SIGNING OUT...' : 'SIGN OUT'}
          </button>

        </div>
      </div>
    </div>
  )
}
