# One Percent — Session Log 2026-06-30

Big session. Split across the verification pipeline, a catalog renumber, a home-screen bug + polish,
and a full pivot into design-tool-driven UI work. Everything below is committed and pushed to `main`
(developed on `claude/ai-chat-agent-feedback-jx5un9`, fast-forwarded to `main` per change).

## Shipped to main (live)

### /verify — built into a real verification workstation
- **Per-claim flagging** + a quick "why" note (`verification_checks.flagged` / `flag_note`).
- **Submit for Review** — freezes a batch (signed-off editions + flagged claims + notes) to a new
  `verification_submissions` table for next-session action.
- **⌗ RUNS archive** — read-only history of all submitted runs across categories.
- **Lifecycle states** — per-category tab chips: **SUBMITTED → RE-REVIEW (n) → ✓ PROCESSED →
  ✓ PROMOTED**. New `verification_category_state` table; `verification_entries.needs_recheck` +
  `recheck_note`. Promoted categories leave the active row into a "✓ Promoted — live in library" group.
- **Claim legibility** — every claim now shows `CLAIM N`, `MAIN CLAIM`/`KEY FIGURES`, a
  `⚠ CHECK THIS FIRST` marker on the weakest claim, plain labels (`SOURCE: PRIMARY/REPUTABLE/WEAK`,
  `SOURCE SAYS`, `WHERE TO LOOK`, `PARAPHRASED — NOT WORD-FOR-WORD`), a **📍 locate** pointer, and a
  **⧉ COPY SEARCH TEXT** button (copies the quote to paste into Find).
- **Tighter pipeline (5 upgrades):** ⚠ WATCH caveat per entry (the adversarial residual concern),
  weakest-claim mandate, paraphrase flags, source **tiers** (T1/T2/T3 by domain), and the
  **promote script** (`scripts/promote.mjs`).
- **UI fixes:** horizontal-overflow/wobble fixed; verdict pill wraps.

### Content verification
- **30 rotation entries** (AI×4, Communication×4, Mental Models×5, Neuroscience×4, Philosophy×5,
  Sales Craft×4, Vocab×4) run through the upgraded **two-pass** (confirm + adversarial); all schema
  (snippet/url/locate/tier/paraphrase + caveat/weakest). 27 PASS, 3 FLAG. Loaded as 7 new /verify tabs.
- **Finance + Health source upgrade** — human flagged weak blogs/unconfirmed peer reviews. Tier-3
  sources: Finance 11→1, Health 6→0. Swapped to Investor.gov/SEC, Fed SHED, BLS, S&P SPIVA, Nobel,
  NIH/StatPearls, JAMA, Lancet PURE, ISSN, ACSM/NSCA; confirmed DOIs/PMIDs real. Caught real errors
  (HP.10 dosing cited a single-patient case report; PF.7 vesting stat misattributed to IRS; PF.10
  DALBAR unconfirmable → Morningstar).
- **3 FLAGs + typo fixed** in rotation drafts (CM.10 Eisenberg quote → paraphrase; NC.10 colonoscopy
  trial re-attributed to 2003 Redelmeier/Katz/Kahneman; PH.8 → Brickman, Coates & Janoff-Bulman 1978
  + 1971 coinage; PH.09 "hypberbolic" typo).

### App
- **editionId renumber** — flattened the `.1.1` double-numbering to clean per-category sequences
  (AI.1–12, SC.1–13, VL.1–9, MM.1–5, PH.1–5, NC.1–8, CM.1–8). Display labels only; entry numbers
  (the progress key) unchanged.
- **Today/On-Deck bug fixed** — both now default to the **oldest uncompleted unlocked** entry (was
  the last catalog entry for fully-unlocked/admin users, and collided).
- **Top action strip integrated** — dropped the pill chrome for quiet inline links; removed SIGN OUT
  (it's in Profile); ADMIN badge now links to /admin.
- **Nav IA (admin-gated):** Library houses Lessons + Prompts sub-tabs; Review moved to bottom nav.
- **"Why I'm here" copy** — natural language ("I'm here to work on X. [When], I'll know it's working
  when [proof].") instead of the stilted template.

### Process / docs
- **Push Protocol** added to CLAUDE.md (ask: push to main? admin-gate? default yes).
- **Design docs** (for the GitHub-connected design tool): `DESIGN-SYSTEM-BRIEF.md` (full-app visual
  direction, identity-first), `DESIGN-MOMENTS.md` (peak + end), `WORKING-WITH-CLAUDE-DESIGN.md`
  (playbook: brief the problem not the solution; fixed-vs-yours; quality bar by reference not motifs).
  CLAUDE.md points to all three.

## DB changes this session
- `verification_checks` += `flagged bool`, `flag_note text`.
- New `verification_submissions` (category, counts, verified_editions jsonb, flagged_claims jsonb, status).
- New `verification_category_state` (category pk, state, promoted_at).
- `verification_entries` += `needs_recheck bool`, `recheck_note text`.

## Open / held
- **Content promotion is HELD by design.** Decision: when a batch is signed off, promote categories
  **together, interleaved by category** at 061+ (never mid-catalog) so advanced users (DonRobbo, most
  complete) get a rotating next-up, not one category in a row. `promote.mjs --dirs ... ` interleave
  mode is built + tested (dry-run shows the rotation). Nothing promoted yet.
- **Design pass in flight.** Phase 1 = the conversational **"Lock It In"** experience (he's calling it
  **"Aurora"** in the design tool). As of wrap it is NOT pushed to the GitHub repo (no aurora
  branch/PR/code) — still in the design tool's canvas. When it lands, review against the brief + wire
  into the real `LockItIn` flow (real streaming `/api/lock-it-in`, real keeper/hook), admin-gated.
- **Next design chunk (pending content confirm):** the post-lesson **"slip back"** — the wrap after
  the interactive portion: WHAT'S NEXT / Keep-It-Sharp (keeper+hook), closing, sources, the `ai_prompt`,
  and feedback. Need user to confirm what "the prompt / additional content / feedback" map to before
  adding it to the brief as a chunk.
- **PostHog Analytics** still needs `POSTHOG_PERSONAL_KEY` in Vercel (from prior session).
- **History** verified (8 signed off + HS.2/HS.6 re-sourced); user verifying PF/Health/rotation.

## Next session — first moves
1. Check the repo for the **Aurora** branch/PR; review + wire in if present.
2. Confirm the **slip-back** content mapping; add it to the design brief as the next chunk.
3. When a content batch is signed off in /verify → run the **interleaved promotion** (dry-run → write
   → mark category state promoted → build → push).
