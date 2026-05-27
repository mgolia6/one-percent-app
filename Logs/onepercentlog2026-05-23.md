# One Percent — Session Log
**Date:** May 23, 2026
**Session:** v1

---

## Session Summary

Entry 020 generated — first entry produced after full feedback review. Applied the new felt-sense/scenario standard established in the May 22 session. NC category backfill per Matthew's direction.

---

## Entry Generated

### Entry 020 — NC.2 — Meditation and the Brain

**Edition ID:** NC.2  
**Category:** Neuroscience & Cognition (backfill — out of rotation per Matthew's direction to address lighter newer categories)  
**Concept:** Meditation and the Brain  
**Hook:** "You've been told meditation clears your mind. That's not what's happening. While you sit there quietly, your brain is running harder than it does at rest."

**Felt-sense standard applied:**
- Morning Brief opens with a specific scene (Tuesday 2pm, post-meetings, mind ricocheting) rather than abstract concept intro
- Counterintuitive angle: meditation is not a resting state — it's heightened activity with different dynamics
- Practical payoff grounded in three specific axes (attention, emotional regulation, self-awareness) tied directly to work performance
- Challenge gives concrete measurable practice (two specific numbers to track: how many times mind wandered, how fast return)

**Primary source:** Pascarella et al., *Neuroscience of Consciousness*, Nov 23 2025 — open access, confirmed. MEG scans of 12 Buddhist monks, mean 15,343 hours practice. Findings: increased neural complexity during meditation vs. rest; Samatha → ordered/focused state; Vipassana → brain criticality; ML classification 87–90% accuracy.

**Supporting sources:**
- Jerbi quote — UdeM Nouvelles, Jan 5 2026 (confirmed open access)
- Bremer et al. — Scientific Reports 2022 (DMN/salience/CEN connectivity — open access PMC)

**Rotation note:** NC.2 inserted out of standard rotation (standard next was SC slot 4). Matthew directed backfill of lighter newer categories. Next standard rotation entry should resume at SC.4.1.

---

## Transparency Statement

Log reviewed · Last: VL.3 / Nominalization (019) · Next: NC (backfill per Matthew) · Concept: Meditation and the Brain · Edition ID: NC.2 · Backlog reviewed · Meditation was in backlog under PH/NC crossover (candidate) · Temporal relevance: Nov 2025 MEG study on expert meditators — most granular real-time brain scan published to date · Sources: verified (open access confirmed) · Quote: Jerbi, UdeM Nouvelles Jan 2026, confirmed verbatim · AI nudge: not applicable · In the Wild: Type A (peer-reviewed study) · Midday escalation: confirmed · Q3 application: confirmed (team management / performance framing)

---

## Commits This Session

- `3a930b8` — Add entry 020: NC.2 — Meditation and the Brain

---

## Open / Next Session

- SC.4.1 — Mirroring (or next SC concept from Voss backlog) — standard rotation resumes
- Backlog: Meditation moved to `used — NC.2`
- Verification receipt for 020 still needed (Dead Drop optional)
- Build quiz revamp (section-specific 4-question post-entry feedback) — approved design, not yet built
- Build voice feedback (mic button on post-entry comment)
- ISSUE-002 — Weekly trigger broken for backdated signups
- Zero-completion gate on weekly wrap in-app modal
- Admin button states audit

---

## Wrap-Up Additions

**PU-001 clarified:** Library page refresh button — broken/unexpected behavior. Not admin portal.

**HITL Icon:** Went through 9 iterations. v9 approved as "works for now" — circle with human silhouette inside, directional arrowhead on circle. Saved as `hitl-icon-v9.jsx`. Next step: integrate into app (entry card badge + entry viewer). Commit to repo next session.

**Resend API key:** Matthew confirmed key was already in memory — no new exposure.

**Instructions updated to v1_29:** Publish gate added. No commit before verification. Dead Drop one claim at a time. Human sign-off required on verify receipt before push.

**Entry 020 verified by Matthew:** 2 of 3 claims confirmed. AUC numbers removed (unverified). Human sign-off logged in verify receipt.

**Platform upgrade notes:** PU-001 through PU-006 added to backlog.

## Next Session Priorities
1. Integrate HITL icon (v9) into app — entry card + entry viewer
2. PU-001 — Library refresh button fix
3. PU-006 — Admin users expandable cards
4. SC.4.1 — Next entry (Mirroring, standard rotation resumes)
5. Remaining PU items per capacity

---
## Session 2

---

## What We Did

Conducted a full security review of the One Percent app, covering six areas against the live codebase and Supabase schema.

### Areas Reviewed

1. **RLS (Row Level Security)** — Clear. All four tables protected. Admin gate backed by DB-level policy. Noted that regular users can't read back their own feedback/bug submissions.
2. **Auth / JWT** — Clear. Magic link OTP, no passwords, session gating on all protected routes. Gap: no email allowlist — anyone with the URL can sign up.
3. **Public JSON Entries** — Noted. Entry content readable without auth. Not a user data risk. Post-beta fix needed.
4. **Client-Side Anon Key** — Clear. Intentionally public. Service role key confirmed absent from all client code.
5. **Rate Limiting** — Noted. No throttling on feedback/bug endpoints. Acceptable for closed beta.
6. **Admin Page** — Clear. Two-layer protection: session + is_admin flag. RLS backs it up at data level.

---

## Enhancements Added to Backlog

| ID | Feature |
|---|---|
| ENH-006 | User feedback & bug history — let users read back their own submissions |
| ENH-007 | Email allowlist for beta access — NOW priority |
| ENH-008 | Gate entry JSON behind auth — post-beta |
| ENH-009 | Rate limiting on feedback/bug endpoints — post-beta |

---

## Files Changed

- `Directions/onepercentinstructions-v1_29.md` — ENH-006 through ENH-009 added to enhancement backlog
- `Docs/OnePercent-SecurityRiskReport.docx` — Full security risk report generated, includes summary table, area details, enhancement backlog, and end-of-beta reassessment checklist

---

## Next Session Priorities

- Implement ENH-007 (email allowlist) before expanding beta
- Entry 018 (AI.3.1 — RAG)
- Multi-threading bug fix (ISSUE-003)
- Weekly feedback test trigger for backdated signups (ISSUE-002)
