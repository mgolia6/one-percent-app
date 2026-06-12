import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const APP_URL = 'https://one-percent-app.vercel.app'

const CATEGORY_COLORS: Record<string, string> = {
  'AI': '#47FFE8',
  'Sales Craft': '#E8FF47',
  'Vocab & Language': '#FF8C47',
  'Mental Models': '#C847FF',
  'Philosophy': '#FF4778',
  'Neuroscience & Cognition': '#47C8FF',
  'Communication': '#FF8C00',
}

function getMomentum(count: number, weekNum: number): { headline: string; subline: string } {
  // Zero week — re-engagement
  if (count === 0) return {
    headline: "This week slipped by.",
    subline: `Week ${weekNum} is in the books but nothing made it to the vault. That's not a judgment — it's just data. Week ${weekNum + 1} is a clean slate.`,
  }
  // Partial week
  if (count <= 2) return {
    headline: `${count} concept${count > 1 ? 's' : ''} this week. A start.`,
    subline: `Not your best week, but you showed up. ${count === 1 ? 'One concept' : 'Two concepts'} in the vault is still more than zero. Week ${weekNum + 1} is a chance to build on it.`,
  }
  if (count <= 4) return {
    headline: `${count} concepts. Solid week.`,
    subline: `You put in the reps. ${count} concepts this week means ${count} tools you didn't have seven days ago. That compounds.`,
  }
  if (count <= 6) return {
    headline: `${count} this week. You're pulling away.`,
    subline: `${count} concepts in a week is serious output. Most people don't do this in a month. Week ${weekNum + 1} — keep the gap open.`,
  }
  return {
    headline: `${count} concepts. Perfect week.`,
    subline: `Every single day. That's the work. That's how it adds up. You know what week ${weekNum + 1} looks like — do it again.`,
  }
}

function buildHtml(firstName: string, entries: any[], weekNum: number, totalDone: number, streak: number) {
  const { headline, subline } = getMomentum(entries.length, weekNum)

  const entryRows = entries.map(e => {
    const color = CATEGORY_COLORS[e.category] || '#f0f0f0'
    const scoreBar = e.score != null ? `
      <div style="display:flex;gap:3px;margin-top:4px;">
        ${[1,2,3].map(i => `<div style="width:16px;height:3px;border-radius:1px;background:${i <= e.score ? color : '#222'};"></div>`).join('')}
      </div>` : ''
    return `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #1a1a1a;">
          <div style="font-size:9px;color:${color};letter-spacing:0.14em;margin-bottom:3px;text-transform:uppercase;">${e.category}</div>
          <div style="font-size:14px;color:#eee;font-weight:600;margin-bottom:2px;">${e.concept}</div>
          <div style="font-size:12px;color:#555;line-height:1.5;">${e.hook}</div>
          ${scoreBar}
        </td>
      </tr>`
  }).join('')

  const streakBlock = streak > 0 ? `
    <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,140,0,0.08);border:1px solid rgba(255,140,0,0.15);border-radius:100px;padding:5px 12px;margin-bottom:20px;">
      <span style="font-size:13px;">🔥</span>
      <span style="font-size:11px;color:#FF8C00;font-weight:700;letter-spacing:0.08em;">${streak} DAY STREAK</span>
    </div>` : ''

  const zeroWeekBlock = entries.length === 0 ? `
    <div style="background:#0f0f0f;border:1px solid #1e1e1e;border-left:3px solid #333;border-radius:4px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;color:#666;line-height:1.7;">Week ${weekNum} passed without an entry. No judgment — but Week ${weekNum + 1} starts now. One concept today and it's already a better week than last.</p>
    </div>` : `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${entryRows}
    </table>
    <div style="background:#0f0f0f;border:1px solid #1e1e1e;border-radius:4px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;color:#666;line-height:1.7;">${totalDone} total concepts in the vault. Each one a tool you can use today.</p>
    </div>`

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Inter',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#111;border:1px solid #222;border-radius:8px;padding:40px 36px;">
        <tr><td>
          <div style="font-size:11px;letter-spacing:0.18em;color:#555;margin-bottom:28px;text-transform:uppercase;">One Percent — Week ${weekNum}</div>
          ${streakBlock}
          <p style="margin:0 0 6px 0;font-size:15px;color:#777;line-height:1.7;">Hey ${firstName},</p>
          <p style="margin:0 0 28px 0;font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.02em;line-height:1.2;">${headline}</p>
          <p style="margin:0 0 28px 0;font-size:15px;color:#999;line-height:1.7;">${subline}</p>
          ${zeroWeekBlock}
          <div style="margin-bottom:28px;">
            <a href="${APP_URL}" style="display:inline-block;background:#f0f0f0;color:#0a0a0a;font-size:12px;font-weight:700;letter-spacing:0.1em;text-decoration:none;padding:13px 28px;border-radius:4px;text-transform:uppercase;">Start Week ${weekNum + 1} →</a>
          </div>
          <div style="margin-top:40px;padding-top:24px;border-top:1px solid #1e1e1e;font-size:11px;color:#444;line-height:1.7;">
            You're receiving this as a One Percent beta tester.<br>
            <a href="${APP_URL}" style="color:#555;text-decoration:none;">one-percent-app.vercel.app</a>
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

serve(async (_req) => {
  try {
    const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const today = new Date()
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000)

    const { data: profiles } = await db
      .from('profiles')
      .select('id, email, name, first_name, signup_date, current_streak')
      .eq('onboarding_complete', true)
      .not('signup_date', 'is', null)

    let sent = 0, skipped = 0

    for (const profile of (profiles || [])) {
      const signupDate = new Date(profile.signup_date)
      const daysSinceSignup = Math.floor((today.getTime() - signupDate.getTime()) / 86400000)
      if (daysSinceSignup === 0 || daysSinceSignup % 7 !== 0) { skipped++; continue }

      const weekNum = Math.floor(daysSinceSignup / 7)
      const firstName = profile.first_name || profile.name?.split(' ')[0] || 'there'
      const streak = profile.current_streak || 0

      // This week's completions
      const { data: weekComps } = await db
        .from('completions')
        .select('entry_number, score')
        .eq('user_id', profile.id)
        .gte('completed_at', sevenDaysAgo.toISOString())
        .order('completed_at', { ascending: true })

      // Total completions
      const { count: totalDone } = await db
        .from('completions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile.id)

      // Build entry list (even if zero — we still send)
      const entries = []
      for (const comp of (weekComps || [])) {
        try {
          const entryNum = comp.entry_number.toString().padStart(3, '0')
          const res = await fetch(`${APP_URL}/entries/${entryNum}.json`)
          if (res.ok) {
            const data = await res.json()
            entries.push({ concept: data.concept, category: data.category, hook: data.morning?.hook || '', score: comp.score })
          }
        } catch (_) {}
      }

      const html = buildHtml(firstName, entries, weekNum, totalDone || 0, streak)

      const subject = entries.length === 0
        ? `Week ${weekNum} — nothing in the vault. Week ${weekNum + 1} starts now.`
        : `Week ${weekNum} — ${entries.length} concept${entries.length !== 1 ? 's' : ''} in the vault`

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Matthew @ One Percent <matthew@mpgink.com>',
          to: profile.email,
          subject,
          html,
        }),
      })

      if (res.ok) sent++
      else skipped++
    }

    return new Response(JSON.stringify({ sent, skipped }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
})
