import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const APP_URL = 'https://one-percent-app.vercel.app'

function buildHtml(firstName: string, concept: string, challenge: string, entryNumber: string) {
  const challengeHtml = challenge
    .split('\n\n')
    .map(p => `<p style="margin:0 0 16px 0;font-size:15px;color:#999;line-height:1.7;">${p.replace(/\n/g, '<br>')}</p>`)
    .join('')

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Inter',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#111;border:1px solid #222;border-radius:8px;padding:40px 36px;">
        <tr><td>
          <div style="font-size:11px;letter-spacing:0.18em;color:#555;margin-bottom:28px;text-transform:uppercase;">One Percent — Practice Reminder</div>
          <p style="margin:0 0 24px 0;font-size:15px;color:#777;line-height:1.7;">Hey ${firstName},</p>
          <p style="margin:0 0 20px 0;font-size:15px;color:#999;line-height:1.7;">Earlier today you learned about <strong style="color:#eee;">${concept}</strong>. Here's what you said you'd try:</p>
          <div style="background:#0a0a0a;border:1px solid #1e1e1e;border-left:3px solid #f0f0f0;border-radius:4px;padding:20px 24px;margin-bottom:28px;">
            ${challengeHtml}
          </div>
          <p style="margin:0 0 28px 0;font-size:14px;color:#666;line-height:1.7;">Did you get to it? If not — there's still time. Even a five-minute attempt beats zero.</p>
          <div style="margin-top:8px;">
            <a href="${APP_URL}" style="display:inline-block;background:#f0f0f0;color:#0a0a0a;font-size:12px;font-weight:700;letter-spacing:0.1em;text-decoration:none;padding:13px 28px;border-radius:4px;text-transform:uppercase;">Back to One Percent →</a>
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

    // Find completions that are 6+ hours old, reminder not yet sent
    const cutoff = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()

    const { data: completions, error: compError } = await supabase
      .from('completions')
      .select('id, user_id, entry_number')
      .eq('reminder_sent', false)
      .lte('completed_at', cutoff)

    if (compError) throw compError
    if (!completions || completions.length === 0) {
      return new Response(JSON.stringify({ sent: 0, skipped: 0 }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Get user profiles
    const userIds = [...new Set(completions.map((c: any) => c.user_id))]
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, name')
      .in('id', userIds)

    if (profileError) throw profileError

    const profileMap = Object.fromEntries((profiles || []).map((p: any) => [p.id, p]))

    let sent = 0
    let skipped = 0

    for (const completion of completions) {
      const profile = profileMap[completion.user_id]
      if (!profile?.email) { skipped++; continue }

      // Fetch entry JSON from Vercel static files
      const entryNum = completion.entry_number.toString().padStart(3, '0')
      const entryRes = await fetch(`${APP_URL}/entries/${entryNum}.json`)
      if (!entryRes.ok) { skipped++; continue }

      const entry = await entryRes.json()
      const concept = entry.concept
      const challenge = entry.morning?.morning_challenge
      if (!challenge) { skipped++; continue }

      const firstName = profile.name?.split(' ')[0] || 'there'
      const html = buildHtml(firstName, concept, challenge, entryNum)

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Matthew @ One Percent <matthew@mpgink.com>',
          to: profile.email,
          subject: `You learned ${concept} today. Did you try it?`,
          html,
        }),
      })

      if (res.ok) {
        // Mark reminder sent
        await supabase
          .from('completions')
          .update({ reminder_sent: true })
          .eq('id', completion.id)
        sent++
      } else {
        skipped++
      }
    }

    return new Response(JSON.stringify({ sent, skipped, total: completions.length }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
