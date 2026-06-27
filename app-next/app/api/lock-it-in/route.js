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

const COACH_SYSTEM = (entry) => `You are Deep Cut, the AI coach inside One Percent — a daily micro-learning app. The learner is doing "Lock It In": a short active-recall exercise on a concept they just studied. The app asks the questions; you respond to each answer.

${grounding(entry)}

RULES:
1. Respond in 2–4 sentences. Affirm what they got right, then gently fill gaps or correct mistakes — grounded ONLY in the concept and sources above.
2. Do NOT ask a new question. The app supplies the next one.
3. If they're vague or wrong, be encouraging but honest — point them at the right idea.
4. Tone: warm, direct, curious. No filler, no "great question," no emoji.`

const GRADE_SYSTEM = (entry) => `You are grading a learner's active-recall answers about a concept, for a learning app. Be fair but honest.

${grounding(entry)}

Grade each of the three answers. An answer PASSES if it shows genuine understanding or a concrete, sensible application — even if imperfectly worded. It FAILS if it is blank, off-topic, a non-answer ("idk", "not sure"), or fundamentally wrong about the concept.

Return ONLY compact JSON, no prose, no code fences:
{"m1":true|false,"m2":true|false,"m3":true|false,"recap":"one warm sentence, max 20 words, on what they nailed or should revisit"}`

export async function POST(req) {
  try {
    const { action, entry, messages, qa, userContext = {} } = await req.json()
    if (!entry?.concept) {
      return new Response(JSON.stringify({ error: 'Missing entry' }), { status: 400 })
    }

    // ── GRADE: structured 0–3 scoring (non-streaming) ──
    if (action === 'grade') {
      if (!Array.isArray(qa) || !qa.length) {
        return new Response(JSON.stringify({ error: 'Missing qa' }), { status: 400 })
      }
      const transcript = qa.map((t, i) => `Q${i + 1}: ${t.q}\nLearner: ${t.a}`).join('\n\n')
      const msg = await client.messages.create({
        model: MODEL,
        max_tokens: 200,
        system: GRADE_SYSTEM(entry),
        messages: [{ role: 'user', content: `${transcript}\n\nGrade these three answers.` }],
      })
      const text = (msg.content || []).filter(b => b.type === 'text').map(b => b.text).join('').trim()
      let verdict
      try {
        verdict = JSON.parse(text.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim())
      } catch {
        // If grading output can't be parsed, give the learner the benefit of the doubt.
        verdict = { m1: true, m2: true, m3: true, recap: 'Nice work locking this one in.' }
      }
      const score = ['m1', 'm2', 'm3'].reduce((n, k) => n + (verdict[k] ? 1 : 0), 0)
      return new Response(JSON.stringify({ score, recap: verdict.recap || '' }), {
        headers: { 'Content-Type': 'application/json' },
      })
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
