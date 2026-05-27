# One Percent — Project Instructions
**Version 1.34 | Updated May 27, 2026**

---

## Changelog

| Version | Date | Changes |
|---|---|---|
| v1.0–v1.22 | 2026-05-05 to 2026-05-20 | See v1.22 for full history |
| v1.25 | 2026-05-20 | Changelog workflow added. About + Changelog pages added to app. Enhancement backlog seeded. Bug status column added. Action bar redesigned (dark pill). Tab system redesigned (dark pill, no float). Badge visibility fixed. Gap between nav and stats reduced. |
| v1.26 | 2026-05-21 | Changelog description format: bullet points required. TOTAL_ENTRIES centralized in lib/config.js. |
| v1.30 | 2026-05-23 | Session start optimized: State Snapshot file added (`State/onepercentstate.md`). Read order is now: state snapshot → latest log → begin. Wrap It Up Protocol updated to regenerate state snapshot at every session close. Backlog split into content (`onepercentbacklog.md`) and product (`onepercentproductbacklog.md`). |
| v1.31 | 2026-05-26 | Tester feedback rules locked into pre-generation checklist. `ai_prompt` field added as standard content block. Entry manifest updated to 25 entries. Backlog updated to mark 5 backfill entries as used. |
| v1.32 | 2026-05-27 | Entry insertion/renumbering protocol added. Sticky nav documented. Profile tab order updated. Unlock.js default fixed. |
| v1.33 | 2026-05-27 | Repo conventions locked: log naming, directions archiving, editions structure. |
| v1.34 | 2026-05-27 | Removed deprecated Archive-Original-JSX from repo tree diagram. |

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

## Changelog Modal Protocol

When shipping a release:
1. Claude sets `show_modal = true` in Supabase for the changelog entry **only when Matthew says to**
2. Matthew says "modal this one" or similar — Claude executes the SQL, no manual Supabase access needed
3. Default is `show_modal = false` — most releases just get the dot badge
4. Next changelog version after current (v0.3): **v0.4**

---

## Wrap It Up Protocol — UPDATED

When Matthew says "Let's Wrap It Up":

1. Write a plain-English changelog entry for everything shipped this session
2. Insert it into Supabase `changelog` table with `published = false`
3. Tell Matthew what it says — he approves or edits, then you flip `published = true`
4. Commit session log to `Logs/`
5. Update backlogs — content backlog if concepts were added or consumed; product backlog if issues, upgrades, or builds changed
6. Write new instructions version if anything changed
7. **Regenerate `State/onepercentstate.md`** — update all fields to reflect end-of-session state (last entry, next entry, open issues, priorities, approved builds)
8. Push everything to GitHub

