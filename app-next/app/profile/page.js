'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Shield, Footprints, Target, Layers, Zap, Grid3X3, Flame, Gem, User } from 'lucide-react'

const CATEGORY_COLORS = {
  'AI': '#47FFE8',
  'Sales Craft': '#E8FF47',
  'Vocab & Language': '#FF8C47',
  'Mental Models': '#C847FF',
  'Philosophy': '#FF4778',
  'Neuroscience & Cognition': '#47C8FF',
  'Communication': '#FF8C00',
}

const ENTRIES = [
  { entry: '001', category: 'AI' },
  { entry: '002', category: 'Vocab & Language' },
  { entry: '003', category: 'Sales Craft' },
  { entry: '004', category: 'Mental Models' },
  { entry: '005', category: 'Philosophy' },
  { entry: '006', category: 'AI' },
  { entry: '007', category: 'Sales Craft' },
  { entry: '008', category: 'AI' },
  { entry: '009', category: 'Vocab & Language' },
  { entry: '010', category: 'Sales Craft' },
  { entry: '011', category: 'Mental Models' },
  { entry: '012', category: 'AI' },
  { entry: '013', category: 'Philosophy' },
  { entry: '014', category: 'Neuroscience & Cognition' },
  { entry: '015', category: 'Sales Craft' },
  { entry: '016', category: 'Communication' },
  { entry: '017', category: 'Sales Craft' },
  { entry: '018', category: 'AI' },
  { entry: '019', category: 'Vocab & Language' },
]

const BADGES = [
  // Founder
  { id: 'founder', label: "Founder's Club", desc: 'Beta tester from day one', icon: 'Shield', color: '#E8FF47', check: ({ profile }) => !!profile?.onboarding_complete, progress: null },
  // First entry
  { id: 'first_entry', label: 'First Step', desc: 'Complete your first entry', icon: 'Footprints', color: '#47FFE8', check: ({ completedCount }) => completedCount >= 1, progress: ({ completedCount }) => ({ value: Math.min(completedCount, 1), max: 1 }) },
  // First 3/3
  { id: 'perfect_score', label: 'Perfect Score', desc: 'Get 3/3 on a quiz', icon: 'Target', color: '#47FFE8', check: ({ completions }) => Object.values(completions).some(c => c.score === 3), progress: null },
  // 10 entries
  { id: 'ten_entries', label: 'Ten Deep', desc: 'Complete 10 entries', icon: 'Layers', color: '#C847FF', check: ({ completedCount }) => completedCount >= 10, progress: ({ completedCount }) => ({ value: Math.min(completedCount, 10), max: 10 }) },
  // 25 entries
  { id: 'twenty_five', label: 'Quarter Century', desc: 'Complete 25 entries', icon: 'Zap', color: '#C847FF', check: ({ completedCount }) => completedCount >= 25, progress: ({ completedCount }) => ({ value: Math.min(completedCount, 25), max: 25 }) },
  // All 7 categories
  { id: 'all_cats', label: 'Full Spectrum', desc: 'Complete at least one entry in every category', icon: 'Grid3X3', color: '#FF8C47', check: ({ catBreakdown }) => Object.keys(catBreakdown).length >= 7, progress: ({ catBreakdown }) => ({ value: Object.keys(catBreakdown).length, max: 7 }) },
  // 3-day streak
  { id: 'streak_3', label: '3-Day Streak', desc: 'Keep a 3-day streak', icon: 'Flame', color: '#FF8C47', check: ({ profile }) => (profile?.longest_streak || 0) >= 3, progress: ({ profile }) => ({ value: Math.min(profile?.longest_streak || 0, 3), max: 3 }) },
  // 7-day streak
  { id: 'streak_7', label: 'Week Strong', desc: 'Keep a 7-day streak', icon: 'Flame', color: '#FF4778', check: ({ profile }) => (profile?.longest_streak || 0) >= 7, progress: ({ profile }) => ({ value: Math.min(profile?.longest_streak || 0, 7), max: 7 }) },
  // 30-day streak
  { id: 'streak_30', label: 'Monthly', desc: 'Keep a 30-day streak', icon: 'Flame', color: '#FF4778', check: ({ profile }) => (profile?.longest_streak || 0) >= 30, progress: ({ profile }) => ({ value: Math.min(profile?.longest_streak || 0, 30), max: 30 }) },
  // Perfect week
  { id: 'perfect_week', label: 'Perfect Week', desc: '7 entries in 7 days', icon: 'Gem', color: '#47C8FF', check: ({ completedCount }) => completedCount >= 7, progress: null },
]

