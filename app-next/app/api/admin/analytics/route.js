import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Server-side PostHog query proxy. The PostHog *query* API needs a Personal API
// key (phx_…) with read scope — NOT the public ingest key (phc_…) the client
// was sending. That key must stay server-side, so the admin calls this route
// (authenticated with their Supabase token) and we run the HogQL query here.

const PH_HOST = process.env.POSTHOG_HOST || 'https://us.posthog.com'
const PH_PROJECT = process.env.POSTHOG_PROJECT_ID || '470392'
const PH_KEY = process.env.POSTHOG_PERSONAL_KEY
const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function POST(req) {
  try {
    if (!PH_KEY) {
      return new Response(JSON.stringify({ error: 'POSTHOG_PERSONAL_KEY not set in Vercel — add a PostHog personal API key (phx_…) with query read scope.' }), { status: 503 })
    }

    // Admin gate: verify the caller's Supabase token and is_admin flag.
    const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '')
    if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    const sb = createClient(SUPA_URL, ANON, { global: { headers: { Authorization: `Bearer ${token}` } } })
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    const { data: prof } = await sb.from('profiles').select('is_admin').eq('id', user.id).maybeSingle()
    if (!prof?.is_admin) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })

    const { query } = await req.json()
    if (!query) return new Response(JSON.stringify({ error: 'Missing query' }), { status: 400 })

    const res = await fetch(`${PH_HOST}/api/projects/${PH_PROJECT}/query/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${PH_KEY}` },
      body: JSON.stringify({ query: { kind: 'HogQLQuery', query } }),
    })
    if (!res.ok) {
      const detail = (await res.text()).slice(0, 240)
      return new Response(JSON.stringify({ error: `PostHog ${res.status}: ${detail}` }), { status: 502 })
    }
    const json = await res.json()
    return new Response(JSON.stringify({ results: json.results || [] }), { headers: { 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ error: e?.message || 'Something went wrong' }), { status: 500 })
  }
}
