import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const APP_URL = 'https://one-percent-app.vercel.app'

const EMAIL_COPY: Record<number, { subject: string; body: string; cta: string }> = {
  1: {
    subject: "New week. Same edge.",
    body: "Monday gets a bad rap.\n\nYou know what Monday actually is? A clean slate with 52 chances a year attached to it.\n\nToday's concept is waiting. One read, one reframe, one quiz. Ten minutes, maybe less.",
    cta: "Open One Percent →",
  },
  2: {
    subject: "Yesterday you started. Today you continue.",
    body: "Tuesday is where streaks are made or quietly abandoned.\n\nNobody talks about Tuesday. That's exactly why showing up today means something.",
    cta: "Today's entry →",
  },
  3: {
    subject: "Halfway there. (We won't say it again.)",
    body: "Midweek. The novelty of Monday is gone, the relief of Friday isn't here yet.\n\nThis is the part where most people coast. You don't have to be most people.\n\nTen minutes. One concept. That's the whole ask.",
    cta: "Open One Percent →",
  },
  4: {
    subject: "Almost Friday. But not yet.",
    body: "Thursday is underrated. Friday gets all the credit but Thursday is where the actual work happens.\n\nOne concept today. You'll have it locked in before the weekend even starts.",
    cta: "Today's entry →",
  },
  5: {
    subject: "End the week sharp.",
    body: "Most people mentally check out by noon on Friday.\n\nYou don't have to. Ten minutes now means you carry something useful into the weekend — instead of just carrying whatever's left in your inbox.",
    cta: "Open One Percent →",
  },
  6: {
    subject: "No agenda. Just this.",
    body: "No meetings. No deliverables. No one needs anything from you right now.\n\nJust one concept, whenever you're ready. Coffee optional but recommended.",
    cta: "Open One Percent →",
  },
  0: {
    subject: "The quiet before Monday.",
    body: "Sunday is for reading things you actually want to read.\n\nOne Percent qualifies. Ten minutes, one concept, and you'll hit Monday already one step ahead.",
    cta: "Today's entry →",
  },
}

function buildHtml(firstName: string, copy: { subject: string; body: string; cta: string }) {
  const bodyHtml = copy.body
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
          <div style="font-size:11px;letter-spacing:0.18em;color:#555;margin-bottom:28px;text-transform:uppercase;">One Percent</div>
          <p style="margin:0 0 24px 0;font-size:15px;color:#777;line-height:1.7;">Hey ${firstName},</p>
          ${bodyHtml}
          <div style="margin-top:32px;">
            <a href="${APP_URL}" style="display:inline-block;background:#f0f0f0;color:#0a0a0a;font-size:12px;font-weight:700;letter-spacing:0.1em;text-decoration:none;padding:13px 28px;border-radius:4px;text-transform:uppercase;">${copy.cta}</a>
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

    const today = new Date().toISOString().slice(0, 10)
    const dayOfWeek = new Date().getDay()
    const copy = EMAIL_COPY[dayOfWeek]

    // Only users who have completed onboarding
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, first_name')
      .eq('onboarding_complete', true)
      .not('email', 'is', null)

    if (profilesError) throw profilesError

    // Who already did the work today
    const { data: completions, error: completionsError } = await supabase
      .from('completions')
      .select('user_id')
      .gte('completed_at', `${today}T00:00:00.000Z`)
      .lt('completed_at', `${today}T23:59:59.999Z`)

    if (completionsError) throw completionsError

    const completedToday = new Set((completions || []).map((c: any) => c.user_id))
    const toNotify = (profiles || []).filter((p: any) => !completedToday.has(p.id))

    let sent = 0
    const skipped = profiles!.length - toNotify.length

    for (const profile of toNotify) {
      const firstName = profile.first_name || 'there'
      const html = buildHtml(firstName, copy)

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Matthew @ One Percent <matthew@mpgink.com>',
          to: profile.email,
          subject: copy.subject,
          html,
        }),
      })

      if (res.ok) sent++
    }

    return new Response(JSON.stringify({ sent, skipped, total: profiles!.length }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
