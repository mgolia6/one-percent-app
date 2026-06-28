'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Shield, Footprints, Target, Layers, Zap, Grid3X3, Flame, Gem, User, ChevronLeft, Trophy, Plus } from 'lucide-react'
import { CATEGORIES } from '@/lib/categories'

const CATEGORY_COLORS = Object.fromEntries(CATEGORIES.map(c => [c.key, c.color]))

// Badges now come from Supabase (badge_definitions + user_badges tables)
const ICONS = { Shield, Footprints, Target, Layers, Zap, Grid3X3, Flame, Gem }

// Design tokens — matched to app dark system
const BG = '#0e141c'
const SURFACE = '#1a2a3a'
const BORDER = 'rgba(255,255,255,0.08)'
const BORDER_FAINT = 'rgba(255,255,255,0.04)'
const T = { primary: '#e8eef5', secondary: 'rgba(232,238,245,0.65)', tertiary: 'rgba(232,238,245,0.35)', faint: 'rgba(232,238,245,0.18)' }

const CAT_COLORS = Object.fromEntries(CATEGORIES.map(c => [c.key, c.color]))

function BadgeRow({ badge, earned, earnedAt }) {
  const color = badge.category ? CAT_COLORS[badge.category] || '#fff' : '#E8FF47'
  const iconEl = badge.icon && badge.icon !== '◈' ? (
    <span style={{ fontSize: 18, lineHeight: 1 }}>{badge.icon}</span>
  ) : (
    <div style={{ width: 18, height: 18, borderRadius: '50%', background: color + '22', border: `1px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: earned ? color : '#333' }} />
    </div>
  )

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 0',
      borderBottom: `1px solid ${earned ? BORDER_FAINT : 'rgba(255,255,255,0.02)'}`,
      opacity: earned ? 1 : 0.35,
    }}>
      <div style={{ flexShrink: 0, width: 24, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {earned ? iconEl : (
          badge.hidden
            ? <span style={{ fontSize: 14, filter: 'grayscale(1)', opacity: 0.3 }}>?</span>
            : iconEl
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: earned ? T.primary : T.tertiary, marginBottom: 2 }}>
          {badge.hidden && !earned ? '???' : badge.name}
        </div>
        <div style={{ fontSize: 11, color: T.tertiary, lineHeight: 1.5 }}>
          {badge.hidden && !earned ? 'Keep playing to discover this one.' : badge.description}
        </div>
        {earned && earnedAt && (
          <div style={{ fontSize: 9, color: T.faint, marginTop: 3, letterSpacing: '0.06em' }}>
            {new Date(earnedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        )}
      </div>
      {earned && (
        <div style={{ fontSize: 9, background: color + '18', color, borderRadius: 3, padding: '3px 8px', letterSpacing: '0.1em', fontWeight: 700, flexShrink: 0 }}>
          EARNED
        </div>
      )}
    </div>
  )
}

function FieldRow({ label, value, onChange, editable = true, type = 'text', hint }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 9, color: T.tertiary, letterSpacing: '0.16em', marginBottom: 7, fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>{label}</div>
      <input
        type={type}
        value={value}
        onChange={onChange ? e => onChange(e.target.value) : undefined}
        readOnly={!editable}
        style={{
          width: '100%', background: editable ? 'rgba(255,255,255,0.04)' : 'transparent',
          border: 'none',
          borderBottom: `1px solid ${editable ? BORDER : BORDER_FAINT}`,
          padding: '10px 0', fontSize: 14,
          color: editable ? T.primary : T.faint,
          fontFamily: "'DM Sans', 'Inter', sans-serif", outline: 'none',
          cursor: editable ? 'text' : 'default',
        }}
      />
      {hint && <div style={{ fontSize: 10, color: T.faint, marginTop: 4 }}>{hint}</div>}
    </div>
  )
}

function Toggle({ label, subLabel, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: `1px solid ${BORDER_FAINT}` }}>
      <div>
        <div style={{ fontSize: 13, color: T.secondary, marginBottom: 2 }}>{label}</div>
        {subLabel && <div style={{ fontSize: 11, color: T.tertiary }}>{subLabel}</div>}
      </div>
      <div
        onClick={() => onChange(!value)}
        style={{
          width: 44, height: 26, borderRadius: 13,
          background: value ? '#47FFE8' : 'rgba(255,255,255,0.08)',
          position: 'relative', cursor: 'pointer', flexShrink: 0,
          transition: 'background 0.2s',
        }}
      >
        <div style={{
          position: 'absolute', top: 3, left: value ? 21 : 3,
          width: 20, height: 20, borderRadius: '50%',
          background: value ? '#0a1420' : 'rgba(255,255,255,0.3)',
          transition: 'left 0.2s',
        }} />
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [rank, setRank] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [message, setMessage] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [tab, setTab] = useState('account')
  const [badgeDefs, setBadgeDefs] = useState([])
  const [userBadges, setUserBadges] = useState({})
  const [streakFreezes, setStreakFreezes] = useState(0)
  // Account fields
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [emailReminders, setEmailReminders] = useState(true)

  useEffect(() => { loadProfile() }, [])

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const [{ data }, { data: allProfiles }, { data: badgeDefsData }, { data: earnedBadgesData }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
      supabase.from('profiles').select('id, current_streak').order('current_streak', { ascending: false }),
      supabase.from('badge_definitions').select('*').order('sort_order'),
      supabase.from('user_badges').select('badge_id, earned_at').eq('user_id', user.id),
    ])

    if (data) {
      setProfile(data)
      setFirstName(data.first_name || '')
      setLastName(data.last_name || '')
      setEmail(data.email || user.email || '')
      setPhone(data.phone || '')
      setEmailReminders(data.email_reminders !== false)
      setAvatarUrl(data.avatar_url || null)
      setStreakFreezes(data.streak_freezes || 0)
    }

    if (badgeDefsData) setBadgeDefs(badgeDefsData)
    if (earnedBadgesData) {
      const badgeMap = {}
      earnedBadgesData.forEach(b => { badgeMap[b.badge_id] = b.earned_at })
      setUserBadges(badgeMap)
    }

    if (allProfiles && data) {
      const idx = allProfiles.findIndex(p => p.id === user.id)
      setRank(idx >= 0 ? idx + 1 : null)
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
      phone: phone.trim() || null,
      email_reminders: emailReminders,
    }).eq('id', profile.id)
    if (error) { setMessage({ type: 'error', text: 'Update failed — try again' }); setSaving(false); return }
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
    if (uploadError) { setMessage({ type: 'error', text: 'Upload failed — try again' }); setUploadingAvatar(false); return }
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

  const earnedBadges = badgeDefs.filter(b => userBadges[b.id])
  const lockedBadges = badgeDefs.filter(b => !userBadges[b.id])
  const memberSince = profile?.signup_date ? new Date(profile.signup_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : null
  const currentStreak = profile?.current_streak || 0
  const longestStreak = profile?.longest_streak || 0

  if (loading) return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 11, color: T.tertiary, letterSpacing: '0.2em', fontFamily: "'DM Mono', monospace" }}>LOADING...</div>
    </div>
  )

  if (!profile) return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ fontSize: 13, color: '#FF4778', marginBottom: 20 }}>No profile found</div>
      <button onClick={() => router.push('/')} style={{ background: '#E8FF47', color: '#0A0A0A', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer', fontFamily: "'DM Mono', monospace" }}>BACK TO LIBRARY</button>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: "'DM Sans', 'Inter', sans-serif", color: T.primary }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg) } }
        input::placeholder { color: rgba(232,238,245,0.2); }
      `}</style>

      {/* Sticky nav */}
      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(14,20,28,0.97)', backdropFilter: 'blur(14px)', borderBottom: `1px solid ${BORDER_FAINT}` }}>
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '12px 20px' }}>
          <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, color: T.tertiary, letterSpacing: '0.1em', padding: 0, fontFamily: "'DM Mono', monospace" }}>
            <ChevronLeft size={13} strokeWidth={2} />
            LIBRARY
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 20px 80px' }}>

        {/* Header — avatar + name + streak + rank */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Avatar */}
            <label style={{ position: 'relative', flexShrink: 0, cursor: uploadingAvatar ? 'default' : 'pointer' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: SURFACE, border: `2px solid ${BORDER}`, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {avatarUrl
                  ? <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <User size={22} strokeWidth={1} color={T.faint} />
                }
              </div>
              {!uploadingAvatar && (
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: 18, height: 18, borderRadius: '50%', background: '#E8FF47', border: `2px solid ${BG}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={10} strokeWidth={3} color="#0A0A0A" />
                </div>
              )}
              {uploadingAvatar && (
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 14, height: 14, border: '2px solid #333', borderTopColor: '#E8FF47', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                </div>
              )}
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarUpload} disabled={uploadingAvatar} style={{ display: 'none' }} />
            </label>

            <div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: T.primary, lineHeight: 1, marginBottom: 4 }}>
                {profile.first_name || 'Beta Tester'}
                {profile.last_name ? ` ${profile.last_name}` : ''}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {currentStreak > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 12 }}>🔥</span>
                    <span style={{ fontSize: 11, color: currentStreak >= 7 ? '#47FFE8' : '#E8FF47', fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>{currentStreak}</span>
                  </div>
                )}
                {memberSince && <div style={{ fontSize: 11, color: T.faint, fontFamily: "'DM Mono', monospace" }}>SINCE {memberSince.toUpperCase()}</div>}
              </div>
            </div>
          </div>

          {/* Rank */}
          {rank !== null && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flexShrink: 0 }}>
              <Trophy size={14} strokeWidth={1.5} color='#E8FF47' />
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: T.primary, lineHeight: 1 }}>#{rank}</div>
              <div style={{ fontSize: 8, color: T.tertiary, letterSpacing: '0.14em', fontFamily: "'DM Mono', monospace" }}>RANK</div>
            </div>
          )}
        </div>

        {/* Tabs — ACCOUNT | BADGES */}
        <div style={{ display: 'flex', marginBottom: 28, borderBottom: `1px solid ${BORDER_FAINT}` }}>
          {[
            { key: 'account', label: 'ACCOUNT' },
            { key: 'badges', label: 'BADGES' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '8px 20px 10px 0', fontSize: 10,
              fontWeight: tab === t.key ? 600 : 400,
              color: tab === t.key ? T.primary : T.tertiary,
              letterSpacing: '0.14em',
              borderBottom: tab === t.key ? `2px solid ${T.primary}` : '2px solid transparent',
              marginBottom: -1, fontFamily: "'DM Mono', monospace",
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ACCOUNT TAB */}
        {tab === 'account' && (
          <div style={{ paddingBottom: 40 }}>

            {/* Identity */}
            <div style={{ fontSize: 9, color: T.tertiary, letterSpacing: '0.18em', fontWeight: 600, marginBottom: 16, fontFamily: "'DM Mono', monospace" }}>IDENTITY</div>
            <FieldRow label="FIRST NAME" value={firstName} onChange={setFirstName} />
            <FieldRow label="LAST NAME" value={lastName} onChange={setLastName} />
            <FieldRow label="EMAIL" value={email} editable={false} hint="Email cannot be changed" />
            <FieldRow label="PHONE" value={phone} onChange={setPhone} type="tel" hint="Used for future SMS notifications — optional" />

            {/* Notifications */}
            <div style={{ fontSize: 9, color: T.tertiary, letterSpacing: '0.18em', fontWeight: 600, marginTop: 28, marginBottom: 12, fontFamily: "'DM Mono', monospace" }}>NOTIFICATIONS</div>
            <Toggle
              label="Daily email reminders"
              subLabel="Morning nudge when your entry is ready"
              value={emailReminders}
              onChange={setEmailReminders}
            />

            {message && (
              <div style={{ fontSize: 12, color: message.type === 'success' ? '#4ade80' : '#f87171', textAlign: 'center', padding: '10px', background: message.type === 'success' ? '#4ade8011' : '#f8717111', borderRadius: 8, letterSpacing: '0.05em', marginTop: 20 }}>
                {message.text}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
              <button onClick={handleSave} disabled={saving} style={{ width: '100%', background: '#E8FF47', color: '#0A0A0A', border: 'none', borderRadius: 10, padding: '14px', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', fontFamily: "'DM Mono', monospace", cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.5 : 1 }}>
                {saving ? 'SAVING...' : 'SAVE CHANGES'}
              </button>
              <button onClick={handleSignOut} disabled={signingOut} style={{ width: '100%', background: 'none', color: '#FF4778', border: '1px solid rgba(255,71,120,0.2)', borderRadius: 10, padding: '13px', fontSize: 10, letterSpacing: '0.14em', fontFamily: "'DM Mono', monospace", cursor: signingOut ? 'default' : 'pointer', opacity: signingOut ? 0.5 : 1 }}>
                {signingOut ? 'SIGNING OUT...' : 'SIGN OUT'}
              </button>
            </div>

            {/* Footer links */}
            <div style={{ marginTop: 36, paddingTop: 20, borderTop: `1px solid ${BORDER_FAINT}`, display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { label: 'About One Percent', href: '/about' },
                { label: 'Privacy Policy', href: '/privacy' },
              ].map(({ label, href }) => (
                <a key={href} href={href} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '13px 0', borderBottom: `1px solid ${BORDER_FAINT}`,
                  textDecoration: 'none', color: T.tertiary,
                  fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                  transition: 'color 0.15s',
                }}>
                  {label}
                  <span style={{ fontSize: 16, color: T.faint, lineHeight: 1 }}>›</span>
                </a>
              ))}
            </div>

          </div>
        )}

        {/* BADGES TAB */}
        {tab === 'badges' && (
          <div style={{ paddingBottom: 40 }}>
            {/* Streak Freeze display */}
            <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '16px 18px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontSize: 28, lineHeight: 1 }}>🧊</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.primary, marginBottom: 3 }}>Streak Freezes</div>
                <div style={{ fontSize: 11, color: T.tertiary, lineHeight: 1.5 }}>Auto-protects your streak when you miss a day. Earned through milestones.</div>
              </div>
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: streakFreezes > 0 ? '#47C8FF' : T.faint, lineHeight: 1, letterSpacing: '-0.02em' }}>{streakFreezes}</div>
                <div style={{ fontSize: 8, color: T.faint, letterSpacing: '0.12em', marginTop: 2, fontFamily: "'DM Mono', monospace" }}>AVAILABLE</div>
              </div>
            </div>

            {earnedBadges.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 9, color: T.secondary, letterSpacing: '0.16em', fontWeight: 600, marginBottom: 4, fontFamily: "'DM Mono', monospace" }}>EARNED · {earnedBadges.length}</div>
                {earnedBadges.map(b => <BadgeRow key={b.id} badge={b} earned={true} earnedAt={userBadges[b.id]} />)}
              </div>
            )}
            {lockedBadges.length > 0 && (
              <div>
                <div style={{ fontSize: 9, color: T.tertiary, letterSpacing: '0.16em', fontWeight: 600, marginBottom: 4, fontFamily: "'DM Mono', monospace" }}>LOCKED · {lockedBadges.length}</div>
                {lockedBadges.map(b => <BadgeRow key={b.id} badge={b} earned={false} earnedAt={null} />)}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
