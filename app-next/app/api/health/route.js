import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY })

// Non-destructive health probe for the admin API tab. Verifies the Claude key
// with a 1-token call and reports which server-side env vars are configured.
// Deliberately does NOT touch the email senders (invoking them sends real mail).
export async function GET() {
  const out = {
    env: {
      claudeKey: !!(process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY),
      serviceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    },
    claude: null,
  }

  if (out.env.claudeKey) {
    const start = Date.now()
    try {
      await client.messages.create({ model: 'claude-sonnet-4-6', max_tokens: 1, messages: [{ role: 'user', content: 'ping' }] })
      out.claude = { ok: true, ms: Date.now() - start }
    } catch (e) {
      out.claude = { ok: false, ms: Date.now() - start, error: e?.message || 'call failed' }
    }
  } else {
    out.claude = { ok: false, error: 'CLAUDE_API_KEY not set' }
  }

  return new Response(JSON.stringify(out), { headers: { 'Content-Type': 'application/json' } })
}