### Changelog insert format
```sql
INSERT INTO changelog (version, title, description, published)
VALUES ('[x.x]', '[Plain English title]', '[bullet points — one per change, plain English, no jargon, no commit hashes. Format: • Change one\n• Change two\n• Change three]', false);
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
| ENH-006 | User feedback & bug history | Let regular users view their own submitted feedback and bug reports. Currently insert-only — no read-back. Needs RLS read policy + UI surface (profile page likely). |
| ENH-007 | Email allowlist for beta access | Closed beta gate — only pre-approved emails can sign in. Matthew adds emails to an allowlist before sending invites. Anyone not on the list gets blocked at auth, even if they have the URL. |
| ENH-008 | Gate entry JSON behind auth | Move entries out of /public and serve via authenticated API. Currently anyone can read entry content without logging in. Post-beta, pre-launch priority. |
| ENH-009 | Rate limiting on feedback & bug submissions | No throttling on feedback/bug report endpoints. Fine for closed beta with known testers — needs addressing before public launch. |

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
├── Backlog/onepercentbacklog.md         — content candidates only
├── Backlog/onepercentproductbacklog.md  — features, bugs, upgrades, infra
├── State/onepercentstate.md             — session start snapshot (always current)
├── Editions/[NNN-CategorySlug-ConceptSlug]/
└── app-next/
    ├── app/
    │   ├── page.js                — library/home
    │   ├── entry/[id]/page.js
    │   ├── admin/page.js
    │   ├── about/page.js          — About page (added v1.25)
    │   ├── changelog/page.js      — Changelog page (added v1.25)
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
14. **Tester feedback rules (MANDATORY):**
    - Quiz questions must test conceptual understanding or application — never recall of specific numbers or statistics
    - Morning section must include a concrete scenario, example, or story — not abstract explanation only
    - Quiz questions must be role-agnostic — avoid phrasing that assumes a specific job function
15. After generating: post file · verify receipt · backlog update · log · **NO GitHub commit until verification complete**

### Transparency statement
> "Log reviewed · Last: [EditionID / concept] · Next: [category] · Concept: [chosen concept] · Edition ID: [EditionID] · Backlog reviewed · [concept] was [in backlog / not in backlog — added] · Temporal relevance: [one sentence] · Sources: verified · Quote: verified · AI nudge: [applicable / not applicable] · In the Wild: [Type A / B / C] · Midday escalation: confirmed · Q3 application: confirmed"

---

## Content Blocks — Full spec unchanged from v1.22

### ai_prompt field — REQUIRED for all new entries (added v1.31)

Every entry must include an `ai_prompt` field — a pre-written, copyable prompt that lets users take the concept into a Claude conversation. The prompt should:
- Be specific to the concept, not generic
- Instruct Claude to ask the user for their context before advising
- Avoid "look on the bright side" or generic coaching language
- End with a placeholder like `[describe your situation]`

Existing entries 001–025 need backfilling in a dedicated session (PU-007).

Example format:
```
"ai_prompt": "I want to apply [concept] to a real situation. Help me work through it by asking me about my context first, then [specific application]. Here's what I'm dealing with: [describe your situation]"
```

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

### Step 1 — Generate (do not commit)
- Write entry JSON to entries/
- Generate verify receipt
- Update backlog and log
- **Do not commit to GitHub yet**

### Step 2 — Verify (Dead Drop, one claim at a time)
- Walk Matthew through each verifiable claim one at a time
- Wait for confirmation before moving to next claim
- If a claim fails: remove or correct it immediately, note in verify receipt
- Do not move to Step 3 until all claims are confirmed or corrected

### Step 3 — Human sign-off
- Matthew explicitly confirms: "verified" or "good to publish"
- Add `"verified": true, "verified_by": "Matthew"` to the entry JSON sources block
- Update verify receipt with Human Sign-Off section (see below)

### Step 4 — Commit and push
- Commit entry JSON, verify receipt, backlog update, log
- Draft changelog entry (unpublished) for Wrap It Up

---

### Verify receipt — human indicator (required field)
Every verify receipt must include this section after verification is complete:

```
## Human Sign-Off
Verified by: Matthew
Date: [date]
Claims confirmed: [n of n]
Status: PUBLISHED
```

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

### Supabase Schema (current, as of v1.25)

**profiles:** `id`, `email`, `name`, `first_name`, `last_name`, `signup_date`, `current_streak`, `longest_streak`, `last_active_date`, `onboarding_complete`, `is_admin`, `avatar_url`, `last_seen_changelog_version`

**completions:** `user_id`, `entry_number`, `score`, `time_to_quiz`, `answers` (jsonb), `completed_at`

**feedback:** `id`, `user_id`, `feedback_type`, `entry_number`, `topic_rating`, `clarity_rating`, `quiz_rating`, `overall_rating`, `would_recommend`, `missing_topics`, `biggest_win`, `comment`, `created_at`

**bug_reports:** `id`, `user_id`, `page`, `description`, `browser_info`, `created_at`, `status` (open/resolved/wont_fix, default open — admin only)

**changelog:** `id`, `version`, `title`, `description`, `published` (bool), `show_modal` (bool), `created_at` — authenticated users read published=true rows only; admin write/update all

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
| `/leaderboard` | User-facing leaderboard — 7 metrics, tap to expand, admin-excluded |
| `/profile` | User profile — name edit, email, sign out |
| `/admin` | Admin dashboard |
| `/login` | Magic link login |
| `/onboarding` | 6-screen beta commitment flow |

### Library Page Design (as of v1.25)

- **Background:** `#dadada` (landing page CSS variable)
- **Action bar:** `#1e1e1e` dark pill — ABOUT · CHANGELOG · BUG · FEEDBACK · INFO · [ADMIN] · SIGN OUT
- **Library tabs:** `#1e1e1e` dark pill — slideable, no float, selected = `rgba(255,255,255,0.07)` chip
- **Badges (BETA/ADMIN):** `#1a1a1a` solid backing so neon colors pop on any background
- **Stats cards:** `#111` background

### Changelog Workflow (added v1.25)

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
| 009 | MM.3 | Mental Models | Survivorship Bias |
| 010 | CM.2 | Communication | Feedback That Lands |
| 011 | PH.3 | Philosophy | Amor Fati |
| 012 | CM.3 | Communication | The Ladder of Inference |
| 013 | NC.3 | Neuroscience & Cognition | Dopamine & Motivation |
| 014 | VL.2 | Vocab & Language | Euphemism Treadmill |
| 015 | SC.2.1 | Sales Craft | Anchoring in Negotiation |
| 016 | MM.2 | Mental Models | Second-Order Thinking |
| 017 | AI.2.2 | AI | Hallucination / Confabulation |
| 018 | PH.2 | Philosophy | Dichotomy of Control |
| 019 | NC.1 | Neuroscience & Cognition | Neuroplasticity |
| 020 | SC.2.2 | Sales Craft | Tactical Empathy |
| 021 | CM.1 | Communication | Active Listening |
| 022 | SC.3.1 | Sales Craft | Multi-Threading |
| 023 | AI.3.1 | AI | RAG (Retrieval-Augmented Generation) |
| 024 | VL.3 | Vocab & Language | Nominalization |
| 025 | NC.2 | Neuroscience & Cognition | Meditation and the Brain |

**Next entry:** 026 — SC (Sales Craft, SC.3.2 or SC.4.1). Candidates: Mirroring, Labeling, Calibrated Questions (Black Swan/Voss series).

