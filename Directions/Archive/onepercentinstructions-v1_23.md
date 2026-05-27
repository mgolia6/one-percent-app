# One Percent — Project Instructions
**Version 1.23 | Updated May 20, 2026**

---

## Changelog

| Version | Date | Changes |
|---|---|---|
| v1.0–v1.22 | 2026-05-05 to 2026-05-20 | See v1.22 for full history |
| v1.23 | 2026-05-20 | Changelog workflow added. About + Changelog pages added to app. Enhancement backlog seeded. Bug status column added. Action bar redesigned (dark pill). Tab system redesigned (dark pill, no float). Badge visibility fixed. Gap between nav and stats reduced. |

---

## Version Control Rule

Never edit a previous version file. Each update creates a new numbered file. The highest version number is always active.

---

## Wake Words

| Phrase | Action |
|---|---|
| **One Percent** | Read log, check backlog, generate next entry |
| **Backlog** | Work on concept pipeline |
| **Verify** | Step-by-step source validation |
| **Repo Check** | Status audit |
| **Let's Wrap It Up** | Session cleanup — write changelog entry, commit session log, push |
| **Bugs** | Review bugs from Supabase |
| **Feedback** | Review user feedback from Supabase |
| **Platform Upgrades** | Work on app improvements |
| **List** | List all wake words |

---

## Wrap It Up Protocol — UPDATED

When Matthew says "Let's Wrap It Up":

1. Write a plain-English changelog entry for everything shipped this session
2. Insert it into Supabase `changelog` table with `published = false`
3. Tell Matthew what it says — he approves or edits, then you flip `published = true`
4. Commit session log to `Logs/`
5. Update backlog if any concepts were added or consumed
6. Write new instructions version if anything changed
7. Push everything to GitHub

### Changelog insert format
```sql
INSERT INTO changelog (version, title, description, published)
VALUES ('[x.x]', '[Plain English title]', '[What changed and why it matters — no jargon, no commit hashes]', false);
```

**Version numbering for changelog:** Use the app's visible state, not the instructions version. Start from 0.1 and increment by 0.1 per session that ships visible changes.

---

## Enhancement Backlog — OPEN

Enhancements logged for future sessions. Not prioritized yet.

| # | Feature | Notes |
|---|---|---|
| ENH-001 | Profile picture upload | Allow users to upload and display a profile photo. Replace 👤 emoji placeholder in avatar. Supabase Storage likely needed. |
| ENH-002 | Profile page build-out | Expand beyond name/email — streak display, completed entries count, category breakdown, joined date. Make it feel like a real profile. |
| ENH-003 | Weekly quiz | Standalone quiz mode with no access to entry content. Tests retention across the week's concepts without re-reading. |
| ENH-004 | Audio lessons | Text-to-speech or recorded audio for Morning Brief content. Users can listen instead of read. |
| ENH-005 | Admin changelog UI | Simple write form in admin panel — title, version, description, publish toggle. So Matthew can add entries without touching Supabase directly. |

---

## Known Issues — Flagged for Future Versions

### ISSUE-001: Static year references in instructions copy
**Flagged:** May 17, 2026 | **Status:** Noted — fix before public launch

### ISSUE-002: Weekly feedback trigger won't fire for backdated signups
**Flagged:** May 20, 2026 | **Status:** Open

### ISSUE-003: Multi-threading bug
**Flagged:** May 20, 2026 | **Status:** Not yet investigated

### ISSUE-004: Survey scroll not pixel-perfect
**Flagged:** May 20, 2026 | **Status:** Acceptable for now

### ISSUE-005: Onboarding text overlap on mobile (last few cards)
**Flagged:** May 20, 2026 | **Status:** Open — reported via bug system (ID: 6b5776de), iPhone/Chrome iOS

---

## Product Context & Sprint Planning

One Percent is building toward a beta launch. Target library: **365 entries** — one per day. At 9 slots per rotation cycle, 365 entries requires ~40 full cycles plus 5 additional entries.

**Beta status (as of May 20, 2026):** Active beta with testers. Feedback system live. App deployed at `https://one-percent-app.vercel.app`.

---

## Edition ID System — LOCKED

### Format: `[CategoryCode].[Cycle].[Slot]`

| Code | Category |
|---|---|
| SC | Sales Craft |
| AI | AI |
| VL | Vocab & Language |
| MM | Mental Models |
| PH | Philosophy |
| NC | Neuroscience & Cognition |
| CM | Communication |

---

## File Naming Convention — LOCKED

| # | File | Format |
|---|---|---|
| 1 | React artifact | `onepercent[YYYY-MM-DD]-[categoryslug]-[conceptslug].jsx` |
| 2 | Carousel HTML | `onepercentcarousel[YYYY-MM-DD]-[categoryslug]-[conceptslug].html` |
| 3 | LinkedIn post | `onepercentpost[YYYY-MM-DD]-[categoryslug]-[conceptslug].md` |
| 4 | Verification receipt | `onepercentverify[YYYY-MM-DD]-[categoryslug]-[conceptslug].md` |
| 5 | Generation log | `onepercentlog[YYYY-MM-DD].md` |

