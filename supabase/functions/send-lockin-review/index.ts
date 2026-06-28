import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Spaced-repetition nudge. Runs daily. For each user with active lock-ins that
// are due (and not already nudged this cycle), sends ONE digest email pointing
// them back to /review. The Leitner box math lives client-side (lib/lockins.js)
// and advances when the user actually reviews — this function only nudges.

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const APP_URL = 'https://one-percent-app.vercel.app'

function buildHtml(firstName: string, items: { concept: string; keeper: string | null }[]) {
  const n = items.length
  const list = items
    .map(it => {
      const line = it.keeper && it.keeper.trim()
        ? `<div style="font-size:13px;color:#888;line-height:1.6;margin-top:4px;">"${it.keeper.trim()}"</div>`
        : ''
      return `<div style="background:#0a0a0a;border:1px solid #1e1e1e;border-left:3px solid #f0f0f0;border-radius:4px;padding:14px 18px;margin-bottom:10px;">
        <div style="font-size:15px;color:#eee;font-weight:600;">${it.concept}</div>
        ${line}
      </div>`
    })
    .join('')

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Inter',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#111;border:1px solid #222;border-radius:8px;padding:40px 36px;">
        <tr><td>
          <div style="font-size:11px;letter-spacing:0.18em;color:#555;margin-bottom:28px;text-transform:uppercase;">One Percent — Keep It Sharp</div>
          <p style="margin:0 0 20px 0;font-size:15px;color:#999;line-height:1.7;">Hey ${firstName},</p>
          <p style="margin:0 0 20px 0;font-size:15px;color:#999;line-height:1.7;">${n === 1 ? "A concept you chose to keep sharp is due for a quick recall." : `${n} concepts you chose to keep sharp are due for a quick recall.`} Thirty seconds — can you still bring it back from memory?</p>
          ${list}
          <div style="margin-top:24px;">
            <a href="${APP_URL}/review" style="display:inline-block;background:#f0f0f0;color:#0a0a0a;font-size:12px;font-weight:700;letter-spacing:0.1em;text-decoration:none;padding:13px 28px;border-radius:4px;text-transform:uppercase;">Review now →</a>
          </div>
          <p style="margin:24px 0 0 0;font-size:13px;color:#666;line-height:1.7;">Recall is what moves a concept from "I read it" to "I own it." That's the whole game.</p>
          <div style="margin-top:36px;padding-top:24px;border-top:1px solid #1e1e1e;font-size:11px;color:#444;line-height:1.7;">
            You chose to keep these sharp in One Percent. Turn off reminders anytime in your profile.<br>
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
    const nowIso = new Date().toISOString()

    // Due, active, and not yet nudged for the current due cycle.
    const { data: due, error: dueErr } = await supabase
      .from('lockins')
      .select('id, user_id, concept, keeper, due_at, reminder_sent_at')
      .eq('status', 'active')
      .lte('due_at', nowIso)

    if (dueErr) throw dueErr
    const pending = (due || []).filter(
      (l: any) => !l.reminder_sent_at || new Date(l.reminder_sent_at) < new Date(l.due_at),
    )
    if (pending.length === 0) {
      return new Response(JSON.stringify({ sent: 0, users: 0 }), { headers: { 'Content-Type': 'application/json' } })
    }

    // Group by user.
    const byUser: Record<string, any[]> = {}
    for (const l of pending) {
      ;(byUser[l.user_id] ||= []).push(l)
    }

    const userIds = Object.keys(byUser)
    const { data: profiles, error: profErr } = await supabase
      .from('profiles')
      .select('id, email, first_name, email_reminders')
      .in('id', userIds)
    if (profErr) throw profErr
    const profileMap = Object.fromEntries((profiles || []).map((p: any) => [p.id, p]))

    let sent = 0
    let skipped = 0

    for (const uid of userIds) {
      const profile = profileMap[uid]
      const items = byUser[uid]
      if (!profile?.email || profile.email_reminders === false) { skipped++; continue }

      const firstName = profile.first_name || 'there'
      const subject = items.length === 1
        ? `Still got it? "${items[0].concept}" is due for recall`
        : `${items.length} concepts are due for a quick recall`
      const html = buildHtml(firstName, items.map((i: any) => ({ concept: i.concept || 'a concept', keeper: i.keeper })))

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

      if (res.ok) {
        await supabase.from('lockins').update({ reminder_sent_at: nowIso }).in('id', items.map((i: any) => i.id))
        sent++
      } else {
        skipped++
      }
    }

    return new Response(JSON.stringify({ sent, skipped, users: userIds.length }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
