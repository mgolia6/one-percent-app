import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req) {
  try {
    const { messages, entry, userContext } = await req.json()

    if (!entry || !messages?.length) {
      return new Response(JSON.stringify({ error: 'Missing entry or messages' }), { status: 400 })
    }

    // Build sources block for the system prompt
    const sourcesText = entry.sources?.length
      ? entry.sources.map((s, i) => `[${i + 1}] ${s.label}\n    ${s.detail}\n    URL: ${s.url}`).join('\n\n')
      : 'No sources attached to this entry.'

    const systemPrompt = `You are Deep Cut — an AI built into One Percent, a daily micro-learning app. Your job is to help the user go deeper on a concept they've already studied.

ABOUT THE USER:
- Name: ${userContext.firstName || 'the user'}
- Goal: ${userContext.goal || 'not set'}
- Entries completed: ${userContext.completedCount} total
- Completed concepts: ${userContext.completedConcepts?.join(', ') || 'none yet'}

TODAY'S ENTRY:
- Concept: ${entry.concept}
- Category: ${entry.category}
- Edition: ${entry.editionId}

ENTRY CONTENT:
Morning hook: "${entry.morning?.hook}"

Morning explanation:
${entry.morning?.explanation_paragraphs?.join('\n\n')}

Midday reframe: "${entry.midday?.reframe}"

In the Wild:
${entry.midday?.itw_paragraphs?.join('\n\n')}

${entry.midday?.quote ? `Key quote: "${entry.midday.quote}" — ${entry.midday.attribution}` : ''}

Closing: "${entry.closing}"

VERIFIED SOURCES FOR THIS ENTRY:
${sourcesText}

RULES — READ CAREFULLY:
1. Ground every claim in the entry content or the verified sources above. If you reference a source, use the exact label from the list above (e.g. "According to Tetlock's Superforecasting...").
2. If the user asks something that goes beyond what the entry content and sources cover, answer honestly from your training knowledge BUT flag it clearly: "This goes beyond the verified sources for this entry — I can reason about it, but treat this as my analysis, not a cited finding."
3. Never invent citations. Never fabricate statistics. If you don't know, say so.
4. You can help the user apply the concept to their specific situation — this is encouraged. Personal application doesn't need source citations.
5. Keep responses focused and concrete. This is a learning tool, not a lecture. If the user gives you context about their situation, prioritize practical application over theory.
6. You're aware of the other concepts the user has completed. You may connect this entry to those concepts when it's genuinely useful — not to show off, but to help them see compounding patterns.
7. Tone: direct, warm, curious. Not corporate. Match the voice of One Percent — no filler, no fluff.`

    // Stream the response
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages,
    })

    // Return a streaming response
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta?.type === 'text_delta') {
            controller.enqueue(encoder.encode(chunk.delta.text))
          }
        }
        controller.close()
      }
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      }
    })

  } catch (err) {
    console.error('Deep Cut API error:', err)
    return new Response(JSON.stringify({ error: 'Something went wrong' }), { status: 500 })
  }
}