function StatCard({ label, value }) {
  return (
    <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 8, padding: '16px 14px', flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 10, color: '#888', letterSpacing: '0.1em', marginBottom: 6, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>{value}</div>
    </div>
  )
}

function CategoryBar({ category, completed, total }) {
  const color = CATEGORY_COLORS[category] || '#fff'
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
          <div style={{ fontSize: 11, color: '#aaa', letterSpacing: '0.02em' }}>{category}</div>
        </div>
        <div style={{ fontSize: 11, color: '#888' }}>{completed}/{total}</div>
      </div>
      <div style={{ height: 3, background: '#1a1a1a', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2, transition: 'width 0.4s ease' }} />
      </div>
    </div>
  )
}

function BadgeCard({ badge, earned, progressData }) {
  return (
    <div style={{
      background: earned ? '#111' : '#0a0a0a',
      border: `1px solid ${earned ? '#222' : '#141414'}`,
      borderRadius: 8,
      padding: '14px 12px',
      opacity: earned ? 1 : 0.5,
      transition: 'opacity 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: earned ? badge.color : '#444', flexShrink: 0 }}>
          {badge.icon === 'Shield' && <Shield size={20} strokeWidth={1.5} />}
          {badge.icon === 'Footprints' && <Footprints size={20} strokeWidth={1.5} />}
          {badge.icon === 'Target' && <Target size={20} strokeWidth={1.5} />}
          {badge.icon === 'Layers' && <Layers size={20} strokeWidth={1.5} />}
          {badge.icon === 'Zap' && <Zap size={20} strokeWidth={1.5} />}
          {badge.icon === 'Grid3X3' && <Grid3X3 size={20} strokeWidth={1.5} />}
          {badge.icon === 'Flame' && <Flame size={20} strokeWidth={1.5} />}
          {badge.icon === 'Gem' && <Gem size={20} strokeWidth={1.5} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: earned ? '#fff' : '#555', letterSpacing: '0.01em' }}>{badge.label}</div>
            {earned && <div style={{ fontSize: 9, background: badge.color + '22', color: badge.color, borderRadius: 3, padding: '1px 5px', letterSpacing: '0.08em', fontWeight: 600 }}>EARNED</div>}
          </div>
          <div style={{ fontSize: 11, color: '#999', lineHeight: 1.4 }}>{badge.desc}</div>
          {!earned && progressData && (
            <div style={{ marginTop: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <div style={{ fontSize: 10, color: '#777' }}>{progressData.value}/{progressData.max}</div>
                <div style={{ fontSize: 10, color: '#777' }}>{Math.round((progressData.value / progressData.max) * 100)}%</div>
              </div>
              <div style={{ height: 2, background: '#1a1a1a', borderRadius: 1 }}>
                <div style={{ height: '100%', width: `${(progressData.value / progressData.max) * 100}%`, background: badge.color, borderRadius: 1 }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [completions, setCompletions] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [message, setMessage] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [tab, setTab] = useState('profile') // 'profile' | 'badges'

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => { loadProfile() }, [])

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const [{ data }, { data: comps }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
      supabase.from('completions').select('entry_number, score').eq('user_id', user.id),
    ])

    if (data) {
      setProfile(data)
      setFirstName(data.first_name || '')
      setLastName(data.last_name || '')
      setEmail(data.email || user.email || '')
      setAvatarUrl(data.avatar_url || null)
    }

    if (comps) {
      const map = {}
      comps.forEach(c => { map[c.entry_number] = c })
      setCompletions(map)
    }

    setLoading(false)
  }

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    setMessage(null)
    const { error } = await supabase.from('profiles').update({
      first_name: firstName.trim() || null,
      last_name: lastName.trim() || null,
    }).eq('id', profile.id)
    if (error) {
      setMessage({ type: 'error', text: 'Update failed — try again' })
      setSaving(false)
      return
    }
    setMessage({ type: 'success', text: 'Saved' })
    setSaving(false)
    setTimeout(() => { loadProfile(); setMessage(null) }, 1500)
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !profile) return
    setUploadingAvatar(true)
    setMessage(null)
    const ext = file.name.split('.').pop()
    const path = `${profile.id}/avatar.${ext}`
    await supabase.storage.from('avatars').remove([path])
    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true, contentType: file.type })
    if (uploadError) {
      setMessage({ type: 'error', text: 'Upload failed — try again' })
      setUploadingAvatar(false)
      return
    }
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
    const urlWithBust = `${publicUrl}?t=${Date.now()}`
    await supabase.from('profiles').update({ avatar_url: urlWithBust }).eq('id', profile.id)
    setAvatarUrl(urlWithBust)
    setMessage({ type: 'success', text: 'Photo updated' })
    setUploadingAvatar(false)
  }

  const handleSignOut = async () => {
    setSigningOut(true)
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  // Derived stats
  const completedCount = Object.keys(completions).length
  const memberSince = profile?.signup_date ? new Date(profile.signup_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'
  const currentStreak = profile?.current_streak || 0
  const longestStreak = profile?.longest_streak || 0

  // Category breakdown
  const catBreakdown = {}
  const catTotal = {}
  ENTRIES.forEach(e => {
    catTotal[e.category] = (catTotal[e.category] || 0) + 1
    if (completions[e.entry]) catBreakdown[e.category] = (catBreakdown[e.category] || 0) + 1
  })
  const touchedCats = Object.keys(catTotal).filter(c => catBreakdown[c] > 0)

  // Badge context
  const badgeCtx = { profile, completions, completedCount, catBreakdown }
  const earnedBadges = BADGES.filter(b => b.check(badgeCtx))
  const lockedBadges = BADGES.filter(b => !b.check(badgeCtx))

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 13, color: '#888', letterSpacing: '0.1em' }}>LOADING...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ fontSize: 13, color: '#f87171', marginBottom: 20 }}>No profile found</div>
        <button onClick={() => router.push('/')} style={{ background: '#E8FF47', color: '#0A0A0A', border: 'none', borderRadius: 3, padding: '10px 20px', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', cursor: 'pointer' }}>BACK TO LIBRARY</button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: "'Inter',sans-serif", color: '#fff' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '40px 24px 60px' }}>

        {/* Back */}
        <button onClick={() => router.push('/')} style={{ background: 'none', border: '1px solid #1a1a1a', borderRadius: 3, padding: '6px 12px', fontSize: 10, color: '#aaa', cursor: 'pointer', letterSpacing: '0.1em', fontFamily: "'Inter',sans-serif", marginBottom: 28 }}>
          ← BACK
        </button>

        {/* Avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#111', border: '1px solid #1a1a1a', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {avatarUrl ? <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={28} strokeWidth={1} color='#444' />}
            </div>
            {uploadingAvatar && (
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 14, height: 14, border: '2px solid #333', borderTopColor: '#E8FF47', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              </div>
            )}
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{profile.first_name || 'Beta Tester'}</div>
            <div style={{ fontSize: 11, color: '#888' }}>Member since {memberSince}</div>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <StatCard label="STREAK" value={`${currentStreak}d`} />
          <StatCard label="LONGEST" value={`${longestStreak}d`} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          <StatCard label="COMPLETED" value={completedCount} />
          <StatCard label="BADGES" value={earnedBadges.length} />
        </div>

        {/* Category breakdown */}
        {touchedCats.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 10, color: '#888', letterSpacing: '0.1em', fontWeight: 500, marginBottom: 14 }}>CATEGORY PROGRESS</div>
            {Object.keys(catTotal).map(cat => (
              <CategoryBar key={cat} category={cat} completed={catBreakdown[cat] || 0} total={catTotal[cat]} />
            ))}
          </div>
        )}

        {/* Tab nav */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#111', borderRadius: 6, padding: 3 }}>
          {['profile', 'badges'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '8px 0', background: tab === t ? 'rgba(255,255,255,0.07)' : 'transparent',
              border: 'none', borderRadius: 4, fontSize: 10, fontWeight: 600,
              color: tab === t ? '#fff' : '#aaa', cursor: 'pointer',
              letterSpacing: '0.1em', fontFamily: "'Inter',sans-serif", textTransform: 'uppercase',
              transition: 'all 0.15s ease',
            }}>{t}</button>
          ))}
        </div>

        {/* PROFILE TAB */}
        {tab === 'profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Change photo */}
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 10, color: '#E8FF47', border: '1px solid #E8FF4733', borderRadius: 4, padding: '7px 14px', letterSpacing: '0.08em', cursor: uploadingAvatar ? 'default' : 'pointer', fontFamily: "'Inter',sans-serif", fontWeight: 500, opacity: uploadingAvatar ? 0.5 : 1, width: 'fit-content' }}>
              {uploadingAvatar ? 'UPLOADING...' : avatarUrl ? 'CHANGE PHOTO' : 'UPLOAD PHOTO'}
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarUpload} disabled={uploadingAvatar} style={{ display: 'none' }} />
            </label>
            <div style={{ fontSize: 10, color: '#666', marginTop: -12, letterSpacing: '0.02em' }}>JPG, PNG or WebP · Max 2MB</div>

            {/* First Name */}
            <div>
              <label style={{ display: 'block', fontSize: 11, color: '#888', letterSpacing: '0.08em', marginBottom: 8, fontWeight: 500 }}>FIRST NAME</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter first name" style={{ width: '100%', background: '#111', border: '1px solid #1a1a1a', borderRadius: 4, padding: '12px 14px', fontSize: 15, color: '#fff', fontFamily: "'Inter',sans-serif", outline: 'none' }} />
            </div>

            {/* Last Name */}
            <div>
              <label style={{ display: 'block', fontSize: 11, color: '#888', letterSpacing: '0.08em', marginBottom: 8, fontWeight: 500 }}>LAST NAME</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter last name" style={{ width: '100%', background: '#111', border: '1px solid #1a1a1a', borderRadius: 4, padding: '12px 14px', fontSize: 15, color: '#fff', fontFamily: "'Inter',sans-serif", outline: 'none' }} />
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 11, color: '#888', letterSpacing: '0.08em', marginBottom: 8, fontWeight: 500 }}>EMAIL</label>
              <input type="email" value={email} readOnly style={{ width: '100%', background: '#0a0a0a', border: '1px solid #141414', borderRadius: 4, padding: '12px 14px', fontSize: 15, color: '#555', fontFamily: "'Inter',sans-serif", outline: 'none', cursor: 'not-allowed' }} />
              <div style={{ fontSize: 11, color: '#666', marginTop: 6 }}>Email cannot be changed</div>
            </div>

            {message && (
              <div style={{ fontSize: 12, color: message.type === 'success' ? '#4ade80' : '#f87171', textAlign: 'center', padding: '10px', background: message.type === 'success' ? '#4ade8011' : '#f8717111', borderRadius: 4, letterSpacing: '0.05em' }}>
                {message.text}
              </div>
            )}

            <button onClick={handleSave} disabled={saving} style={{ width: '100%', background: '#E8FF47', color: '#0A0A0A', border: 'none', borderRadius: 4, padding: '14px', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'Inter',sans-serif", opacity: saving ? 0.5 : 1 }}>
              {saving ? 'SAVING...' : 'SAVE CHANGES'}
            </button>

            <div style={{ borderTop: '1px solid #141414', margin: '8px 0' }} />

            <button onClick={handleSignOut} disabled={signingOut} style={{ width: '100%', background: 'none', color: '#f87171', border: '1px solid #2a1a1e', borderRadius: 4, padding: '12px', fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', cursor: signingOut ? 'default' : 'pointer', fontFamily: "'Inter',sans-serif", opacity: signingOut ? 0.5 : 1 }}>
              {signingOut ? 'SIGNING OUT...' : 'SIGN OUT'}
            </button>
          </div>
        )}

        {/* BADGES TAB */}
        {tab === 'badges' && (
          <div>
            {earnedBadges.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 10, color: '#aaa', letterSpacing: '0.1em', fontWeight: 500, marginBottom: 12 }}>EARNED · {earnedBadges.length}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {earnedBadges.map(b => <BadgeCard key={b.id} badge={b} earned={true} progressData={null} />)}
                </div>
              </div>
            )}
            {lockedBadges.length > 0 && (
              <div>
                <div style={{ fontSize: 10, color: '#aaa', letterSpacing: '0.1em', fontWeight: 500, marginBottom: 12 }}>LOCKED · {lockedBadges.length}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {lockedBadges.map(b => {
                    const progressData = b.progress ? b.progress(badgeCtx) : null
                    return <BadgeCard key={b.id} badge={b} earned={false} progressData={progressData} />
                  })}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