### Adding New Entries — APPEND ONLY during active beta

**Always append to the end of the catalog. Never insert mid-catalog while testers have active progress.**

#### Standard append (safe — use this):
1. Generate + verify content
2. Create `app-next/public/entries/[NNN].json`
3. Increment `TOTAL_ENTRIES` in `app-next/lib/config.js`
4. Add row to entry manifest in `app-next/app/page.js`
5. Add row to `ENTRIES` array in `app-next/app/profile/page.js`
6. Commit and push

#### Mid-catalog insertion (DANGER — avoid during active beta):
If insertion is unavoidable, all of the above PLUS:
1. Identify all testers with completions at or above the insertion point
2. Run SQL UPDATE to remap their `completions.entry_number` records to new positions
3. Verify remapping against actual DB data before pushing JSON files
4. Only push after SQL remap is confirmed correct

**The four files that must always stay in sync:**
- `app-next/lib/config.js` → `TOTAL_ENTRIES`
- `app-next/app/page.js` → entry manifest array
- `app-next/app/profile/page.js` → `ENTRIES` array
- Supabase `completions` table → `entry_number` values (affected by renumbering)

**Root cause of 2026-05-27 bug:** 5 entries were inserted at positions 9–13, shifting 9–20 → 14–25. The manifest and TOTAL_ENTRIES were not updated, and completions were not remapped. Testers saw wrong entries marked complete.

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


---

## Session Start Protocol — MANDATORY READ ORDER

At the start of every session, before any work:

1. Clone or pull the repo
2. **Read `State/onepercentstate.md`** — current rotation position, top priorities, open issues, approved builds
3. **Read the latest log in `Logs/`** — what happened last session in detail
4. Wait for Matthew's wake word

Do NOT read 7 logs. Do NOT read the full backlog unless generating content. The state snapshot carries the cross-session continuity — the log fills in the details of the most recent session only.

---

## State Snapshot — REGENERATE AT EVERY WRAP

`State/onepercentstate.md` is the single file that makes session starts fast. It must be kept current.

**Fields to update at every wrap:**
- Last entry generated (number, ID, concept)
- Next entry (number, category, rotation slot, candidates)
- Top 3 priorities (honest, reordered based on what happened this session)
- Active issues (add new, remove resolved)
- Platform upgrades queued (add new, remove completed)
- Approved builds not yet built (running list)
- Last updated date and session description

If the snapshot is stale, session startup degrades back to the old pattern. Don't let it go stale.

---

## Claude Project — Cross-Chat Awareness

This project runs inside a **Claude Project**, which means Claude can search past conversations within the project. This is not default Claude behavior — it only works because we are in a Project context.

**What this means in practice:**
- When Matthew references something discussed in a prior session ("we talked about X", "we decided Y"), Claude should search past chats before responding — not assume it doesn't exist.
- Use `conversation_search` with relevant keywords to find prior discussions.
- Search is keyword-based, not perfect recall. If something was discussed vaguely, it may not surface. Matthew can say "check past chats for X" to trigger an explicit search.
- New chat sessions start fresh in terms of working memory, but past decisions, discussions, and context are recoverable via search.
- Always check past chats before telling Matthew something "wasn't discussed" or "wasn't documented."

**Do not confuse this with standard Claude behavior.** Claude instances outside this Project do not have this capability.

---

## Pre-Commit Audit — REQUIRED BEFORE EVERY PUSH

Every time code is committed — mid-session or at wrap — run this audit first. No exceptions.

### Step 1: Build check
```bash
cd /tmp/one-percent-app/app-next && npm run build 2>&1
```
Must exit clean. Any error = fix before committing.

### Step 2: Logic audit on changed files
For each modified file, verify:
- **State consistency** — every useState field used in render matches what's declared
- **DB column mapping** — fields written to Supabase match actual column names
- **Ref safety** — any useRef accessed with `.current` is initialized before use
- **Conditional renders** — no component rendered with undefined required props
- **Naming conflicts** — no duplicate function/const names across files in same route

### Step 3: Report to Matthew
After audit, report: "Build: clean. Logic: [any issues found or 'nothing flagged']." Then commit.


---

## Repo Conventions — Locked (updated v1_33)

### Log Convention
- One log file per calendar day
- Filename: `onepercentlog[YYYY-MM-DD].md` (e.g. `onepercentlog2026-05-28.md`)
- Multiple sessions same day: append to existing file with `## Session 2` header
- Never use `-v2`, `-v3` suffixes — commit history is the version trail

### Directions Convention
- Active instructions always in `Directions/` root (current version only)
- Superseded versions → `Directions/Archive/` when count exceeds 5 old versions
- Never edit previous versions — create a new numbered file as before

### Editions Convention
- Every entry has a folder: `Editions/[NNN]-[Category]-[Concept]/`
- JSX source file (if generated), post markdown, and verify markdown live here
- Entries 004–016 are JSX-only (no post/verify files were generated for those entries)
- `Archive-Original-JSX/` is deprecated and deleted — JSX files now live in `Editions/`
