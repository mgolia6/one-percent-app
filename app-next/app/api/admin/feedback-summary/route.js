import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY })
const MODEL = 'claude-sonnet-4-6'

const SYSTEM = `You are a product analyst summarizing beta-tester feedback for One Percent, a daily micro-learning app. You'll get a JSON array of feedback items (type, rating, recommend, comment, missing, win).

Write a tight, decision-useful summary for the founder. Use this structure with short markdown headers:

**The signal** — 2-3 sentences: overall sentiment and the single most important takeaway.
**What's working** — 2-4 bullets, each grounded in what testers actually said.
**Friction & asks** — 2-4 bullets: complaints, confusion, and requested topics/features (group similar ones, note how many raised each).
**Do next** — 1-3 concrete, prioritized actions.

Rules: be specific and quote a few short phrases verbatim where they land. No preamble, no "here's a summary". If feedback is thin, say so plainly. Keep the whole thing under ~250 words.`

export async function POST(req) {
  try {
    const { items } = await req.json()
    if (!Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ summary: 'No written feedback to summarize yet.' }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 700,
      system: SYSTEM,
      messages: [{ role: 'user', content: `Feedback items (${items.length}):\n\n${JSON.stringify(items, null, 1)}` }],
    })
    const summary = (msg.content?.[0]?.text || '').trim()
    return new Response(JSON.stringify({ summary }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    return new Response(JSON.stringify({ error: err?.message || 'Something went wrong' }), { status: 500 })
  }
}
