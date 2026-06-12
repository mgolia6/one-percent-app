import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const APP_URL = 'https://one-percent-app.vercel.app'

// Three segments: active (completed yesterday), at-risk (1-2 days missed), lapsed (3+ days)
function getSegment(lastActiveDaysAgo: number): 'active' | 'atrisk' | 'lapsed' {
  if (lastActiveDaysAgo <= 1) return 'active'
  if (lastActiveDaysAgo <= 2) return 'atrisk'
  return 'lapsed'
}

type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6

const COPY: Record<string, Record<DayOfWeek, { subject: string; body: string; cta: string }>> = {
  active: {
    1: {
      subject: "Your streak just survived Monday.",
      body: "That's the hardest one.\n\nMost people use Monday as a reset button — they mean to start something and don't. You didn't do that.\n\nYour streak is live. Today's concept is ready. Don't let the thread drop.",
      cta: "Continue the streak →",
    },
    2: {
      subject: "Two days in. Don't stop here.",
      body: "Tuesday is where streaks go quiet. The Monday energy's gone and Friday feels far.\n\nThat's exactly when it counts. One concept today keeps the momentum you built yesterday.",
      cta: "Today's entry →",
    },
    3: {
      subject: "Midweek. The edge is still yours.",
      body: "You're on a roll.\n\nMost people have already mentally clocked out by Wednesday. You're still here, still sharp.\n\nOne concept. Keep the gap open.",
      cta: "Open One Percent →",
    },
    4: {
      subject: "One more before Friday.",
      body: "You know what separates people who grow from people who mean to?\n\nThursday. This exact moment. The quiet discipline of doing it when no one's watching.\n\nToday's entry is waiting.",
      cta: "Today's entry →",
    },
    5: {
      subject: "End the week sharp. You earned it.",
      body: "You showed up this week.\n\nOne more entry and you close the week with something most people don't have — a real body of work in your head.\n\nFinish it.",
      cta: "Close out the week →",
    },
    6: {
      subject: "Saturday. Your call.",
      body: "No agenda. No pressure.\n\nJust one concept, whenever you're ready. This is the kind of thing that compounds slowly and pays off all at once.",
      cta: "Open One Percent →",
    },
    0: {
      subject: "Sunday read. Better than the news.",
      body: "Most people spend Sunday catching up on things that don't matter.\n\nThis takes ten minutes and you'll actually remember it on Monday.\n\nToday's entry is ready when you are.",
      cta: "Today's entry →",
    },
  },
  atrisk: {
    1: {
      subject: "Your streak is still alive. Barely.",
      body: "You missed yesterday. That's fine — it happens.\n\nBut if you miss today, the streak's gone.\n\nOne entry. Right now. That's all it takes to keep it.",
      cta: "Save the streak →",
    },
    2: {
      subject: "The gap is real. Close it today.",
      body: "Two days without an entry. The streak is on thin ice.\n\nYou've built something worth protecting. Don't let a busy Tuesday be the thing that breaks it.",
      cta: "Get back in it →",
    },
    3: {
      subject: "Don't let Wednesday be the reason.",
      body: "You've missed a couple days. It happens. But today's the day it stops.\n\nThe streak is still recoverable. One entry now and you're back.",
      cta: "Open One Percent →",
    },
    4: {
      subject: "The window is closing.",
      body: "You're close to losing the streak you built.\n\nOne entry today fixes it. Ten minutes. That's it.",
      cta: "Today's entry →",
    },
    5: {
      subject: "Don't end the week on a miss.",
      body: "You've got a gap. Friday's the last shot to close it before the week ends.\n\nGet the entry in today. The streak's still worth saving.",
      cta: "Close the gap →",
    },
    6: {
      subject: "Saturday reset. No shame in it.",
      body: "You've had a rough stretch. It happens to everyone.\n\nSaturday is a clean slate. One entry and the momentum starts again.",
      cta: "Restart today →",
    },
    0: {
      subject: "Don't let Sunday slip by.",
      body: "You're one entry away from getting back on track.\n\nDo it before Monday hits and the week starts without you.",
      cta: "Get back on track →",
    },
  },
  lapsed: {
    1: {
      subject: "Still here when you're ready.",
      body: "It's been a few days. No lecture.\n\nYou signed up for One Percent because you wanted something to change. That reason's still there.\n\nWhenever you're ready to come back, the door's open. Today works.",
      cta: "Come back today →",
    },
    2: {
      subject: "The vault hasn't moved. You have.",
      body: "Everything you learned is still there. The concepts don't go anywhere.\n\nBut the streak won't rebuild itself. Today's the day, if you want it to be.",
      cta: "Pick up where you left off →",
    },
    3: {
      subject: "A gap isn't a failure. Quitting is.",
      body: "You've been away for a bit. That's not the end of the story — it's just a pause.\n\nCome back today. One entry. No big deal.",
      cta: "Open One Percent →",
    },
    4: {
      subject: "This isn't a guilt trip. It's a nudge.",
      body: "You disappeared for a few days. That happens.\n\nBut you picked One Percent for a reason. That reason's probably still true.\n\nToday's entry is right there.",
      cta: "Today's entry →",
    },
    5: {
      subject: "Friday re-entry. The best kind.",
      body: "Come back before the week ends.\n\nOne entry today means you head into the weekend with momentum instead of guilt.",
      cta: "Come back today →",
    },
    6: {
      subject: "Saturday is a good day to start again.",
      body: "Clean slate. No crowds. No inbox.\n\nJust you and ten minutes and a concept you'll actually remember.",
      cta: "Start fresh →",
    },
    0: {
      subject: "Sunday. Clean slate. Come back.",
      body: "You've been away for a while.\n\nSunday is the best day to restart. It's quiet, it's yours, and there's nothing standing between you and one good entry.",
      cta: "Come back today →",
    },
  },
}

