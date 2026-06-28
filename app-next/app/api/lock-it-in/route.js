import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'

// Vercel stores the key as CLAUDE_API_KEY; fall back to ANTHROPIC_API_KEY for local dev.
const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY })

const MODEL = 'claude-sonnet-4-6'

// Compact grounding block built from the entry's verified content.
function grounding(entry) {
  const sources = entry.sources?.length
    ? entry.sources.map((s, i) => `[${i + 1}] ${s.label} — ${s.detail} (${s.url})`).join('\n')
    : 'No sources attached.'
  return `CONCEPT: ${entry.concept} (${entry.category})

Morning hook: "${entry.morning?.hook || ''}"
Explanation:
${(entry.morning?.explanation_paragraphs || []).join('\n')}

Midday reframe: "${entry.midday?.reframe || ''}"
In the wild:
${(entry.midday?.itw_paragraphs || []).join('\n')}
${entry.midday?.quote ? `Quote: "${entry.midday.quote}" — ${entry.midday.attribution}` : ''}

Closing: "${entry.closing || ''}"

VERIFIED SOURCES:
${sources}`
}

// apply = an actionable technique/practice; aware = understand-and-recognize.
function typeGuidance(entry) {
  if (entry.lockin_type === 'aware') {
    return `This concept is one to UNDERSTAND and RECOGNIZE, not a technique to perform. When the learner gives an example, point them to where it shows up in the real world and why it's worth understanding. Do NOT tell them to "apply" or "implement" it in their day-to-day — that would be forced and false for a concept like this.`
  }
  return `This concept is APPLICABLE. When the learner gives an example, affirm it and gently point toward where it could be useful — but let them keep ownership; don't assign them homework.`
}

const COACH_SYSTEM = (entry) => `You are Deep Cut, the AI coach inside One Percent — a daily micro-learning app. The learner is doing "Lock It In": a short, learning-focused recall exercise on a concept they just studied. The app asks the questions; you respond to each answer.

${grounding(entry)}

${typeGuidance(entry)}

RULES:
1. Respond in 2–4 sentences. Affirm what they got right, then sharpen or fill gaps — grounded ONLY in the concept and sources above.
2. Do NOT ask a new question. The app supplies the next one.
3. The goal is understanding, not a personal to-do. Never pressure them to commit to using it.
4. Tone: warm, direct, curious. No filler, no "great question," no emoji.`

const CLOSE_SYSTEM = (entry) => `You are closing a learner's "Lock It In" recall session and assessing it, for a learning app. Be fair but honest.

${grounding(entry)}

You are given the learner's three answers. The third answer is their "keeper" — a one-sentence distillation they want to remember. This keeper may be stored and resurfaced later for spaced repetition, so it MUST be accurate and substantive — never lock in a vague or wrong sentence.

Produce:
- score: how many of the three answers show genuine understanding (0–3). Be generous on effort, strict on accuracy.
- recap: one warm sentence (≤20 words) on what they nailed or should revisit.
- hook: a vivid, concrete, slightly exaggerated mental image or association that makes THIS concept memorable (one sentence). Make it visual and a little surprising — a memory aid, not a definition.
- keeper_ok: true only if their keeper (answer 3) is BOTH accurate and substantive. false if it is vague/lazy ("it's important") or contains a misconception.
- keeper_suggested: a tightened, accurate one-sentence version of their keeper, grounded in the sources. Preserve their angle where possible; fix any inaccuracy.

Return ONLY compact JSON, no prose, no code fences:
{"score":0-3,"recap":"...","hook":"...","keeper_ok":true|false,"keeper_suggested":"..."}`

export async function POST(req) {
  try {
    const { action, entry, messages, qa } = await req.json()
    if (!entry?.concept) {
      return new Response(JSON.stringify({ error: 'Missing entry' }), { status: 400 })
    }

    // ── CLOSE: score + memory hook + keeper check (non-streaming, structured) ──
    if (action === 'grade' || action === 'close') {
      if (!Array.isArray(qa) || !qa.length) {
        return new Response(JSON.stringify({ error: 'Missing qa' }), { status: 400 })
      }
      const transcript = qa.map((t, i) => `Q${i + 1}: ${t.q}\nLearner: ${t.a}`).join('\n\n')
      const keeper = qa[qa.length - 1]?.a || ''
      const msg = await client.messages.create({
        model: MODEL,
        max_tokens: 400,
        system: CLOSE_SYSTEM(entry),
        messages: [{ role: 'user', content: `${transcript}\n\nAssess this session. The keeper is answer 3: "${keeper}"` }],
      })
      const text = (msg.content || []).filter(b => b.type === 'text').map(b => b.text).join('').trim()
      let v
      try {
        v = JSON.parse(text.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim())
      } catch {
        // If the model output won't parse, fail safe: pass, keep their keeper, no hook.
        v = { score: 3, recap: 'Nice work locking this one in.', hook: '', keeper_ok: true, keeper_suggested: keeper }
      }
      const score = Math.max(0, Math.min(3, Number(v.score) || 0))
      return new Response(JSON.stringify({
        score,
        recap: v.recap || '',
        hook: v.hook || '',
        keeper_ok: v.keeper_ok !== false,
        keeper_suggested: v.keeper_suggested || keeper,
      }), { headers: { 'Content-Type': 'application/json' } })
    }

    // ── COACH: streamed reply to the learner's latest answer ──
    if (!messages?.length) {
      return new Response(JSON.stringify({ error: 'Missing messages' }), { status: 400 })
    }
    const stream = await client.messages.stream({
      model: MODEL,
      max_tokens: 256,
      system: COACH_SYSTEM(entry),
      messages,
    })
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta?.type === 'text_delta') {
            controller.enqueue(encoder.encode(chunk.delta.text))
          }
        }
        controller.close()
      },
    })
    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Transfer-Encoding': 'chunked' },
    })
  } catch (err) {
    console.error('Lock It In API error:', err)
    return new Response(JSON.stringify({ error: err?.message || 'Something went wrong' }), { status: 500 })
  }
}