**Category slugs — LOCKED:** `salecraft` · `ai` · `vocablanguage` · `mentalmodels` · `philosophy` · `neuroscience` · `communication`

---

## GitHub File Storage Protocol — LOCKED

**Repo:** `mgolia6/one-percent-app`

```
one-percent-app/
├── Logs/
├── Directions/
├── Backlog/onepercentbacklog.md
├── Archive-Original-JSX/
├── Editions/[NNN-CategorySlug-ConceptSlug]/
└── app-next/
    ├── app/
    │   ├── page.js                — library/home
    │   ├── entry/[id]/page.js
    │   ├── admin/page.js
    │   ├── about/page.js          — About page (added v1.23)
    │   ├── changelog/page.js      — Changelog page (added v1.23)
    │   ├── login/page.js
    │   ├── onboarding/page.js
    │   └── profile/page.js
    ├── components/EntryViewer.jsx
    ├── lib/supabase.js
    ├── lib/unlock.js
    └── public/entries/[NNN].json
```

---

## Category Rotation — LOCKED (9-slot cycle)

`SC → AI → VL → SC → MM → AI → PH → NC → CM` → repeat

### Category accent colors — LOCKED

| Category | Code | Hex |
|---|---|---|
| Sales Craft | SC | #E8FF47 |
| AI | AI | #47FFE8 |
| Vocab & Language | VL | #FF8C47 |
| Mental Models | MM | #C847FF |
| Philosophy | PH | #FF4778 |
| Neuroscience & Cognition | NC | #47C8FF |
| Communication | CM | #FF8C00 |

---

## Temporal Relevance — MANDATORY

Every entry must be grounded in now. Two checks at concept selection and framing. Full spec in v1.22.

---

## Concept Brainstorm Process — MANDATORY

1. Real-time search signal (1–2 queries)
2. Backlog check — NON-SKIPPABLE
3. Final selection — not previously covered · passes temporal relevance · verifiable sources · clear In the Wild path

---

## Pre-Generation Checklist — MANDATORY

1. Read most recent log (last 7 entries minimum)
2. Identify next category in rotation
3. Real-time search signal
4. Check backlog
5. Select concept — not covered, temporal relevance confirmed
6. Verify 2–3 sources
7. Confirm quotes verbatim
8. AI nudge check
9. In the Wild — confirm sourcing rule met
10. Midday escalation check
11. Quiz Q3 application check
12. Measurable behavior rule if applicable
13. State transparency statement
14. After generating: post file · verify receipt · backlog update · log · GitHub commit · changelog entry drafted

### Transparency statement
> "Log reviewed · Last: [EditionID / concept] · Next: [category] · Concept: [chosen concept] · Edition ID: [EditionID] · Backlog reviewed · [concept] was [in backlog / not in backlog — added] · Temporal relevance: [one sentence] · Sources: verified · Quote: verified · AI nudge: [applicable / not applicable] · In the Wild: [Type A / B / C] · Midday escalation: confirmed · Q3 application: confirmed"

---

## Content Blocks — Full spec unchanged from v1.22

---

## Output Set (5 standard)

1. React artifact
2. LinkedIn carousel HTML
3. LinkedIn post file
4. Verification receipt
5. Generation log

PDF — on-request only.

---

## Post-Generation Validation Protocol — MANDATORY

1. Verify HTML — 6 slides · correct fonts · accent color · footer · no date
2. Generate post file
3. Generate verify receipt
4. Update backlog
5. Update generation log
6. Commit all to GitHub
7. Draft changelog entry (unpublished) for Wrap It Up

---

## App Build — State as of May 20, 2026

### Stack
- **Framework:** Next.js (App Router)
- **Auth + DB:** Supabase (project ID: `uuzdlubbynavybttlmeh`)
- **Hosting:** Vercel — `https://one-percent-app.vercel.app`
- **Repo:** `mgolia6/one-percent-app` — app in `/app-next/`

### Theme System — LOCKED (v1.20)

| Tab | Background |
|---|---|
| Morning | `#1e2128` |
| Midday | `#13151c` |
| Evening | `#0A0A0A` |

Library/home: always dark. Neon accents require dark backgrounds — do not attempt light redesign.

### Supabase MCP — ALWAYS USE FOR SCHEMA WORK

**Never ask Matthew to run SQL manually.**

Project ID: `uuzdlubbynavybttlmeh`

Load tools via `tool_search("Supabase execute SQL")` at session start if doing schema work.

### Supabase Schema (current, as of v1.23)