function buildHtml(firstName: string, streak: number, copy: { subject: string; body: string; cta: string }, segment: string) {
  const bodyHtml = copy.body
    .split('\n\n')
    .map(p => `<p style="margin:0 0 16px 0;font-size:15px;color:#999;line-height:1.7;">${p.replace(/\n/g, '<br>')}</p>`)
    .join('')

  const streakBadge = streak > 0 ? `
    <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,140,0,0.1);border:1px solid rgba(255,140,0,0.2);border-radius:100px;padding:5px 12px;margin-bottom:24px;">
      <span style="font-size:13px;">🔥</span>
      <span style="font-size:11px;color:#FF8C00;font-weight:700;letter-spacing:0.08em;">${streak} DAY STREAK</span>
    </div>` : ''

  const urgencyBar = segment === 'atrisk' ? `
    <div style="background:#2a1a00;border:1px solid #4a2a00;border-radius:4px;padding:12px 16px;margin-bottom:20px;">
      <p style="margin:0;font-size:12px;color:#FF8C00;letter-spacing:0.05em;">⚠️ Your streak is at risk. One entry saves it.</p>
    </div>` : ''

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Inter',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#111;border:1px solid #222;border-radius:8px;padding:40px 36px;">
        <tr><td>
          <div style="font-size:11px;letter-spacing:0.18em;color:#555;margin-bottom:28px;text-transform:uppercase;">One Percent</div>
          ${streakBadge}
          ${urgencyBar}
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
    const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const today = new Date().toISOString().slice(0, 10)
    const dayOfWeek = new Date().getDay() as DayOfWeek

    const { data: profiles } = await db
      .from('profiles')
      .select('id, email, first_name, name, current_streak, last_active_date')
      .eq('onboarding_complete', true)
      .not('email', 'is', null)

    // Who already did the work today
    const { data: completions } = await db
      .from('completions')
      .select('user_id')
      .gte('completed_at', `${today}T00:00:00.000Z`)
      .lt('completed_at', `${today}T23:59:59.999Z`)

    const completedToday = new Set((completions || []).map((c: any) => c.user_id))
    const toNotify = (profiles || []).filter((p: any) => !completedToday.has(p.id))

    let sent = 0
    const skipped = (profiles?.length || 0) - toNotify.length

    for (const profile of toNotify) {
      const firstName = profile.first_name || profile.name?.split(' ')[0] || 'there'
      const streak = profile.current_streak || 0

      // Calculate days since last active
      const lastActive = profile.last_active_date ? new Date(profile.last_active_date) : null
      const lastActiveDaysAgo = lastActive
        ? Math.floor((Date.now() - lastActive.getTime()) / 86400000)
        : 999

      const segment = getSegment(lastActiveDaysAgo)
      const copy = COPY[segment][dayOfWeek]
      const html = buildHtml(firstName, streak, copy, segment)

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Matthew @ One Percent <matthew@mpgink.com>',
          to: profile.email,
          subject: copy.subject,
          html,
        }),
      })

      if (res.ok) sent++
    }

    return new Response(JSON.stringify({ sent, skipped, total: profiles?.length }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    })
  }
})
