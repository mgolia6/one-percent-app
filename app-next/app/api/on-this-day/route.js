import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
// Never CDN-cache: the route reads/writes the daily card, so each call (esp. the
// cron) must actually execute. The DB row is the cache layer, not the CDN.
export const dynamic = 'force-dynamic'

// Vercel stores the key as CLAUDE_API_KEY; fall back to ANTHROPIC_API_KEY for local dev.
const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY })
const MODEL = 'claude-sonnet-4-6'

// Server-side cache/persist (service role). Optional — if the key isn't set the
// route still works (generates on demand); it just won't self-cache. The daily
// cron relies on this to fill the archive on days nobody opens the app.
const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const adminDb = SUPA_URL && SERVICE_KEY ? createClient(SUPA_URL, SERVICE_KEY, { auth: { persistSession: false } }) : null

// "On This Day" — the facts are pulled from Wikipedia's on-this-day feed (real,
// sourced, auto-verified). Claude only PICKS the most resonant event and writes
// the One Percent-voice blurb. It is never asked to recall history from memory,
// so it can't invent a date or event.

function pad(n) { return String(n).padStart(2, '0') }

const SYSTEM = `You are the editor of "On This Day" — a daily bonus card inside One Percent, a micro-learning app for sharp, curious adults.

You are given a list of REAL historical events that happened on today's calendar date (sourced from Wikipedia). Your only job is to:
1. PICK the single most resonant one — prefer events that are genuinely significant, broadly interesting, and carry a transferable lesson or a surprising hook. Avoid narrow/local sports results, obscure administrative events, and anything grim-for-its-own-sake.
2. Write it in the One Percent voice: tight, vivid, a little contrarian, never cutesy or "fun fact"-y.

Rules:
- Use ONLY the facts in the provided list. Do not add details that aren't there. Do not change the year.
- "blurb": 1–2 sentences — what happened, with one concrete, memorable detail. Present tense or past, no "On this day" preamble.
- "why_today": 1 sentence — the angle that makes it worth 20 seconds: the principle, the irony, the through-line to now. This is the One Percent.
- Respond with ONLY a JSON object, no prose, no code fences:
{"pick": <index number from the list>, "blurb": "...", "why_today": "..."}`

export async function GET(req) {
  try {
    const url = new URL(req.url)
    const dateParam = url.searchParams.get('date') // optional YYYY-MM-DD for testing
    const now = dateParam ? new Date(dateParam + 'T12:00:00Z') : new Date()
    if (isNaN(now)) return new Response(JSON.stringify({ error: 'Bad date' }), { status: 400 })
    const mm = pad(now.getUTCMonth() + 1)
    const dd = pad(now.getUTCDate())
    const isoDate = `${now.getUTCFullYear()}-${mm}-${dd}`
    const isReal = !dateParam // only the genuine "today" is cached/persisted

    // Serve the cached card if we already generated one for this date.
    if (adminDb && isReal) {
      const { data: cached } = await adminDb.from('on_this_day').select('*').eq('date', isoDate).maybeSingle()
      if (cached?.event) {
        return new Response(JSON.stringify(cached), {
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
        })
      }
    }

    // Real, sourced events for this month/day. Cached at the edge for a day.
    const wikiRes = await fetch(
      `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${mm}/${dd}`,
      { headers: { 'User-Agent': 'OnePercentApp/1.0 (onepercent.mpgink.com)' }, next: { revalidate: 86400 } },
    )
    if (!wikiRes.ok) return new Response(JSON.stringify({ error: 'history source unavailable' }), { status: 502 })
    const wiki = await wikiRes.json()

    const candidates = (wiki.events || [])
      .filter(e => e.text && e.pages?.[0]?.content_urls?.desktop?.page)
      .map(e => {
        const page = e.pages[0]
        return {
          year: e.year,
          text: e.text,
          source_title: page.titles?.normalized || page.title || 'Wikipedia',
          source_url: page.content_urls.desktop.page,
        }
      })
      .slice(0, 18)

    if (!candidates.length) return new Response(JSON.stringify({ error: 'no events found' }), { status: 404 })

    const list = candidates.map((c, i) => `[${i}] ${c.year}: ${c.text}`).join('\n')

    let pick = 0, blurb = '', why_today = ''
    try {
      const msg = await client.messages.create({
        model: MODEL,
        max_tokens: 400,
        system: SYSTEM,
        messages: [{ role: 'user', content: `Today is ${mm}/${dd}. Events:\n\n${list}` }],
      })
      const raw = (msg.content?.[0]?.text || '').trim().replace(/^```json\s*|\s*```$/g, '')
      const parsed = JSON.parse(raw)
      if (Number.isInteger(parsed.pick) && parsed.pick >= 0 && parsed.pick < candidates.length) pick = parsed.pick
      blurb = (parsed.blurb || '').trim()
      why_today = (parsed.why_today || '').trim()
    } catch (_) {
      // Fall back to the first candidate with a plain framing if the model output is unusable.
      blurb = candidates[0].text
      why_today = ''
    }

    const chosen = candidates[pick]
    const card = {
      date: isoDate,
      year: chosen.year,
      event: chosen.text,
      blurb: blurb || chosen.text,
      why_today,
      source_url: chosen.source_url,
      source_title: chosen.source_title,
      category: 'History',
    }

    // Persist so it's the same shared card all day (and fills the archive when
    // the daily cron calls this on a day no user has opened the app).
    if (adminDb && isReal) {
      await adminDb.from('on_this_day').upsert(card, { onConflict: 'date', ignoreDuplicates: true })
    }

    return new Response(JSON.stringify(card), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err?.message || 'Something went wrong' }), { status: 500 })
  }
}
