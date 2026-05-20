# One Percent — Project Instructions
**Version 1.22 | Updated May 20, 2026**

---

## Changelog

| Version | Date | Changes |
|---|---|---|
| v1.0 | 2026-05-05 | Initial instructions |
| v1.1 | 2026-05-07 | Audience framing fix; mobile carousel fix; topic tracking transparency added |
| v1.2 | 2026-05-07 | Generation log created; log-based rotation; pre-generation checklist added |
| v1.3 | 2026-05-07 | Rotation cycle locked; version control rule added |
| v1.4 | 2026-05-07 | LinkedIn post teaser format. Sources rendering fixed. Style lockdown. |
| v1.5 | 2026-05-07 | Sources verification rule added. LinkedIn post sources format defined. |
| v1.6 | 2026-05-07 | Carousel expanded to 6 slides. Slide 6 = permanent Sources slide. |
| v1.7 | 2026-05-07 | GO-TO-MARKET VERSION. AI nudge rule. Quote integrity hardened. File naming locked. Log version control. POST tab label fixed. Slide 3 watermark. Closing line weight. |
| v1.8 | 2026-05-08 | "In the Wild" sourcing rule. Three-tier format A/B/C defined. |
| v1.9 | 2026-05-10 | Midday escalation rule. Quiz Q3 application rule. Both in pre-gen checklist. |
| v1.10 | 2026-05-11 | Measurable Behavior Rule added for Sales Craft entries. |
| v1.11 | 2026-05-11 | Sources removed from LinkedIn post. Datebar: Edition ID · Concept. Carousel file naming updated with slugs. |
| v1.12 | 2026-05-11 | LinkedIn document title format locked. PDF as standard third output. |
| v1.13 | 2026-05-11 | Post-Generation Validation Protocol added. |
| v1.14 | 2026-05-12 | Quiz interaction pattern locked. Carousel page-bleed prevention rules. |
| v1.15 | 2026-05-16 | PDF generation script verified and locked. Verification Artifact added. Open-access URL rule. |
| v1.16 | 2026-05-17 | Audience reframe. POST tab removed from JSX. Standalone post file. Temporal relevance rules. Concept brainstorm process. JSX naming updated. Edition ID system introduced. Six standard outputs locked. |
| v1.17 | 2026-05-17 | Two new categories added: Neuroscience & Cognition (NC, #47C8FF) and Communication (CM, #FF8C00). Rotation expanded from 7 to 9 slots. Edition ID system updated. Backlog structure updated. 365-entry sprint context added. Verify format upgraded with clickable links and navigation directions. Voss / Black Swan Group concepts seeded into SC backlog. Known issue flagged: static year references. |
| v1.18 | 2026-05-18 | Post and verify file naming updated to include category + concept slugs. Closing line: static tomorrow teaser removed, replaced with reflection prompt. Bottom tab nav added. Scroll-to-top on tab change via useEffect. Submit scrolls to score box. Score celebration: full-screen canvas confetti overlay. Morning explanation changed to explanation_paragraphs array. Midday In the Wild changed to itw_paragraphs array. |
| v1.19 | 2026-05-19 | JSX template canonized as hybrid: Inter font, Lucide tab icons, larger type scale, 720px max-width, starburst celebration animation. PDF removed as standard output — on-request only. Output set reduced to 5. GitHub as file storage protocol. Archive gate rule added. |
| v1.20 | 2026-05-20 | App build session. Bugs fixed: entry content mismatches (014/015 swap + ENTRIES array), celebration canvas auto-dismiss, survey theme mismatch, feedback insert failures, isUnlocked hardcoded at 16. Theme system: all three tabs unified into neutral dark gray family (morning #1e2128, midday #13151c, evening #0A0A0A). Library light redesign attempted and reverted — neon accents incompatible with light backgrounds. Features added: admin reset user data button, feedback tab aggregated by entry, sticky back button, iOS textarea zoom fix, feedback success state, survey scroll fix. Supabase MCP confirmed working — use for all schema ops. feedback_type check constraint updated to include post_entry. App state updated to 17 entries. |
| v1.21 | 2026-05-20 | UX/admin polish session. INFO modal added (step-through, onboarding aesthetic, 7 steps, accessible from library header). Library header redesigned: two-row layout (wordmark row + scrollable action bar with visual grouping). Onboarding: INFO callout added inline below CTA from step 2 onward. Welcome overlay fixed to fire correctly post-onboarding. Prayer hands removed from all feedback modals. Bug modal page dropdown updated: Onboarding and Info added. Supabase RLS overhauled: feedback insert was silently failing due to missing WITH CHECK on for-all policy — replaced with 3 clean policies. Admin delete/update policies added for feedback, completions, profiles, bug_reports (resets were silently failing). Admin: INSTANT stat tile added, ENTRY FEEDBACK tab renamed to POST-LESSON, REFRESH button added. Supabase MCP protocol documented explicitly — always use for schema ops, never ask Matthew to run SQL. |
| v1.22 | 2026-05-20 | Entry 017 audit + UX fixes. Interactive verification protocol established: Matthew performs live searches, Claude validates findings — quote attribution error caught and fixed. UX fixes: tab navigation scroll-to-top (removed isFirst check + added explicit scroll calls), feedback modal scroll timing fixed (50ms delay), text contrast improved across all themes (textMid 70%, textDim 50%, textFaint 30-55%). Features added: BETA badge (yellow, shows for all users next to ADMIN in header Row 1), profile page at /profile (first/last name editable, email read-only, sign out button), profile avatar icon (top right of header, currently 👤 emoji placeholder). Entry 017 Gartner URL updated to accessible page. |

---

## Known Issues — Flagged for Future Versions

### ISSUE-001: Static year references in instructions copy
**Flagged:** May 17, 2026 | **Status:** Noted — fix before public launch
Replace all hardcoded year references with relative language before any public-facing launch.

### ISSUE-002: Weekly feedback trigger won't fire for backdated signups
**Flagged:** May 20, 2026 | **Status:** Open
Weekly modal fires on exact day-7 multiples from `signup_date`. Matthew's signup is backdated to 2026-01-01 (139+ days in) so it will never hit a clean multiple. Needs a manual override or test trigger for admin users.

### ISSUE-003: Multi-threading bug
**Flagged:** May 20, 2026 | **Status:** Not yet investigated
Parallel/multi-thread entry loading or unlock logic failing. Unknown root cause.

### ISSUE-004: Survey scroll not pixel-perfect
**Flagged:** May 20, 2026 | **Status:** Acceptable for now
Survey scrolls to near-top of form but not exactly. Good enough for beta.

---

## Version Control Rule

Never edit a previous version file. Each update creates a new numbered file. The highest version number is always active.

---

## Product Context & Sprint Planning

One Percent is building toward a beta launch. Target library: **365 entries** — one per day. At 9 slots per rotation cycle, 365 entries requires ~40 full cycles plus 5 additional entries.

**Sprint context:** Dedicated generation sprints needed to bank content ahead of beta. Goal: stay 30–60 entries ahead of daily publishing pace before launch.

**Beta status (as of May 20, 2026):** Active beta with testers. Feedback system live. App deployed at `https://one-percent-app.vercel.app`.

---

## Edition ID System — LOCKED

Every entry has a unique Edition ID. Used in the datebar and header. No date appears in any user-facing display.

### Format: `[CategoryCode].[Cycle].[Slot]`

- **CategoryCode:** `SC` · `AI` · `VL` · `MM` · `PH` · `NC` · `CM`
- **Cycle:** Which pass through the full 9-slot rotation (starts at 1)
- **Slot:** Position within that cycle for this category. SC and AI have two slots per cycle (.1 and .2). All other categories have one slot — no sub-number.

### Category codes

| Code | Category |
|---|---|
| SC | Sales Craft |
| AI | AI |
| VL | Vocab & Language |
| MM | Mental Models |
| PH | Philosophy |
| NC | Neuroscience & Cognition |
| CM | Communication |

### Examples

| Entry | Edition ID | Meaning |
|---|---|---|
| Entry 001 | AI.1.1 | AI, cycle 1, first AI slot |
| Entry 007 | SC.1.2 | Sales Craft, cycle 1, second SC slot |
| Entry 013 | PH.2 | Philosophy, cycle 2 |
| Entry 015 | NC.1 | Neuroscience & Cognition, cycle 1 |

### Where it appears
- **Datebar in React artifact:** `[EditionID] · [Concept]`
- **Header:** Sequential entry badge `#NNN` for internal tracking
- **Generation log:** Both entry number and Edition ID recorded

---

## File Naming Convention — LOCKED

| # | File | Format | Example |
|---|---|---|---|
| 1 | React artifact | `onepercent[YYYY-MM-DD]-[categoryslug]-[conceptslug].jsx` | `onepercent2026-05-17-neuroscience-neuroplasticity.jsx` |
| 2 | Carousel HTML | `onepercentcarousel[YYYY-MM-DD]-[categoryslug]-[conceptslug].html` | `onepercentcarousel2026-05-17-neuroscience-neuroplasticity.html` |
| 3 | LinkedIn post | `onepercentpost[YYYY-MM-DD]-[categoryslug]-[conceptslug].md` | `onepercentpost2026-05-17-neuroscience-neuroplasticity.md` |
| 4 | Verification receipt | `onepercentverify[YYYY-MM-DD]-[categoryslug]-[conceptslug].md` | `onepercentverify2026-05-17-neuroscience-neuroplasticity.md` |
| 5 | Generation log | `onepercentlog[YYYY-MM-DD].md` | `onepercentlog2026-05-17.md` |
| — | Instructions | `onepercentinstructions-v1_20.md` | (this file) |
| — | Backlog | `onepercentbacklog.md` | (single living file) |

**PDF** — on-request only. Not generated by default.

**Category slugs — LOCKED:**
`salecraft` · `ai` · `vocablanguage` · `mentalmodels` · `philosophy` · `neuroscience` · `communication`

**Concept slug rules:** lowercase, no spaces, no special characters.

---

## Generation Log Version Control

- Each generation produces `onepercentlog[YYYY-MM-DD].md`
- Multiple same day: `-v2.md`, `-v3.md`
- Highest version for that date is always active
- Log is the source of truth — always read the most recent before generating

---

## GitHub File Storage Protocol — LOCKED

All generated files live in the One Percent GitHub repository (`mgolia6/one-percent-app`). Source of truth for all content.

### Repository Structure

```
one-percent-app/
├── Logs/                          — session logs
├── Directions/                    — instructions (always use highest version)
├── Backlog/
│   └── onepercentbacklog.md
├── Archive-Original-JSX/          — original pre-v1.19 JSX files
├── Editions/
│   └── [NNN-CategorySlug-ConceptSlug]/
│       ├── onepercent[date]-[cat]-[concept].jsx
│       ├── onepercentcarousel[date]-[cat]-[concept].html
│       ├── onepercentpost[date]-[cat]-[concept].md
│       └── onepercentverify[date]-[cat]-[concept].md
└── app-next/                      — live Next.js app
    ├── app/
    │   ├── page.js                — library/home view
    │   ├── entry/[id]/page.js     — entry page
    │   ├── admin/page.js          — admin dashboard
    │   ├── login/page.js          — magic link login
    │   └── onboarding/page.js     — beta onboarding flow
    ├── components/
    │   └── EntryViewer.jsx        — single shared UI component
    ├── lib/
    │   ├── supabase.js            — lazy Supabase client
    │   └── unlock.js              — day-based unlock logic
    └── public/entries/
        └── [NNN].json             — canonical content source of truth
```

### Write Protocol

1. Confirm repo access before writing anything
2. Locate correct subfolder — create Edition subfolder if needed
3. Write all output files to correct locations
4. Write log to `Logs/`
5. Update backlog in `Backlog/`
6. When adding new entries to app: create JSON in `public/entries/`, update ENTRIES array in `app/page.js`, update `TOTAL_ENTRIES` constant

### Hard Rules

- Never write files to the repo root
- PDFs are not committed to the repo — generated on demand, delivered in chat

---

## Archive Gate Rule — MANDATORY

Do not regenerate any existing entry from scratch if the original source file is not available. Original files must be in `Archive-Original-JSX/` before regeneration begins.

---

## What This Is

One Percent is a daily micro-learning system covering seven categories: Sales Craft, AI, Vocab & Language, Mental Models, Philosophy, Neuroscience & Cognition, and Communication. Each entry is immediately actionable — a concept explained clearly, grounded in real examples, tested with a quiz, delivered across a learning app and LinkedIn.

**Matthew is the author and curator.** He sets direction, holds editorial standards, and is building toward a beta product. He is not the target audience.

**The audience** is curious working professionals who want to get sharper — at selling, at thinking, at using language precisely, at understanding AI tools reshaping their work, at building better mental habits. They don't need to be talked down to. They value substance. They have limited time and zero patience for filler.

**Matthew's role:**
- 20+ years enterprise sales experience — voice is informed by that, not constrained by it
- Creative entrepreneur: writer, rapper, visual artist — mpgink.com
- Direct, anti-bullshit, lo-fi ethos

---

## Audience Framing by Category

**Sales Craft** — Salespeople in the field. The lens is the rep: discovery, pipeline, deals, buyers, negotiation, closing, prospecting, quota. NOT ops, NOT process infrastructure.

**AI** — Universally framed. Anyone building with, using, or understanding AI tools. Must reflect current state of the field.

**Vocab & Language** — Universally framed. Semantics, rhetoric, framing, how language shapes thought and behavior.

**Mental Models** — Universally framed. Frameworks for thinking, deciding, avoiding predictable errors.

**Philosophy** — Universally framed. Ideas, ethics, meaning. Test is relevance now, not when it was written.

**Neuroscience & Cognition** — Universally framed. How the brain actually works: learning, memory, attention, habit, decision-making at the neural level. Not pop psychology — grounded in research.

**Communication** — Universally framed. How to get ideas across clearly under pressure. Listening, feedback, difficult conversations, writing clearly, presenting, nonviolent communication. Distinct from Vocab & Language (which is about how language works) — this is about how people communicate effectively or fail to.

---

## Category Rotation — LOCKED (9-slot cycle)

`SC → AI → VL → SC → MM → AI → PH → NC → CM` → repeat

| Slot | Category | Code |
|---|---|---|
| 1 | Sales Craft | SC |
| 2 | AI | AI |
| 3 | Vocab & Language | VL |
| 4 | Sales Craft | SC |
| 5 | Mental Models | MM |
| 6 | AI | AI |
| 7 | Philosophy | PH |
| 8 | Neuroscience & Cognition | NC |
| 9 | Communication | CM |

### Category accent colors — LOCKED

| Category | Code | Hex |
|---|---|---|
| Sales Craft | SC | #E8FF47 |
| AI | AI | #47FFE8 |
| Vocab & Language | VL | #FF8C47 |
| Mental Models | MM | #C847FF |
| Philosophy | PH | #FF4778 |
| Neuroscience & Cognition | NC | #47C8FF 
| Communication | CM | #FF8C00 |

---

## Temporal Relevance — MANDATORY

Every entry must be grounded in now. Two checks:

**Part 1 — Concept selection:** Is this concept alive in current conversation? If older, does it still hold? If the reference is outdated — pick a different concept.

**Part 2 — Framing check (every entry):** Every entry must contain at least one signal grounding it in the present. Test: could someone read this and think it was written three years ago? If yes, add the signal.

---

## Concept Brainstorm Process — MANDATORY

### Step 1 — Real-time search signal
Run 1–2 targeted searches before concept selection. Substitute the actual current year in queries — do not hardcode years.

### Step 2 — Backlog check — MANDATORY, NON-SKIPPABLE
Read `onepercentbacklog.md` before finalizing any concept. Confirm the backlog check in the transparency statement.

### Step 3 — Final selection
Concept must satisfy: not previously covered · passes temporal relevance check · verifiable current sources · clear In the Wild path · natural Q3 application scenario.

### After every generation — update the backlog
Mark used concepts. Add new candidates. Add signal concepts considered but passed over.

---

## Pre-Generation Checklist — MANDATORY

1. Read most recent log file (last 7 entries minimum)
2. Identify next category in 9-slot rotation
3. Run real-time search signal (1–2 queries)
4. Check backlog — cross-reference with search signal
5. Select concept — confirm not previously covered, passes temporal relevance
6. Verify 2–3 sources via web search before writing anything
7. Confirm any quotes verbatim before use
8. Determine if AI nudge applies
9. Identify In the Wild example — confirm sourcing rule met
10. **Midday escalation check:** In the Wild must advance the concept, not restate morning
11. **Quiz Q3 check:** Q3 must require application, not identification
12. **If measurable behavior concept:** apply Measurable Behavior Rule
13. State transparency statement before writing anything
14. After generating: produce post file · produce verify receipt · update backlog · produce log · commit to GitHub

### Transparency statement — required before every generation

> "Log reviewed · Last: [EditionID / concept] · Next: [category] · Concept: [chosen concept] · Edition ID: [EditionID] · Backlog reviewed · [concept] was [in backlog as candidate / not in backlog — added] · Temporal relevance: [one sentence] · Sources: verified · Quote: verified · AI nudge: [applicable / not applicable] · In the Wild: [Type A / B / C] · Midday escalation: confirmed · Q3 application: confirmed"

---

## Quote Integrity Rule — MANDATORY

All quotes verbatim. No paraphrases as quotes. Every quote confirmed from a specific, identifiable source.

---

## Sources Verification Rule — MANDATORY

Web-search confirm before writing: real title, real author(s), real year and publication, working open-access URL.

---

## "In the Wild" Sourcing Rule — MANDATORY

**Type A** — Documented, citable. Strongest.
**Type B** — Widely known, publicly documented, broadly verifiable.
**Type C** — Clearly labeled hypothetical. No invented statistics. No fictional characters presented as real.

### Midday Escalation Rule
In the Wild must advance the concept beyond morning — consequence, reversal, unexpected domain, counterintuitive finding.

---

## Measurable Behavior Rule

When a concept involves trackable behavior, direct the reader to their actual number — not an estimate.

---

## AI Nudge Rule

If the concept naturally involves AI as a tool, add a brief specific nudge in the Midday closing. Don't force it.

---

## Content Blocks

### Morning
- `explanation_paragraphs: []` — 3–4 paragraphs, one idea per paragraph. Never a single block.
- WHY NOW box — current-relevance hook
- Morning challenge — concrete, specific, actionable today

### Midday
- Reframe — shift in perspective, accent left border
- In the Wild — `itw_paragraphs: []` — 2–3 paragraphs. Never a single block.
- Quote — verbatim only, properly attributed
- Closing nudge — one question that makes the reader apply the concept

### Closing line rule — LOCKED
No static "tomorrow teaser." Always a reflection prompt tied to the current concept.

### Evening — Quiz Interaction Pattern — LOCKED
All three questions visible at once. One answer per question. Single SUBMIT — disabled until all three answered. On submit: all states reveal simultaneously, score celebration triggers, score box auto-scrolls into view.

---

## Output 1: React Artifact — LOCKED (v1.19 Template)

### Imports — LOCKED
```jsx
import { useState, useEffect, useRef } from "react";
import { BookOpen, Lightbulb, Award } from 'lucide-react';
```

### Tabs — LOCKED
- Morning: `BookOpen` icon + "MORNING"
- Midday: `Lightbulb` icon + "MIDDAY"
- Evening: `Award` icon + "EVENING"

No emoji in tab labels. POST tab permanently removed.

### Datebar — LOCKED
`[EditionID] · [Concept]` — no date.

### Bottom Tab Navigation — LOCKED
- Morning bottom → advances to Midday
- Midday bottom → advances to Evening
- Evening — no button

Scroll to top via useEffect watching tab state, NOT onClick.

### Style — LOCKED (v1.19)

Background: `#0A0A0A` · Font: Inter · Max width: 720px

(Full style spec unchanged from v1.19 — refer to that file for complete CSS and style object.)

### Score Celebration — LOCKED (v1.19)

- **3/3:** Starburst + particles, "LOCKED IN" text, pulseBorder, ~140 frames. Canvas auto-dismisses via `onDone` callback.
- **2/3:** Arc animation, "2/3" center text, ~80 frames. Canvas auto-dismisses via `onDone` callback.
- **0–1/3:** No animation.

Canvas: `position:fixed, pointerEvents:none, zIndex:9999`. Removed from DOM after animation via `onDone → setShowCelebration(false)`.

---

## Output 2: LinkedIn Carousel HTML

6 square slides, 1080×1080px. No date displayed anywhere. Full spec unchanged from v1.19.

---

## Output 3: LinkedIn Post File

`onepercentpost[YYYY-MM-DD]-[categoryslug]-[conceptslug].md`

Teaser format. 150–250 words. No sources. Conversational, not corporate.

**LinkedIn Document Title — LOCKED:** `One Percent #[entry] — [Concept Name]`

---

## Output 4: Verification Receipt

`onepercentverify[YYYY-MM-DD]-[categoryslug]-[conceptslug].md`

Full format spec unchanged from v1.19. Open-access URLs only.

---

## Output 5: Generation Log

`onepercentlog[YYYY-MM-DD].md`

Records: entry number · Edition ID · date · category · concept · files generated · sources verified · quote confirmed · In the Wild type · notable issues or decisions.

---

## Post-Generation Validation Protocol — MANDATORY

1. Verify HTML — 6 slide wrappers · correct fonts · correct accent color · footer on every slide · no date
2. Generate post file
3. Generate verification receipt
4. Update backlog
5. Update generation log
6. Commit all files to GitHub
7. Declare completion

```
OUTPUTS COMPLETE — Entry [###] | [EditionID]

1. React artifact:   onepercent[YYYY-MM-DD]-[cat]-[concept].jsx
2. Carousel HTML:    onepercentcarousel[YYYY-MM-DD]-[cat]-[concept].html
3. LinkedIn post:    onepercentpost[YYYY-MM-DD]-[cat]-[concept].md
4. Verify receipt:   onepercentverify[YYYY-MM-DD]-[cat]-[concept].md
5. Generation log:   onepercentlog[YYYY-MM-DD].md

PDF: [not generated / generated on request]
GitHub: committed

LinkedIn Document Title: One Percent #[entry] — [Concept Name]
```

---

## Interactive Verification Protocol — AUDITING ENTRIES

When Matthew requests an audit of a verify file, use this interactive protocol. Do NOT self-attest — Matthew performs live searches.

### Process

1. **Present one source at a time**
   - State the claim from the entry
   - Provide the search query to use
   - Give the confirming URL from verify file
   - Tell Matthew what to look for

2. **Wait for Matthew's report**
   - Matthew searches and reports findings
   - If match → mark verified, move to next source
   - If mismatch → flag error immediately

3. **Fix errors immediately**
   - Update entry JSON if claim is wrong
   - Update verify file with correct info
   - Commit fixes before moving forward

4. **Quote attribution requires extra care**
   - Customer testimonials can be misattributed to article authors
   - Always check who is being quoted in context
   - Verify exact wording (common error: paraphrasing changes meaning)

5. **Secondary sources are acceptable**
   - When primary sources are gated (e.g., Gartner paywalls), widely-cited secondary sources from credible publications confirm the stat exists
   - Flag as "widely cited from [source]" rather than claiming direct verification

### Example Flow

```
Claude: "Let's verify Source 1 — Gartner 50% stat.

Search: Gartner multithreaded engagements 50% revenue 2026

URL: https://www.gartner.com/...

What to look for: Article should mention B2B organizations using multithreaded strategies will outperform by 50%"

Matthew: "Found it on this page [URL]. It says 'by 2026, organizations that unify...will realize revenue growth that outperforms their competition by 50%'"

Claude: "✅ VERIFIED. Moving to Source 2..."
```

### Key Learnings

- Interactive verification > Claude self-attesting
- Quote attribution errors are the most common miss
- Always verify exact wording of quotes, not just attribution
- Gated primary sources → use credible secondary sources + flag as "widely cited"

---

## Backlog File

`onepercentbacklog.md` — single living file, updated after every generation. Never versioned.

---

## Weekly Content Strategy

| Day | Post |
|---|---|
| Monday | One Percent carousel (LinkedIn Document Post) |
| Tuesday | ICYMI invite post |
| Wednesday | Aloha Friday Motivation newsletter teaser |
| Friday | Full Aloha Friday newsletter drop |

---

## Brand Details

- **Author:** Matthew · **Website:** mpgink.com · **Support:** buymeacoffee.com/mpgink
- **Series:** One Percent
- **Hashtags:** #OnePercent + category-appropriate

---

## Tone Rules

- No flattery, no filler, no hedging
- Direct, conversational, anti-corporate
- Sources real, verified, web-searched — no hallucinated citations
- Quotes verbatim and attributed
- In the Wild meets sourcing and escalation rules
- Q3 requires application, not identification
- Measurable behavior: direct to real data, not estimates
- Sales Craft: reps doing deals, not managers running systems
- Every entry grounded in now
- Neuroscience: research-grounded, not pop psychology
- Communication: practical and immediately applicable, not theoretical

---

## App Build — State as of May 20, 2026

### Stack
- **Framework:** Next.js (App Router)
- **Auth + DB:** Supabase (project `one-percent-better`, ID: `uuzdlubbynavybttlmeh`)
- **Hosting:** Vercel — `https://one-percent-app.vercel.app`
- **Repo:** `mgolia6/one-percent-app` — app lives in `/app-next/` subdirectory
- **Supabase MCP:** Connected — use for all schema operations. No SQL editor required.

### Key Files
- `app/page.js` — library/home view (dark, permanent)
- `app/entry/[id]/page.js` — entry page
- `app/admin/page.js` — admin dashboard
- `app/login/page.js` — magic link login
- `app/onboarding/page.js` — 6-screen beta commitment flow
- `components/EntryViewer.jsx` — all tabs, quiz, celebration, feedback, completion
- `lib/supabase.js` — lazy Supabase client (top-level import — always use this, never dynamic import)
- `lib/unlock.js` — day-based unlock logic
- `public/entries/[NNN].json` — canonical content source of truth

### Theme System — LOCKED (v1.20)

Three dark variants in `EntryViewer.jsx` `THEMES` object, unified neutral gray family:

| Tab | Background | Feel |
|---|---|---|
| Morning | `#1e2128` | Lightest — dark blue-gray |
| Midday | `#13151c` | Mid-dark |
| Evening | `#0A0A0A` | Pure dark |

Library/home page: always dark (`#0A0A0A`). Neon category accents require dark backgrounds — do not attempt light library redesign without resolving accent color conflict.

Day/night OS-following theme: deferred to post-beta. Collect tester feedback first.

### Supabase MCP — ALWAYS USE THIS FOR SCHEMA WORK

Claude has direct Supabase access via MCP. **Never ask Matthew to run SQL manually.**

**Project ID:** `uuzdlubbynavybttlmeh`

**How to load tools** — call `tool_search` with query `"Supabase execute SQL"` and `"Supabase list projects"` at session start if doing any schema work. Tools are deferred and must be loaded before use.

**Key tools:**
- `Supabase:list_projects` — confirms project ID
- `Supabase:list_tables` (verbose=true) — full schema with columns, constraints, FK
- `Supabase:execute_sql` — SELECT, INSERT, DELETE, DML queries
- `Supabase:apply_migration` — CREATE TABLE, ALTER, CREATE/DROP POLICY, DDL

**Useful debug queries:**
```sql
-- Check RLS policies on a table
select polname, polcmd, pg_get_expr(polqual, polrelid) as using_expr, pg_get_expr(polwithcheck, polrelid) as with_check
from pg_policy where polrelid = 'public.feedback'::regclass;

-- Check constraints
select conname, pg_get_constraintdef(oid) from pg_constraint where conrelid = 'public.feedback'::regclass;

-- Inspect live data
select * from feedback order by created_at desc limit 20;
```

**RLS rules in effect (as of v1.21):**

| Table | Policy | Type | Rule |
|---|---|---|---|
| feedback | feedback_insert | INSERT | auth.uid() = user_id (WITH CHECK) |
| feedback | feedback_select_own | SELECT | auth.uid() = user_id |
| feedback | feedback_select_admin | SELECT | is_admin = true |
| feedback | feedback_delete_admin | DELETE | is_admin = true |
| completions | completions_self | ALL | auth.uid() = user_id |
| completions | completions_delete_admin | DELETE | is_admin = true |
| profiles | profiles_self | ALL | auth.uid() = id |
| profiles | profiles_update_admin | UPDATE | is_admin = true |
| bug_reports | bug_reports_self_insert | INSERT | auth.uid() = user_id |
| bug_reports | bug_reports_admin_read | SELECT | is_admin = true |
| bug_reports | bug_reports_delete_admin | DELETE | is_admin = true |

**Critical RLS lesson learned:** `for all` policies only apply `USING` to reads. Inserts require `WITH CHECK`. A `for all` policy without `WITH CHECK` will silently block all inserts. Always use explicit `for insert with check` + `for select using` instead of `for all`.

### Supabase Schema (current)

**profiles:** `id`, `email`, `name`, `signup_date`, `current_streak`, `longest_streak`, `last_active_date`, `onboarding_complete`, `is_admin`

**completions:** `user_id`, `entry_number`, `score`, `time_to_quiz`, `answers` (jsonb), `completed_at`

**feedback:** `id`, `user_id`, `feedback_type`, `entry_number`, `topic_rating`, `clarity_rating`, `quiz_rating`, `overall_rating`, `would_recommend` (text), `missing_topics`, `biggest_win`, `comment`, `created_at`

Constraint: `feedback_type` must be one of: `post_entry` · `weekly` · `landing` · `midpoint` · `final`

**bug_reports:** `id`, `user_id`, `page`, `description`, `browser_info`, `created_at`

RLS enabled on all tables. Users read/write own rows only. Admins read all.

### Feedback System

**1. Post-Entry (`post_entry`)** — fires after every quiz submission
- Component: `PostEntryFeedback` in `EntryViewer.jsx`
- Fields: `topic_rating`, `clarity_rating`, `quiz_rating`, `comment`, `entry_number`
- Labels shown: Topic · Content · Quiz + optional freeflow
- Success: shows "FEEDBACK LOGGED / That helps. For real." for 4s then dismisses

**2. Weekly (`weekly`)** — fires on day 7, 14, 21, 28 from signup when entry is opened
- Component: `WeeklyFeedbackModal` in `entry/[id]/page.js`
- Fields: `topic_rating`, `clarity_rating`, `quiz_rating`, `would_recommend`, `biggest_win`, `missing_topics`
- Note: won't fire for backdated signups (see ISSUE-002)

**3. Anytime (`landing`)** — FEEDBACK button on library page
- Component: `FeedbackModal` in `page.js`
- Fields: `overall_rating`, `comment`

### Admin Dashboard (`/admin`)

**Stats bar (6 tiles):** USERS · ENTRY FB · WEEKLY · END OF BETA · INSTANT · BUGS

**Tabs:**
- **POST-LESSON** — post_entry feedback aggregated by entry number, avg Topic/Content/Quiz ratings as visual bar + comments
- **WEEKLY** — weekly check-in submissions
- **END OF BETA** — end_of_beta and final feedback types
- **INSTANT** — landing/anytime feedback (from FEEDBACK button in library)
- **BUGS** — all bug reports
- **USERS** — all users with reset controls

**Reset buttons (user-scoped, two-step confirm):**
- **RESET DATA** — clears completions + feedback, resets streak. Keeps account + onboarding.
- **HARD RESET** — everything above + sets onboarding_complete=false + name=null. User re-onboards on next login.

**REFRESH button** — re-fetches all data without page reload. Use after submitting feedback to verify it landed.

### Profile Page (`/profile`)

User-facing profile management accessible via avatar icon (top right of library header).

**Features:**
- First Name field (editable, updates `profiles.first_name`)
- Last Name field (editable, updates `profiles.last_name`)
- Email field (read-only, cannot be changed)
- Save button (updates Supabase via profile update)
- Sign Out button at bottom (full page reload to `/login`)
- Back button returns to library

**Profile Avatar:**
- Circular icon in header Row 1, far right
- Currently using 👤 emoji as placeholder
- Future: support profile pic upload and display
- Clicking opens `/profile` page

**BETA Badge:**
- Yellow badge (`#E8FF47`) in header Row 1
- Shows for all users (not conditional)
- Positioned next to ADMIN badge (if present)

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

**Next entry:** 018 — AI category (AI.3.1). Candidates: RAG, AI Agents, Temperature/Sampling.

**Next session priority:** Generate Entry 018.

### Adding New Entries
1. Generate content per these instructions
2. Create `public/entries/[NNN].json`
3. Add to `ENTRIES` array in `app/page.js`
4. Update `TOTAL_ENTRIES` constant in `app/page.js`
5. Update `isUnlocked` total in `app/entry/[id]/page.js` if needed
6. Commit and push — Vercel auto-deploys
7. Add `Editions/[NNN-Category-Concept]/` folder with JSX/carousel/post/verify files

### Env Vars (Vercel — already set)
```
NEXT_PUBLIC_SUPABASE_URL=https://uuzdlubbynavybttlmeh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1emRsdWJieW5hdnlidHRsbWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMTAzMDQsImV4cCI6MjA5NDc4NjMwNH0.Wtd0HkesOp1n3CMUdxeX_AqPpv0s5oiBcvfKkTLM-p0
```

### Verify Codeword
**Dead Drop** — Matthew verifies a claim interactively. I surface it, he hunts it down.

