import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const APP_URL = 'https://one-percent-app.vercel.app'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const EMAILS = [
  {
    to: 'rmcnaugher@gmail.com',
    firstName: 'DonRobbo',
    subject: 'One Percent — quick check-in, and a few things I built because of you',
    surveyUrl: `${APP_URL}/survey/8a2a16bf-d271-4261-8c13-5ea1747e9490`,
    intro: `You've put in real time with this. 5+ entries, weekly feedback submitted, Mental Models as your go-to. You've told me the leaderboard motivates you even when you didn't expect it to — and that premeditatio malorum became a daily thing. That's exactly the kind of signal I built this for.`,
    shipped: [
      'The quiz is now application-based, not memorization. You won\'t get asked to recall a number anymore. Questions now ask you to apply the concept.',
      'Every entry now ends with an AI prompt you can copy and take into Claude or ChatGPT — built around that day\'s concept, ready to use.',
      'Voice feedback is live. You can record a note instead of typing.',
    ],
    comingSoon: [
      'Personalized goal-setting. You\'ll set a real commitment at the start — specific, measurable, slightly uncomfortable — and every entry will connect back to it. This was missing and you\'ve earned an early look.',
    ],
    roadmap: [
      'Bookmarking entries to revisit concepts you want to go deeper on',
      'Push notifications with custom timing',
      'Audio lessons (listen instead of read)',
    ],
    surveyPitch: `I have a few quick questions I'd love your take on — specifically around the design direction we're exploring and something called a Prompt Farm. Takes 3 minutes.`,
    ps: `One thought you dropped that stuck with me: the name 'One Percent' clicks once you understand it, but strangers won't have that context. I'm sitting with that. And the streak you lost while traveling — I haven't forgotten that. Working on it.`,
  },
  {
    to: 'snook.erin@gmail.com',
    firstName: 'Erin',
    subject: 'One Percent — I heard you. Here\'s what changed.',
    surveyUrl: `${APP_URL}/survey/b87bca02-09d4-4eee-b4cd-0f25108fb988`,
    intro: `You've been one of the most consistent voices in this beta. Weekly feedback in, post-entry ratings, real comments — including the one about wanting to listen instead of read, and the quiz question about not testing number recall. Both of those landed and one of them is already fixed.`,
    shipped: [
      'Quiz is now application-based. No more "what was the exact number" questions. It now asks you to apply the concept to something real.',
      'Every entry has an AI prompt at the bottom — copy it, take it into Claude or ChatGPT, use it to go deeper in the context of your actual work.',
      'Voice feedback is live. Record a note instead of typing if that\'s easier.',
    ],
    comingSoon: [
      'Personalized goal-setting. You set a real commitment upfront — specific, measurable — and every entry connects back to it. You\'ll see it before beta wraps.',
    ],
    roadmap: [
      'Audio lessons. This is on the list. You said it twice and I heard it both times.',
      'Push notifications with custom timing',
      'Bookmarking entries for deeper follow-up',
    ],
    surveyPitch: `I've got a 3-minute check-in I'd love you to go through. There's a design direction I'm exploring that I want your honest reaction to, and a question about something called a Prompt Farm — a library of ready-to-use AI prompts organized by concept. I think you might have a strong opinion on it.`,
    ps: null,
  },
  {
    to: 'bcsmith988@gmail.com',
    firstName: 'Brian',
    subject: 'One Percent — you said remembering to come back is the hard part. Working on it.',
    surveyUrl: `${APP_URL}/survey/e9d50033-e41a-4b94-9e64-d621e638fb05`,
    intro: `You left a comment after the discovery questions entry that I've thought about more than once: "This one resonated with me as a sales person. My biggest challenge is remembering to come back in and revisit."\n\nThat's not a you problem. That's a product problem. And I'm working on it.\n\nYou also applied the reframe — pain and downstream impact over jumping to solution. In a real call. That's the whole point of this thing.`,
    shipped: [
      'Quiz is application-based now. Not recall. Actual application of the concept.',
      'Every entry ends with an AI prompt you can copy and take into Claude or ChatGPT — to go deeper on the concept in your specific context.',
      'Voice feedback is live if typing isn\'t your thing.',
    ],
    comingSoon: [
      'Personalized goal-setting. You\'ll set a specific commitment at the start and every entry connects back to it. Built directly for the "remembering to come back" problem.',
    ],
    roadmap: [
      'Push notifications with custom timing (the real fix for the habit problem)',
      'Bookmarking entries to revisit later',
      'Audio — listen while you\'re doing something else',
    ],
    surveyPitch: `I'd love 3 minutes from you. A quick check-in with a few questions — including one about a feature called a Prompt Farm that I think would be directly useful for someone running discovery calls.`,
    ps: `Be straight with me in there. If something's not working for you, I'd rather know.`,
  },
  {
    to: 'ldmartin613@gmail.com',
    firstName: 'Landon',
    subject: 'One Percent — you told me what was missing. Here\'s what happened.',
    surveyUrl: `${APP_URL}/survey/e7412e59-02f1-475e-806d-97a1e6eea048`,
    intro: `You gave me some of the most detailed feedback of anyone in this beta. Three separate submissions. You talked about wanting to flag entries for deeper follow-up, the 3x daily structure being ideal but hard without notifications, and the emails being inconsistent.\n\nAll of that is in the product now or on the roadmap.`,
    shipped: [
      'Quiz is now application-based — not recall, not sliders.',
      'Every entry ends with an AI prompt you can copy and use immediately.',
      'Voice feedback if you\'d rather talk than type.',
    ],
    comingSoon: [
      'Personalized goal-setting. You set a real commitment upfront and every entry connects back to it. Directly addresses the "I need a reason to come back" problem.',
    ],
    roadmap: [
      'Bookmarking / flagging entries for deeper follow-up — this is approved and getting built.',
      'Push notifications with custom timing — the real fix for the habit problem.',
      'Audio lessons.',
    ],
    surveyPitch: `I know you said you treat apps like any other product — you let usefulness drive consumption, you don't go out of your way. Fair. That's the right standard. I want to earn that.\n\nOne ask: 3 minutes in this check-in. There's a design direction I want your reaction to, and a couple of questions about where the app goes next.`,
    ps: `Your perspective specifically is useful to me. You think about products differently than most people.`,
  },
  {
    to: 'entreandrew@gmail.com',
    firstName: 'Andrew',
    subject: 'One Percent — honest question from me to you',
    surveyUrl: `${APP_URL}/survey/d404f69d-66f0-4415-849d-e97b77d52e69`,
    intro: `You've been in the beta since day one. I know you haven't gone deep yet and I'm not here to guilt you about that — I'm here to figure out why and fix it.`,
    shipped: [
      'Every entry is three parts: Morning Brief, Midday Reframe, Evening Quiz. Under 5 minutes total.',
      'The quiz is now application-based. Not recall, not guessing. You apply the concept to something real.',
      'Every entry ends with an AI prompt you can take into Claude or ChatGPT to go deeper.',
    ],
    comingSoon: [
      'Personalized goal-setting. You commit to something specific at the start and every entry connects back to it. This is the thing I think changes whether the app feels worth it or not.',
    ],
    roadmap: [
      'Push notifications with custom timing — so you don\'t have to remember it exists',
      'Audio — listen while doing something else',
      'Bookmarking concepts you want to go deeper on',
    ],
    surveyPitch: `I've got 3 questions I'd love your honest take on. One of them is literally "what would make this worth 5 minutes of your day." I want the real answer.`,
    ps: `Jump back in. Entry 001 if you want to start fresh, or wherever you left off. I'll be watching the data.`,
  },
]

