import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const APP_URL = 'https://one-percent-app.vercel.app'

function buildHtml(firstName: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Inter',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#111;border:1px solid #222;border-radius:8px;padding:40px 36px;">
        <tr><td>
          <div style="font-size:11px;letter-spacing:0.18em;color:#555;margin-bottom:28px;text-transform:uppercase;">One Percent</div>

          <p style="margin:0 0 16px 0;font-size:15px;color:#999;line-height:1.7;">Hey ${firstName},</p>

          <p style="margin:0 0 16px 0;font-size:15px;color:#999;line-height:1.7;">I'm Matthew — I built One Percent.</p>

          <p style="margin:0 0 16px 0;font-size:15px;color:#999;line-height:1.7;">Honestly, this all started as a way to grow instead of scroll. I kept picking up my phone in the in-between moments — waiting, commuting, winding down — and watching the time disappear into a feed that gave nothing back. I wanted something that did.</p>

          <p style="margin:0 0 16px 0;font-size:15px;color:#999;line-height:1.7;">So I built it.</p>

          <p style="margin:0 0 16px 0;font-size:15px;color:#999;line-height:1.7;">You're one of the first people using it outside of me. That means a lot — and it means you are essential to this. If you find a bug, log it. If something doesn't feel right, log it. If a concept lands weird or a quiz question is off, log it. There's a feedback button right in the app. Every single thing you submit goes directly to me. This only gets better because of you.</p>

          <div style="margin-top:32px;">
            <a href="${APP_URL}" style="display:inline-block;background:#E8FF47;color:#0a0a0a;font-size:12px;font-weight:700;letter-spacing:0.1em;text-decoration:none;padding:13px 28px;border-radius:4px;text-transform:uppercase;">Open One Percent →</a>
          </div>

          <p style="margin:32px 0 0 0;font-size:15px;color:#999;line-height:1.7;">P.S. — Hit reply and tell me what made you say yes to this. I'm genuinely curious.</p>

          <div style="margin-top:40px;padding-top:24px;border-top:1px solid #1e1e1e;font-size:11px;color:#444;line-height:1.7;">
            — Matthew<br>
            <a href="https://mpgink.com" style="color:#555;text-decoration:none;">mpgink.com</a>
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

serve(async (req) => {
  try {
    // Supabase webhook sends the new row as JSON body
    const payload = await req.json()

    // Support both direct calls and Supabase DB webhook format
    const record = payload.record ?? payload

    const firstName = record.first_name || 'there'
    const email = record.email

    if (!email) {
      return new Response(JSON.stringify({ error: 'No email in payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Skip if onboarding not complete (webhook may fire before onboarding)
    // We handle this by calling the function explicitly after onboarding completes
    const html = buildHtml(firstName)

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Matthew @ One Percent <matthew@mpgink.com>',
        reply_to: 'matthew@mpgink.com',
        to: email,
        subject: "Welcome to the Founders Club | One Percent",
        html,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return new Response(JSON.stringify({ error: err }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ sent: true, to: email }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
