// Canonical category registry — the single source of truth for One Percent's
// categories (name, edition prefix, locked design-system accent color, scope).
//
// New surfaces (favorite/block preferences, the native app) MUST import from
// here rather than re-declaring category lists or colors. Legacy duplicated
// copies still live in app/page.js, app/admin/page.js, and app/profile/page.js;
// those should migrate to this module over time (and will in the native build).

export const CATEGORIES = [
  { key: 'AI',                       short: 'AI',      prefix: 'AI', color: '#47FFE8', colorDim: 'rgba(71,255,232,0.10)', scope: 'How AI actually works — and how to use it well.' },
  { key: 'Sales Craft',              short: 'SALES',   prefix: 'SC', color: '#E8FF47', colorDim: 'rgba(232,255,71,0.10)', scope: 'Discovery, negotiation, and moving deals forward.' },
  { key: 'Vocab & Language',         short: 'VOCAB',   prefix: 'VL', color: '#FF8C47', colorDim: 'rgba(255,140,71,0.10)', scope: 'Words, framing, and how language shapes thought.' },
  { key: 'Mental Models',            short: 'MENTAL',     prefix: 'MM', color: '#C847FF', colorDim: 'rgba(200,71,255,0.10)', scope: 'Thinking tools for sharper decisions.' },
  { key: 'Philosophy',               short: 'PHILOSOPHY', prefix: 'PH', color: '#FF4778', colorDim: 'rgba(255,71,120,0.10)', scope: 'Practices and stances for living well.' },
  { key: 'Neuroscience & Cognition', short: 'NEURO',   prefix: 'NC', color: '#47C8FF', colorDim: 'rgba(71,200,255,0.10)', scope: 'How the brain learns, remembers, and decides.' },
  { key: 'Communication',            short: 'COMM',    prefix: 'CM', color: '#FF8C00', colorDim: 'rgba(255,140,0,0.10)',  scope: 'Being understood, and understanding others.' },
  // ── New (2026-06-28) — content sprint in progress toward ~50 each ──
  { key: 'History',                  short: 'HISTORY', prefix: 'HS', color: '#E0A93D', colorDim: 'rgba(224,169,61,0.10)', scope: 'Pivotal events, figures, and turning points — and why they still matter.' },
  { key: 'Personal Finance',         short: 'FINANCE', prefix: 'PF', color: '#3DE88A', colorDim: 'rgba(61,232,138,0.10)', scope: 'Money mechanics + behavior: compounding, accounts, taxes, avoiding traps.' },
  { key: 'Health & Performance',     short: 'HEALTH',  prefix: 'HP', color: '#FF5151', colorDim: 'rgba(255,81,81,0.10)',  scope: "The body's operating manual: sleep, training, nutrition, recovery, longevity." },
]

export const CATEGORY_KEYS = CATEGORIES.map(c => c.key)
export const CATEGORY_BY_KEY = Object.fromEntries(CATEGORIES.map(c => [c.key, c]))

export const categoryColor = (key) => CATEGORY_BY_KEY[key]?.color || '#ffffff'
export const categoryColorDim = (key) => CATEGORY_BY_KEY[key]?.colorDim || 'rgba(255,255,255,0.10)'
export const categoryShort = (key) => CATEGORY_BY_KEY[key]?.short || key
export const categoryPrefix = (key) => CATEGORY_BY_KEY[key]?.prefix || null

export default CATEGORIES
