#!/usr/bin/env node
// Deterministic entry promotion — the four-file sync, scripted, to kill the
// class of bug where one file gets updated and the others don't.
//
// Updates atomically (all-or-nothing in one run):
//   1. lib/config.js            → TOTAL_ENTRIES
//   2. app/page.js              → const ENTRIES manifest (appends rows)
//   3. public/entries/NNN.json  → one file per promoted draft (verified:true)
// (profile/page.js no longer keeps its own ENTRIES array — it imports lib/categories.)
//
// DRY-RUN BY DEFAULT. Pass --write to actually change files. Always `npm run build` after.
//
// Usage:
//   node scripts/promote.mjs --dir ../Drafts/new-categories/History            # dry-run all drafts in dir
//   node scripts/promote.mjs --dir ../Drafts/new-categories/History --only HS.1,HS.2,HS.3
//   node scripts/promote.mjs --dir ../Drafts/new-categories/History --write --by Matthew --date 2026-06-29

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const APP = path.resolve(__dirname, '..')           // app-next/

function arg(name, def = null) {
  const i = process.argv.indexOf(`--${name}`)
  if (i === -1) return def
  const v = process.argv[i + 1]
  return (!v || v.startsWith('--')) ? true : v
}

const dir = arg('dir')
const write = !!arg('write')
const by = arg('by', 'Matthew')
const date = arg('date', new Date().toISOString().slice(0, 10))
const only = arg('only') ? String(arg('only')).split(',').map(s => s.trim()) : null

if (!dir) { console.error('ERROR: --dir <draft folder> is required'); process.exit(1) }
const draftDir = path.resolve(process.cwd(), dir)
if (!fs.existsSync(draftDir)) { console.error(`ERROR: draft dir not found: ${draftDir}`); process.exit(1) }

const CONFIG = path.join(APP, 'lib/config.js')
const PAGE = path.join(APP, 'app/page.js')
const ENTRIES_DIR = path.join(APP, 'public/entries')

// --- read current TOTAL_ENTRIES ---
const configSrc = fs.readFileSync(CONFIG, 'utf8')
const totalMatch = configSrc.match(/TOTAL_ENTRIES\s*=\s*(\d+)/)
if (!totalMatch) { console.error('ERROR: could not find TOTAL_ENTRIES in config.js'); process.exit(1) }
const currentTotal = parseInt(totalMatch[1], 10)

// --- load + order drafts ---
let files = fs.readdirSync(draftDir).filter(f => f.endsWith('.json'))
  .sort((a, b) => {
    const na = (a.match(/-(\d+)-/) || [])[1], nb = (b.match(/-(\d+)-/) || [])[1]
    return (parseInt(na || 0) - parseInt(nb || 0)) || a.localeCompare(b)
  })
let drafts = files.map(f => ({ file: f, json: JSON.parse(fs.readFileSync(path.join(draftDir, f), 'utf8')) }))
if (only) drafts = drafts.filter(d => only.includes(d.json.editionId))
if (!drafts.length) { console.error('ERROR: no drafts matched'); process.exit(1) }

// --- guard: editionIds not already in the manifest ---
const pageSrc = fs.readFileSync(PAGE, 'utf8')
const dupes = drafts.filter(d => pageSrc.includes(`editionId: '${d.json.editionId}'`))
if (dupes.length) { console.error(`ERROR: already in manifest: ${dupes.map(d => d.json.editionId).join(', ')}`); process.exit(1) }

// --- assign sequential numbers ---
let n = currentTotal
const plan = drafts.map(d => {
  n += 1
  const num = String(n).padStart(3, '0')
  if (fs.existsSync(path.join(ENTRIES_DIR, `${num}.json`)))
    { console.error(`ERROR: public/entries/${num}.json already exists — aborting`); process.exit(1) }
  return { num, editionId: d.json.editionId, concept: d.json.concept, category: d.json.category, json: d.json }
})
const newTotal = n

console.log(`\nPROMOTION PLAN  (${write ? 'WRITE' : 'DRY-RUN'})`)
console.log(`  drafts dir : ${draftDir}`)
console.log(`  TOTAL_ENTRIES: ${currentTotal} → ${newTotal}`)
console.log(`  signed-off by: ${by}   date: ${date}`)
console.log(`  promoting ${plan.length}:`)
for (const p of plan) console.log(`    ${p.num}  ${p.editionId.padEnd(8)} ${p.category.padEnd(20)} ${p.concept}`)

if (!write) { console.log('\nDry run — no files changed. Re-run with --write to apply.\n'); process.exit(0) }

// --- 1. entry JSONs ---
for (const p of plan) {
  const out = { ...p.json, verified: true, verified_by: by, verified_date: date }
  fs.writeFileSync(path.join(ENTRIES_DIR, `${p.num}.json`), JSON.stringify(out, null, 2) + '\n')
}

// --- 2. manifest rows in page.js (insert before the ENTRIES array's closing ]) ---
const lines = pageSrc.split('\n')
const startIdx = lines.findIndex(l => l.includes('const ENTRIES = ['))
if (startIdx === -1) { console.error('ERROR: const ENTRIES = [ not found'); process.exit(1) }
let closeIdx = -1
for (let i = startIdx; i < lines.length; i++) { if (lines[i].trim() === ']') { closeIdx = i; break } }
if (closeIdx === -1) { console.error('ERROR: ENTRIES closing ] not found'); process.exit(1) }
const rows = plan.map(p => `  { entry: '${p.num}', editionId: '${p.editionId}', concept: ${JSON.stringify(p.concept)}, category: ${JSON.stringify(p.category)} },`)
lines.splice(closeIdx, 0, ...rows)
fs.writeFileSync(PAGE, lines.join('\n'))

// --- 3. config TOTAL_ENTRIES ---
fs.writeFileSync(CONFIG, configSrc.replace(/TOTAL_ENTRIES\s*=\s*\d+/, `TOTAL_ENTRIES = ${newTotal}`))

console.log(`\n✓ Wrote ${plan.length} entry JSONs, ${plan.length} manifest rows, TOTAL_ENTRIES=${newTotal}.`)
console.log('NEXT: run `npm run build` and review the diff before committing.\n')
