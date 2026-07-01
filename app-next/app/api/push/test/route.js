import webpush from 'web-push'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
const PRIVATE = process.env.VAPID_PRIVATE_KEY
const SUBJECT = process.env.VAPID_SUBJECT || 'mailto:matthew@mpgink.com'

let configured = false
function ensureConfigured() {
  if (configured) return true
  if (!PUBLIC || !PRIVATE) return false
  webpush.setVapidDetails(SUBJECT, PUBLIC, PRIVATE)
  configured = true
  return true
}

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } })

export async function POST(req) {
  try {
    if (!ensureConfigured()) {
      return json(
        { error: 'Push not configured on the server. Add NEXT_PUBLIC_VAPID_PUBLIC_KEY + VAPID_PRIVATE_KEY in Vercel and redeploy.' },
        500
      )
    }
    const { subscription } = await req.json()
    if (!subscription?.endpoint) return json({ error: 'No subscription provided' }, 400)

    const payload = JSON.stringify({
      title: 'One Percent',
      body: "Test push — you're wired up. Your daily 1% will land right here.",
      url: '/',
      tag: 'push-test',
    })
    await webpush.sendNotification(subscription, payload)
    return json({ ok: true })
  } catch (err) {
    // 404/410 = subscription expired/unsubscribed; surface the code for the UI.
    return json({ error: err?.body || err?.message || 'send failed', statusCode: err?.statusCode }, 500)
  }
}
