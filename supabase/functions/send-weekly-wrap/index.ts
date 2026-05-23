import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const APP_URL = 'https://one-percent-app.vercel.app'

const CATEGORY_COLORS: Record<string, string> = {
  'AI': '#47FFE8',
  'Sales Craft': '#FFE047',
  'Vocab & Language': '#FF47A3',
  'Mental Models': '#47A3FF',
  'Philosophy': '#A347FF',
  'Neuroscience & Cognition': '#FF8347',
  'Communication': '#47FF83',
}

function buildHtml(firstName: string, entries: any[], weekNum: number) {
  const entryRows = entries.map(e => {
    const color = CATEGORY_COLORS[e.category] || '#f0f0f0'
    return `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #1a1a1a;">
          <div style="font-size:10px;color:${color};letter-spacing:0.1em;margin-bottom:3px;">${e.category}</div>
          <div style="font-size:14px;color:#eee;font-weight:500;margin-bottom:3px;">${e.concept}</div>
          <div style="font-size:12px;color:#555;line-height:1.5;">${e.hook}</div>
        </td>
      </tr>`
  }).join('')

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Inter',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#111;border:1px solid #222;border-radius:8px;padding:40px 36px;">
        <tr><td>
          <div style="font-size:11px;letter-spacing:0.18em;color:#555;margin-bottom:28px;text-transform:uppercase;">One Percent — Week ${weekNum} Wrap</div>
          <p style="margin:0 0 8px 0;font-size:15px;color:#777;line-height:1.7;">Hey ${firstName},</p>
          <p style="margin:0 0 28px 0;font-size:15px;color:#999;line-height:1.7;">Week ${weekNum} is in the books. Here's what you put in the vault:</p>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            ${entryRows}
          </table>

          <div style="background:#0a0a0a;border:1px solid #1e1e1e;border-radius:4px;padding:20px 24px;margin-bottom:28px;">
            <p style="margin:0;font-size:14px;color:#666;line-height:1.7;">${entries.length} concept${entries.length !== 1 ? 's' : ''} this week. Each one a tool you can use today. The reps compound.</p>
          </div>

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
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    const today = new Date()
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000)

    // Find users who hit a 7-day boundary today
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, name, signup_date')
      .eq('onboarding_complete', true)
      .not('signup_date', 'is', null)

    if (profileError) throw profileError

    let sent = 0
    let skipped = 0

    for (const profile of (profiles || [])) {
      const signupDate = new Date(profile.signup_date)
      const daysSinceSignup = Math.floor((today.getTime() - signupDate.getTime()) / 86400000)

      // Only on 7-day boundaries (day 7, 14, 21...)
      if (daysSinceSignup === 0 || daysSinceSignup % 7 !== 0) { skipped++; continue }

      const weekNum = Math.floor(daysSinceSignup / 7)

      // Get this week's completions
      const { data: weekComps } = await supabase
        .from('completions')
        .select('entry_number, score')
        .eq('user_id', profile.id)
        .gte('completed_at', sevenDaysAgo.toISOString())
        .order('completed_at', { ascending: true })

      if (!weekComps || weekComps.length === 0) { skipped++; continue }

      // Fetch entry metadata
      const entries = []
      for (const comp of weekComps) {
        try {
          const entryNum = comp.entry_number.toString().padStart(3, '0')
          const res = await fetch(`${APP_URL}/entries/${entryNum}.json`)
          if (res.ok) {
            const data = await res.json()
            entries.push({
              concept: data.concept,
              category: data.category,
              hook: data.morning?.hook || '',
            })
          }
        } catch (_) {}
      }

      if (entries.length === 0) { skipped++; continue }

      const firstName = profile.name?.split(' ')[0] || 'there'
      const html = buildHtml(firstName, entries, weekNum)

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Matthew @ One Percent <matthew@mpgink.com>',
          to: profile.email,
          subject: `Week ${weekNum} wrap — ${entries.length} concept${entries.length !== 1 ? 's' : ''} in the vault`,
          html,
        }),
      })

      if (res.ok) sent++
      else skipped++
    }

    return new Response(JSON.stringify({ sent, skipped }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