function buildHtml(data: typeof EMAILS[0]): string {
  const shippedRows = data.shipped.map(item => `
    <tr>
      <td style="padding:4px 0 4px 0;">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="width:18px;vertical-align:top;padding-top:1px;">
              <span style="color:#09c4b0;font-size:13px;line-height:1.6;">—</span>
            </td>
            <td style="font-size:14px;color:rgba(26,20,10,0.7);line-height:1.7;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:300;">${item}</td>
          </tr>
        </table>
      </td>
    </tr>`).join('')

  const comingSoonRows = data.comingSoon.map(item => `
    <tr>
      <td style="padding:4px 0 4px 0;">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="width:18px;vertical-align:top;padding-top:1px;">
              <span style="color:#a8b800;font-size:13px;line-height:1.6;">—</span>
            </td>
            <td style="font-size:14px;color:rgba(26,20,10,0.7);line-height:1.7;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:300;">${item}</td>
          </tr>
        </table>
      </td>
    </tr>`).join('')

  const roadmapRows = data.roadmap.map(item => `
    <tr>
      <td style="padding:4px 0 4px 0;">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="width:18px;vertical-align:top;padding-top:1px;">
              <span style="color:rgba(26,20,10,0.3);font-size:13px;line-height:1.6;">—</span>
            </td>
            <td style="font-size:14px;color:rgba(26,20,10,0.5);line-height:1.7;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:300;">${item}</td>
          </tr>
        </table>
      </td>
    </tr>`).join('')

  const introParagraphs = data.intro.split('\n\n').map(p =>
    `<p style="margin:0 0 14px 0;font-size:14px;color:rgba(26,20,10,0.7);line-height:1.75;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:300;">${p}</p>`
  ).join('')

  const surveyPitchParagraphs = data.surveyPitch.split('\n\n').map(p =>
    `<p style="margin:0 0 14px 0;font-size:14px;color:rgba(26,20,10,0.7);line-height:1.75;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:300;">${p}</p>`
  ).join('')

  const psBlock = data.ps ? `
    <p style="margin:24px 0 0 0;font-size:13px;color:rgba(26,20,10,0.45);line-height:1.7;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-style:italic;">P.S. — ${data.ps}</p>
  ` : ''

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#e4e0d6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#e4e0d6;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;">

        <!-- Wordmark -->
        <tr><td style="padding-bottom:24px;">
          <span style="font-size:10px;letter-spacing:0.28em;color:rgba(26,20,10,0.4);font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:500;text-transform:uppercase;">One Percent</span>
        </td></tr>

        <!-- Card -->
        <tr><td style="background:#faf8f4;border:1px solid rgba(26,20,10,0.09);border-radius:12px;padding:36px 36px 32px;box-shadow:0 4px 24px rgba(26,20,10,0.07);">

          <!-- Greeting -->
          <p style="margin:0 0 20px 0;font-size:14px;color:rgba(26,20,10,0.5);line-height:1.6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${data.firstName},</p>

          <!-- Intro -->
          ${introParagraphs}

          <!-- Divider -->
          <div style="height:1px;background:rgba(26,20,10,0.08);margin:24px 0;"></div>

          <!-- Shipped -->
          <p style="margin:0 0 12px 0;font-size:9px;letter-spacing:0.22em;color:rgba(26,20,10,0.4);font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;text-transform:uppercase;">Shipped based on feedback</p>
          <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:20px;">
            ${shippedRows}
          </table>

          <!-- Coming Soon -->
          <p style="margin:0 0 12px 0;font-size:9px;letter-spacing:0.22em;color:rgba(26,20,10,0.4);font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;text-transform:uppercase;">Coming before end of beta</p>
          <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:20px;">
            ${comingSoonRows}
          </table>

          <!-- Roadmap -->
          <p style="margin:0 0 12px 0;font-size:9px;letter-spacing:0.22em;color:rgba(26,20,10,0.4);font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;text-transform:uppercase;">On the roadmap</p>
          <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:24px;">
            ${roadmapRows}
          </table>

          <!-- Divider -->
          <div style="height:1px;background:rgba(26,20,10,0.08);margin:24px 0;"></div>

          <!-- Survey pitch -->
          ${surveyPitchParagraphs}

          <!-- CTA Button -->
          <div style="margin:24px 0;">
            <a href="${data.surveyUrl}" style="display:inline-block;background:#1a140a;color:#faf8f4;font-size:10px;font-weight:500;letter-spacing:0.18em;text-decoration:none;padding:14px 28px;border-radius:8px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;text-transform:uppercase;">Take the Check-In →</a>
          </div>

          <!-- Divider -->
          <div style="height:1px;background:rgba(26,20,10,0.08);margin:24px 0;"></div>

          <!-- Sign off -->
          <p style="margin:0;font-size:14px;color:rgba(26,20,10,0.7);line-height:1.7;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:300;">— Matthew<br>
            <a href="https://mpgink.com" style="color:rgba(26,20,10,0.35);text-decoration:none;font-size:11px;letter-spacing:0.1em;">mpgink.com</a>
          </p>

          ${psBlock}

        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 0 0 0;text-align:center;">
          <span style="font-size:10px;color:rgba(26,20,10,0.3);letter-spacing:0.12em;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">ONE PERCENT BETA · mpgink.com</span>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const results = []

    for (const email of EMAILS) {
      const html = buildHtml(email)

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Matthew @ One Percent <matthew@mpgink.com>',
          reply_to: 'matthew@mpgink.com',
          to: email.to,
          subject: email.subject,
          html,
        }),
      })

      const data = await res.json()
      results.push({ to: email.to, ok: res.ok, data })

      // Small delay between sends
      await new Promise(r => setTimeout(r, 400))
    }

    const allOk = results.every(r => r.ok)

    return new Response(JSON.stringify({ success: allOk, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
