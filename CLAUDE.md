# CLAUDE.md — One Percent

Read this file at the start of every Claude Code session before touching anything.

---

## What This Project Is

**One Percent** — a micro-learning PWA delivering one concept per day across 7 categories.
- Live: https://one-percent-app.vercel.app
- Stack: Next.js (App Router) + Supabase + Vercel
- Supabase project: `uuzdlubbynavybttlmeh`
- Repo: `mgolia6/one-percent-app` — app lives in `/app-next/`

---

## Session Start — MANDATORY READ ORDER

1. Read `State/onepercentstate.md` — rotation position, priorities, open issues
2. Read latest file in `Logs/` — what happened last session
3. Wait for Matthew's wake word before doing anything

Do NOT start work without completing both reads.

---

## Wake Words

| Word | Action |
|---|---|
| **One Percent** | Generate next entry (full pre-gen checklist) |
| **Enhance** | Work on product backlog improvements |
| **Backlog** | Work on content pipeline |
| **Verify** | Source validation (Dead Drop protocol) |
| **Repo** | Status audit |
| **Wrap** | Full session close — see `.claude/rules/wrap-protocol.md` |
| **Bugs** | Review bugs from Supabase |
| **Feedback** | Review user feedback from Supabase |

---

## Reality Check Rule (MANDATORY before any code change)

Before modifying any file, Claude Code must:
1. Confirm the file exists at the exact path claimed
2. Confirm any function, column, or component referenced actually exists in the codebase
3. If it can't be found — stop and flag it, do not proceed on assumption

**If you can't prove it exists, you don't touch it.**

---

## Push Protocol (MANDATORY before every push)

Before pushing any change, ask Matthew **two questions** and wait for his answer:

1. **Push to `main`?** — `main` auto-deploys to production via Vercel. The alternative is holding on the feature branch / preview.
2. **Admin-gate it?** — **DEFAULT IS YES.**

The best default initial move for new work: **ship to `main` but gated behind the `is_admin` check.** This puts it live in the real environment so Matthew can verify it, without exposing it to all users. After he verifies, he decides: un-gate (roll out to everyone) or roll back.

**Exception — shared UI edits.** Gating only applies to *new* features/sections that can be wrapped in `is_admin` (e.g. `/verify`, `/admin`). A change to existing shared UI everyone already sees (e.g. a color/layout fix on the home header) cannot be gated. In that case, say "not gateable — this touches shared UI" and just confirm the push-to-`main` decision.

Never push without running this protocol first.

---

## File Map

```
one-percent-app/
├── CLAUDE.md                          ← this file
├── State/onepercentstate.md           ← always read first
├── Logs/                              ← read latest each session
├── Directions/                        ← full instructions (v1_38 = current)
├── Backlog/
│   ├── onepercentbacklog.md           ← content candidates
│   └── onepercentproductbacklog.md    ← features, bugs, upgrades
├── Editions/[NNN-Category-Concept]/   ← per-entry files
└── app-next/
    ├── app/                           ← Next.js App Router pages
    │   ├── page.js                    ← library/home (entry manifest array here)
    │   ├── entry/[id]/page.js
    │   ├── profile/page.js            ← ENTRIES array here (must stay in sync)
    │   ├── admin/page.js
    │   ├── about/page.js
    │   ├── changelog/page.js
    │   ├── privacy/page.js
    │   ├── login/page.js
    │   ├── onboarding/page.js
    │   └── api/deep-cut/route.js      ← Deep Cut streaming API
    ├── components/
    │   ├── EntryViewer.jsx
    │   └── DeepCut.jsx
    ├── lib/
    │   ├── supabase.js
    │   ├── unlock.js
    │   └── config.js                  ← TOTAL_ENTRIES lives here
    └── public/entries/[NNN].json      ← entry content files
```

---

## Critical: Four Files That Must Stay In Sync

When adding an entry, all four must be updated in one commit:
1. `app-next/lib/config.js` → `TOTAL_ENTRIES`
2. `app-next/app/page.js` → entry manifest array
3. `app-next/app/profile/page.js` → `ENTRIES` array
4. `app-next/public/entries/[NNN].json` → new entry file

**Never push a partial update.** The 2026-05-27 bug was caused by exactly this.

---

## Pre-Commit Audit — REQUIRED before every push

```bash
cd /tmp/one-percent-app/app-next && npm run build 2>&1
```

Must exit clean. Any error = fix before committing. Report: "Build: clean. Logic: [findings or 'nothing flagged']."

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js (App Router) |
| Auth + DB | Supabase (`uuzdlubbynavybttlmeh`) |
| AI | Anthropic API → `/api/deep-cut/route.js` |
| Hosting | Vercel (auto-deploy on push to main) |
| Analytics | PostHog |

---

## Design System — Non-Negotiable

- **App background:** `#0e141c`
- **Card/surface:** `#1a2a3a`
- **Typography:** DM Sans (UI) + DM Mono (labels)
- **Bottom nav:** colored underline pip per active tab
- **Deep Cut FAB:** circle, bottom right, 82px above nav, cycles 7 category colors every 2.5s
- Neon accents require dark backgrounds — do not attempt light redesign

Category accent colors locked — see `.claude/knowledge/design-system.md`

---

## RLS Rules

- Use explicit per-operation policies (not `for all` blanket policies)
- `for all` only applies `USING` to reads — inserts need `WITH CHECK`
- changelog: authenticated users read `published=true`; admins write all

---

## What NOT To Do

- Don't insert entries mid-catalog during active beta (see Directions for danger protocol)
- Don't push broken builds — build check is mandatory before every commit
- Don't make UI decisions without reading `LAYOUT.md` first
- Don't reconstruct state from memory — read `State/onepercentstate.md`
- Don't commit entry JSON without completing verification (Dead Drop protocol)
- Don't ask Matthew to run SQL manually — use Supabase MCP

---

## Deeper Docs (read on demand)

- `.claude/knowledge/supabase-schema.md` — full schema, RLS rules
- `.claude/knowledge/entry-system.md` — edition IDs, rotation, category colors, pre-gen checklist
- `.claude/knowledge/design-system.md` — full design tokens, component patterns
- `WORKING-WITH-CLAUDE-DESIGN.md` — playbook for the design tool (brief the problem not the solution; fixed vs. yours; how to judge + hand off)
- `DESIGN-SYSTEM-BRIEF.md` — full-app visual direction (identity-first: lock the language on the lesson view, then roll across every screen)
- `DESIGN-MOMENTS.md` — active design brief for the reward moments (peak + end), designed inside the locked language
- `.claude/rules/wrap-protocol.md` — full 10-step wrap checklist
- `Directions/onepercentinstructions-v1_41.md` — full project instructions (authoritative)
- `LAYOUT.md` — every layout decision ever made