**profiles:** `id`, `email`, `name`, `first_name`, `last_name`, `signup_date`, `current_streak`, `longest_streak`, `last_active_date`, `onboarding_complete`, `is_admin`

**completions:** `user_id`, `entry_number`, `score`, `time_to_quiz`, `answers` (jsonb), `completed_at`

**feedback:** `id`, `user_id`, `feedback_type`, `entry_number`, `topic_rating`, `clarity_rating`, `quiz_rating`, `overall_rating`, `would_recommend`, `missing_topics`, `biggest_win`, `comment`, `created_at`

**bug_reports:** `id`, `user_id`, `page`, `description`, `browser_info`, `created_at`, `status` (open/resolved/wont_fix, default open — admin only)

**changelog:** `id`, `version`, `title`, `description`, `published` (bool), `created_at` — authenticated users read published=true rows only; admin write/update all

### RLS — Key rules (full table in v1.22)

- `for all` policies only apply `USING` to reads. Inserts need `WITH CHECK`. Always use explicit per-operation policies.
- changelog: authenticated users read published=true; admins write all

### App Pages

| Route | Description |
|---|---|
| `/` | Library / home — entry list, stats, filter tabs |
| `/entry/[id]` | Entry viewer (EntryViewer.jsx) |
| `/about` | What One Percent is — brand/identity page |
| `/changelog` | User-facing changelog — plain English, newest first |
| `/profile` | User profile — name edit, email, sign out |
| `/admin` | Admin dashboard |
| `/login` | Magic link login |
| `/onboarding` | 6-screen beta commitment flow |

### Library Page Design (as of v1.23)

- **Background:** `#dadada` (landing page CSS variable)
- **Action bar:** `#1e1e1e` dark pill — ABOUT · CHANGELOG · BUG · FEEDBACK · INFO · [ADMIN] · SIGN OUT
- **Library tabs:** `#1e1e1e` dark pill — slideable, no float, selected = `rgba(255,255,255,0.07)` chip
- **Badges (BETA/ADMIN):** `#1a1a1a` solid backing so neon colors pop on any background
- **Stats cards:** `#111` background

### Changelog Workflow (added v1.23)

- Matthew writes entries via Supabase insert (or Claude drafts at Wrap It Up)
- Default `published = false` — Matthew approves before going live
- Page at `/changelog` pulls published entries, newest first
- Future: Admin UI (ENH-005) to write/publish without touching Supabase

### Entry Manifest — CURRENT (17 entries)

| Entry | Edition ID | Category | Concept |
|---|---|---|---|
| 001 | AI.1.1 | AI | Context Window |
| 002 | VL.1 | Vocab & Language | Framing Effect |
| 003 | SC.1.1 | Sales Craft | Discovery Questions |
| 004 | MM.1 | Mental Models | Inversion |
| 005 | PH.1 | Philosophy | Premeditatio Malorum |
| 006 | AI.1.2 | AI | Prompt Sensitivity |
| 007 | SC.1.2 | Sales Craft | Talk/Listen Ratio |
| 008 | AI.2.1 | AI | Chain-of-Thought Prompting |
| 009 | VL.2 | Vocab & Language | Euphemism Treadmill |
| 010 | SC.2.1 | Sales Craft | Anchoring in Negotiation |
| 011 | MM.2 | Mental Models | Second-Order Thinking |
| 012 | AI.2.2 | AI | Hallucination / Confabulation |
| 013 | PH.2 | Philosophy | Dichotomy of Control |
| 014 | NC.1 | Neuroscience & Cognition | Neuroplasticity |
| 015 | SC.2.2 | Sales Craft | Tactical Empathy |
| 016 | CM.1 | Communication | Active Listening |
| 017 | SC.3.1 | Sales Craft | Multi-Threading |

**Next entry:** 018 — AI (AI.3.1). Candidates: RAG, AI Agents, Temperature/Sampling.

### Adding New Entries
1. Generate content
2. Create `public/entries/[NNN].json`
3. Add to `ENTRIES` array in `app/page.js`
4. Update `TOTAL_ENTRIES`
5. Commit and push

### Env Vars (Vercel — already set)
```
NEXT_PUBLIC_SUPABASE_URL=https://uuzdlubbynavybttlmeh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1emRsdWJieW5hdnlidHRsbWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMTAzMDQsImV4cCI6MjA5NDc4NjMwNH0.Wtd0HkesOp1n3CMUdxeX_AqPpv0s5oiBcvfKkTLM-p0
```

### Verify Codeword
**Dead Drop** — Matthew verifies a claim interactively.

---

## Interactive Verification Protocol — unchanged from v1.22

---

## Brand Details

- **Author:** Matthew · **Website:** mpgink.com · **Support:** buymeacoffee.com/mpgink
- **Hashtags:** #OnePercent + category-appropriate

---

## Tone Rules — unchanged from v1.22

