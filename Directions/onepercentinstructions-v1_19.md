# One Percent — Project Instructions
**Version 1.19 | Updated May 19, 2026**

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
| v1.18 | 2026-05-18 | Post and verify file naming updated to include category + concept slugs. Closing line: static tomorrow teaser removed, replaced with reflection prompt. Bottom tab nav added: Morning→Midday, Midday→Evening. Scroll-to-top on tab change implemented via useEffect watching tab state. Submit scrolls to score box. Score celebration: full-screen canvas confetti overlay. Morning explanation changed to explanation_paragraphs array. Midday In the Wild changed to itw_paragraphs array. |
| v1.19 | 2026-05-19 | JSX template canonized as hybrid: Inter font, Lucide tab icons, larger type scale, 720px max-width, starburst celebration animation. PDF removed as standard output — on-request only. Output set reduced to 5. GitHub as file storage protocol (replacing Google Drive). Archive gate rule added. Google Drive folder structure retired. |

---

## Known Issues — Flagged for Future Versions

### ISSUE-001: Static year references in instructions copy
**Flagged:** May 17, 2026 | **Status:** Noted — fix before public launch

Hardcoded year references throughout (e.g., "grounded in 2026," "state of the field as of 2026") will read stale in 2027+.

**Fix required:** Replace all static year references with relative language before any public-facing launch.

---

## Version Control Rule

Never edit a previous version file. Each update creates a new numbered file. The highest version number is always active.

---

## Product Context & Sprint Planning

One Percent is building toward a beta launch. Target library: **365 entries** — one per day. At 9 slots per rotation cycle, 365 entries requires ~40 full cycles plus 5 additional entries.

**Sprint context:** Dedicated generation sprints needed to bank content ahead of beta. Goal: stay 30–60 entries ahead of daily publishing pace before launch.

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
| — | Instructions | `onepercentinstructions-v1_19.md` | (this file) |
| — | Backlog | `onepercentbacklog.md` | (single living file) |

**PDF** — on-request only. Not generated by default. When requested: same naming pattern as carousel HTML with `.pdf` extension.

**Category slugs — LOCKED:**
`salecraft` · `ai` · `vocablanguage` · `mentalmodels` · `philosophy` · `neuroscience` · `communication`

**Concept slug rules:** lowercase, no spaces, no special characters.
Date in file names is created date — file system only, not user-facing.
Generation log stays date-only since it covers all entries for that session.

---

## Generation Log Version Control

- Each generation produces `onepercentlog[YYYY-MM-DD].md`
- Multiple same day: `-v2.md`, `-v3.md`
- Highest version for that date is always active
- Log is the source of truth — always read the most recent before generating

---

## GitHub File Storage Protocol — LOCKED

All generated files live in the One Percent GitHub repository. This is the source of truth for all content and the foundation for the eventual app.

### Repository Structure

```
one-percent-content/
├── Logs/
│   └── onepercentlog[YYYY-MM-DD].md
├── Directions/
│   └── onepercentinstructions-v1_19.md
├── Backlog/
│   └── onepercentbacklog.md
├── Archive-Original-JSX/
│   └── [original JSX files — pre-v1.19 template, original content]
└── Editions/
    ├── 001-AI-ContextWindow/
    │   ├── onepercent[YYYY-MM-DD]-ai-contextwindow.jsx
    │   ├── onepercentcarousel[YYYY-MM-DD]-ai-contextwindow.html
    │   ├── onepercentpost[YYYY-MM-DD]-ai-contextwindow.md
    │   └── onepercentverify[YYYY-MM-DD]-ai-contextwindow.md
    ├── 002-VocabLanguage-FramingEffect/
    └── [NNN-CategorySlug-ConceptSlug]/
```

### Edition Subfolder Naming

`[NNN]-[CategorySlug]-[ConceptSlug]`

Examples: `001-AI-ContextWindow` · `016-Communication-ActiveListening`

### Write Protocol

1. Confirm repo access before writing anything
2. Locate correct subfolder — create Edition subfolder under `Editions/` if it doesn't exist for the current entry
3. Write all output files to their correct locations
4. Write log to `Logs/`
5. Update backlog in `Backlog/`

### Hard Rules

- Never write files to the repo root
- If repo access fails, generate files locally and declare which files need to be committed manually
- PDFs are not committed to the repo — generated on demand and delivered in chat

---

## Archive Gate Rule — MANDATORY

**Do not regenerate any existing entry from scratch if the original source file is not available.**

Original files must be in `Archive-Original-JSX/` before regeneration begins. If the archive file is missing:
1. Stop
2. Tell Matthew which file is needed
3. Wait for the original to be added to the archive before proceeding

**Why:** Rebuilding from scratch changes examples, sources, and verified content that was already confirmed. The archive ensures regeneration is a template upgrade, not a content rewrite.

---

## What This Is

One Percent is a daily micro-learning system covering seven categories: Sales Craft, AI, Vocab & Language, Mental Models, Philosophy, Neuroscience & Cognition, and Communication. Each entry is immediately actionable — a concept explained clearly, grounded in real examples, tested with a quiz, delivered across a learning app and LinkedIn.

**Matthew is the author and curator.** He sets direction, holds editorial standards, and is building toward a beta product. He is not the target audience.

**The audience** is curious working professionals who want to get sharper — at selling, at thinking, at using language precisely, at understanding AI tools reshaping their work, at building better mental habits. They don't need to be talked down to. They value substance. They have limited time and zero patience for filler.

**Beta context:** Building toward early user testing. Target library: 365 entries. Content decisions should hold up to that standard — credible, grounded, worth coming back for daily.

**Matthew's role:**
- 20+ years enterprise sales experience — voice is informed by that, not constrained by it
- Creative entrepreneur: writer, rapper, visual artist — mpgink.com
- Direct, anti-bullshit, lo-fi ethos
- Content should sound like someone who knows their stuff and doesn't need to prove it

---

## Audience Framing by Category

**Sales Craft** — Salespeople in the field. The lens is the rep: discovery, pipeline, deals, buyers, negotiation, closing, prospecting, quota. NOT ops, NOT process infrastructure.

**AI** — Universally framed. Anyone building with, using, or understanding AI tools. Must reflect current state of the field — not outdated framing.

**Vocab & Language** — Universally framed. Semantics, rhetoric, framing, how language shapes thought and behavior.

**Mental Models** — Universally framed. Frameworks for thinking, deciding, avoiding predictable errors.

**Philosophy** — Universally framed. Ideas, ethics, meaning. Test is relevance now, not when it was written.

**Neuroscience & Cognition** — Universally framed. How the brain actually works: learning, memory, attention, habit, decision-making at the neural level. Not pop psychology — grounded in research.

**Communication** — Universally framed. How to get ideas across clearly under pressure. Listening, feedback, difficult conversations, writing clearly, presenting, nonviolent communication, the gap between what you said and what they heard. Distinct from Vocab & Language (which is about how language works) — this is about how people communicate effectively or fail to.

---

## Category Rotation — LOCKED (9-slot cycle)

`SC → AI → VL → SC → MM → AI → PH → NC → CM` → repeat

| Slot | Category | Code | Entries per cycle |
|---|---|---|---|
| 1 | Sales Craft | SC | 2 (slots 1 + 4) |
| 2 | AI | AI | 2 (slots 2 + 6) |
| 3 | Vocab & Language | VL | 1 |
| 4 | Sales Craft | SC | (second SC slot) |
| 5 | Mental Models | MM | 1 |
| 6 | AI | AI | (second AI slot) |
| 7 | Philosophy | PH | 1 |
| 8 | Neuroscience & Cognition | NC | 1 |
| 9 | Communication | CM | 1 |

**Per cycle:** 9 entries · **To reach 365:** ~40 full cycles + 5 entries

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

### Part 1 — Concept selection check
- Is this concept alive in current conversation? Strong candidate.
- If older — does it still hold? Test is relevance, not recency.
- Is the reference outdated? Especially critical for AI and Neuroscience.

Fail both tests → pick a different concept.

### Part 2 — Framing check (every entry, no exceptions)
Every entry must contain at least one signal grounding it in now. Test: could someone read this and think it was written three years ago? If yes, add the signal.

---

## Concept Brainstorm Process — MANDATORY

Two-part process: real-time search signal + backlog check. Both required. Neither optional.

### Step 1 — Real-time search signal

Run 1–2 targeted searches before concept selection.

Example queries by category:
- **Sales Craft:** `B2B sales challenges [current year]` · `sales skills trending`
- **AI:** `AI literacy workplace [current year]` · `LLM developments current`
- **Vocab & Language:** `language framing debate current` · `rhetoric persuasion current`
- **Mental Models:** `decision making frameworks trending` · `cognitive bias research current`
- **Philosophy:** `philosophy applied work current` · `stoicism relevance current`
- **Neuroscience & Cognition:** `neuroscience workplace learning current` · `cognitive performance research current`
- **Communication:** `workplace communication research current` · `listening feedback skills current`

Substitute the actual current year in queries — do not hardcode years.

### Step 2 — Backlog check — MANDATORY, NON-SKIPPABLE

**Read `onepercentbacklog.md` before finalizing any concept.**

- Concept in backlog as candidate → use the backlog entry
- Search signal surfaces something stronger not in backlog → use it, add as "used," add adjacent candidates
- `[PRIORITY]` flag exists for this category → give it first consideration

**Confirm the backlog check in the transparency statement.**

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
14. After generating: produce post file · produce verify receipt · update backlog · produce log

### Transparency statement — required before every generation

> "Log reviewed · Last: [EditionID / concept] · Next: [category] · Concept: [chosen concept] · Edition ID: [EditionID] · Backlog reviewed · [concept] was [in backlog as candidate / not in backlog — added] · Temporal relevance: [one sentence] · Sources: verified · Quote: verified · AI nudge: [applicable / not applicable] · In the Wild: [Type A / B / C] · Midday escalation: confirmed · Q3 application: confirmed"

---

## Quote Integrity Rule — MANDATORY

All quotes verbatim. No paraphrases as quotes. Every quote confirmed from a specific, identifiable source with Name + work + year minimum. Widely attributed quotes with no traceable primary source — not usable as direct quotes.

---

## Sources Verification Rule — MANDATORY

Web-search confirm before writing: real title, real author(s), real year and publication, working open-access URL. Never guess a URL. Never invent a citation.

---

## "In the Wild" Sourcing Rule — MANDATORY

**Type A** — Documented, citable. Strongest.
**Type B** — Widely known, publicly documented, broadly verifiable.
**Type C** — Clearly labeled hypothetical. Required framing: "Here's how this typically plays out..." or "Imagine a rep who..." No invented statistics. No fictional characters presented as real.

### Midday Escalation Rule

In the Wild must advance the concept beyond morning — consequence, reversal, unexpected domain, counterintuitive finding. Not more proof of what morning established.

---

## Measurable Behavior Rule

When a concept involves trackable behavior (ratios, metrics, data), direct the reader to their actual number — not an estimate. If the org has the tool, tell them where to look. If not, name that as a gap and point to a free alternative.

---

## AI Nudge Rule

If the concept naturally involves AI as a tool (not as the subject), add a brief specific nudge in the closing line of the Midday Reframe. Don't force it — skip if AI isn't a logical tool for the concept.

---

## Content Blocks

### Morning
- Concept explanation — written as `explanation_paragraphs: []` array, 3–4 paragraphs, one idea per paragraph. Natural breaks: what the concept is → the mechanism → why it's hard → the implication. Never a single block of text.
- WHY NOW box — current-relevance hook
- Morning challenge — concrete, specific, actionable today

### Midday
- Reframe — shift in perspective, accent left border
- In the Wild — real (Type A/B) or clearly labeled hypothetical (Type C)
  - **Must be broken into 2–3 short paragraphs.** Never a single long block. Natural breaks: setup / what happened / consequence.
- Quote — verbatim only, properly attributed
- Closing nudge — one question that makes the reader apply the concept to their own situation; AI nudge appended if applicable

### Closing line rule — LOCKED

**No static "tomorrow teaser."** The closing line is always a reflection prompt — one question tied to the current concept. Not a preview of the next entry.

Examples:
- "Where in your work are you treating column-two problems as if they were column one?"
- "What are you practicing comfortably right now when you should be practicing at the edge?"
- "On your next call: do you know what's actually behind what they're saying?"

### Evening — Quiz Interaction Pattern — LOCKED

All three questions visible at once. One answer per question. Single SUBMIT — disabled until all three answered. On submit: all states reveal simultaneously, explanations appear, score celebration triggers, score box renders and auto-scrolls into view.

---

## Output 1: React Artifact — LOCKED (v1.19 Template)

### Imports — LOCKED
```jsx
import { useState, useEffect, useRef } from "react";
import { BookOpen, Lightbulb, Award } from 'lucide-react';
```

### Tabs — LOCKED
- Morning: `BookOpen` icon + "MORNING" label
- Midday: `Lightbulb` icon + "MIDDAY" label
- Evening: `Award` icon + "EVENING" label

No emoji in tab labels. Icons only from Lucide.

POST tab permanently removed. React artifact is the app — for learners.

### Datebar — LOCKED
`[EditionID] · [Concept]` — e.g., `CM.1 · Active Listening`
No date. Clean.

### Bottom Tab Navigation — LOCKED

Each tab content area ends with a next-tab button. Clicking advances to the next tab AND scrolls to top.

- **Morning tab bottom:** Button → advances to Midday
- **Midday tab bottom:** Button → advances to Evening
- **Evening tab bottom:** No button — end of flow

**Scroll to top** handled by useEffect watching tab state — NOT onClick. Fires after render, not before:

```js
const isFirst = useRef(true);
useEffect(() => {
  if (isFirst.current) { isFirst.current = false; return; }
  window.scrollTo({ top: 0, behavior: "smooth" });
}, [tab]);
```

**On Submit:** scrolls to score box after 150ms delay:
```js
setTimeout(() => scoreRef.current?.scrollIntoView({behavior:"smooth",block:"center"}), 150);
```

### Style — LOCKED (v1.19)

| Element | Spec |
|---|---|
| Background | #0A0A0A |
| Font | Inter, sans-serif (Google Fonts — weights 300/400/500/600) |
| Max width | 720px, centered |
| Header | Logo left + entry badge / Streak + category badge right |
| Datebar | EditionID · Concept — 10px, muted, fontWeight 500 |
| Concept title | 32px, fontWeight 600, letterSpacing -0.02em |
| Tab labels | 11px, Inter, fontWeight 500, 0.08em tracking, icon + label, active: accent + 2px bottom border |
| Hook text | 20px, white, letterSpacing -0.01em |
| Body text | 15px, #bbb, 1.8 line-height |
| Why Today text | 14px, #bbb, 1.7 line-height |
| Morning Challenge text | 14px, #999, 1.8 line-height |
| Section labels | 10px, 0.12em tracking, fontWeight 600, uppercase |
| Reframe block | 3px solid accent left border, 17px, fontWeight 500 |
| In the Wild text | 15px, #bbb, 1.8 line-height, 2–3 paragraphs |
| Quote block | 1px solid accent 25% opacity, 15px, italic |
| Midday nudge | 14px, #777 |
| Quiz question | 14px, #ccc, 1.7 line-height, fontWeight 400 |
| Quiz options | 13px, line-height 1.6, #111 bg, #222 border; selected: accent + 13% bg; correct: green; wrong: red |
| Quiz explanation | 13px, #666, 1.7 line-height |
| Submit button | Inter, 12px, fontWeight 600, 0.08em tracking |
| Score box | Tiered — see Score Celebration section |
| Closing line | 14px, #aaa, italic, 1.8 line-height |
| Sources toggle | Inter, 11px, fontWeight 500 |
| Sources link | 12px, fontWeight 500, accent color |
| Sources detail | 12px, #444, 1.6 line-height |

### Score Celebration — LOCKED (v1.19)

**3/3 — PERFECT SCORE:**
- Starburst animation: 16 gradient rays expanding from center + 60 particle burst
- Rays: accent → transparent gradient, lineWidth 3, lineCap round
- Particles: accent + white + yellow + pink, gravity, fade out over ~140 frames
- "LOCKED IN 🔒" text fades in at frame 50, Inter bold 28px
- Score box: accent border, pulseBorder animation (3 pulses), popIn entry
- Label: "PERFECT SCORE" / "You've got this one locked in."

**2/3 — ALMOST THERE:**
- Arc animation: accent arc drawing to 2/3 completion over 50 frames, "2/3" center text
- Fades out after frame 60, total ~80 frames
- Score box: gray border, popIn entry
- Label: "ALMOST THERE" / "One away. Come back and get that third."

**0–1/3 — no animation:**
- Score box: dark border (#333), static — no animation
- Label: "KEEP GOING" (1/3) or "REVIEW & RETRY" (0/3) / "The concepts will stick with more reps. Come back."

Canvas overlay: `position:fixed, top:0, left:0, width:100%, height:100%, pointerEvents:none, zIndex:9999`

### CSS — LOCKED (v1.19 Inter template)

```js
const css = (accent) => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{background:#0A0A0A;font-family:'Inter',sans-serif;}
  @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  @keyframes popIn{0%{transform:scale(0.85);opacity:0}70%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
  @keyframes pulseBorder{0%,100%{box-shadow:0 0 0 0 ${accent}44}50%{box-shadow:0 0 0 8px ${accent}11}}
  .fade-in{animation:fadeIn 0.28s ease forwards}
  .tab-btn{background:none;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-size:11px;font-weight:500;letter-spacing:0.08em;padding:10px 14px;color:#555;transition:color 0.2s;border-bottom:2px solid transparent;display:flex;align-items:center}
  .tab-btn:hover{color:#aaa}.tab-btn.active{color:${accent};border-bottom-color:${accent}}
  .next-tab-btn{display:block;width:100%;margin-top:32px;padding:14px 20px;background:${accent};color:#0A0A0A;border:none;border-radius:4px;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;letter-spacing:0.08em;cursor:pointer;text-align:center;transition:opacity 0.2s}
  .next-tab-btn:hover{opacity:0.85}
  .quiz-opt{background:#111;border:1px solid #222;border-radius:4px;padding:14px 16px;cursor:pointer;font-family:'Inter',sans-serif;font-size:13px;color:#999;margin-bottom:8px;transition:all 0.18s;text-align:left;width:100%;line-height:1.6}
  .quiz-opt:hover:not(:disabled){border-color:${accent}44;color:#ddd;background:#141414}
  .quiz-opt.selected{border-color:${accent};background:${accent}22;color:#eee}
  .quiz-opt.correct{border-color:#4ade80;color:#4ade80;background:#4ade8011}
  .quiz-opt.wrong{border-color:#f87171;color:#f87171;background:#f8717111}
  .submit-btn{background:${accent};color:#0A0A0A;border:none;padding:12px 24px;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;letter-spacing:0.08em;cursor:pointer;border-radius:3px;margin-top:8px}
  .submit-btn:disabled{opacity:0.3;cursor:not-allowed}
  .score-box{border-radius:6px;padding:28px 20px;text-align:center;margin:24px 0;animation:popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards}
  .score-perfect{background:${accent}0f;animation:popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards,pulseBorder 1.8s ease-in-out 0.4s 3}
  .score-close{background:#1a1a1a}.score-low{background:#111}
  .src-toggle{background:none;border:1px solid #222;padding:7px 14px;font-family:'Inter',sans-serif;font-size:11px;font-weight:500;color:#555;cursor:pointer;border-radius:3px;letter-spacing:0.08em}
  .src-toggle:hover{color:#999;border-color:#444}
  .src-link{color:${accent};text-decoration:none;font-size:12px;display:block;margin-bottom:4px;font-family:'Inter',sans-serif;font-weight:500}
  .src-link:hover{text-decoration:underline}
`;
```

### Style Object — LOCKED (v1.19)

```js
const S = {
  root:{background:"#0A0A0A",minHeight:"100vh",fontFamily:"'Inter',sans-serif",color:"#fff",maxWidth:720,margin:"0 auto",paddingBottom:80},
  header:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 24px 12px",borderBottom:"1px solid #141414"},
  hL:{display:"flex",alignItems:"center",gap:10},hR:{display:"flex",alignItems:"center",gap:12},
  logo:{fontSize:11,letterSpacing:"0.15em",color:"#fff",fontWeight:600},
  entryBadge:{fontSize:10,color:"#333",letterSpacing:"0.1em",fontWeight:500},
  streak:{fontSize:11,color:"#aaa",fontWeight:500},
  badge:{fontSize:9,letterSpacing:"0.12em",padding:"4px 9px",borderRadius:3,fontWeight:600},
  datebar:{fontSize:10,color:"#333",letterSpacing:"0.1em",padding:"8px 24px",borderBottom:"1px solid #0f0f0f",fontWeight:500},
  conceptBlock:{padding:"28px 24px 0"},
  conceptName:{fontSize:32,fontWeight:600,color:"#fff",letterSpacing:"-0.02em",lineHeight:1.1},
  tabRow:{display:"flex",borderBottom:"1px solid #141414",marginTop:20,padding:"0 12px",gap:4},
  content:{padding:"24px 24px 0"},
  label:{fontSize:10,letterSpacing:"0.12em",marginBottom:16,fontWeight:600,textTransform:"uppercase"},
  hook:{fontSize:20,color:"#fff",lineHeight:1.5,fontWeight:400,marginBottom:20,letterSpacing:"-0.01em"},
  srcSection:{padding:"28px 24px 48px"},srcDivider:{borderTop:"1px solid #141414",marginBottom:18},
  srcList:{marginTop:16,display:"flex",flexDirection:"column",gap:16},srcItem:{},
  srcDetail:{fontSize:12,color:"#444",lineHeight:1.6},
  srcVerified:{fontSize:10,color:"#2a2a2a",letterSpacing:"0.1em",marginTop:8,paddingTop:12,borderTop:"1px solid #141414",fontWeight:500},
};
```

---

## Output 2: LinkedIn Carousel HTML

6 square slides, 1080x1080px. No date displayed anywhere.

### Mobile Responsiveness — LOCKED

```css
.slide-wrapper {
  width: min(1080px, calc(100vw - 32px));
  aspect-ratio: 1/1;
  position: relative;
}
.slide {
  width: 1080px; height: 1080px;
  transform-origin: top left;
  position: relative; overflow: hidden;
}
```

```js
function scaleSlides() {
  document.querySelectorAll('.slide-wrapper').forEach(wrapper => {
    const slide = wrapper.querySelector('.slide');
    const scale = wrapper.offsetWidth / 1080;
    slide.style.transform = `scale(${scale})`;
    wrapper.style.height = (1080 * scale) + 'px';
  });
}
scaleSlides();
window.addEventListener('resize', scaleSlides);
```

### Fonts — LOCKED
- **Playfair Display** — headers, concept names, pull quotes
- **Barlow Condensed** — body text, explanations, options
- **DM Mono** — labels, footers, tags, attribution

### Slide Structure — LOCKED

**Slide 1 — Cover:** Dark bg. Logo top-left, entry number top-right. Category eyebrow. Concept name (Playfair 88px+). Accent rule. Hook. Category tag + Edition ID bottom. Noise texture. Footer.

**Slide 2 — Concept:** Light bg. Label + category tag. Concept title. Accent rule. Explanation (Barlow Condensed, max 4–5 sentences). WHY NOW box. Footer.

**Slide 3 — Challenge:** Dark bg. Label. Challenge title. 3 numbered steps max. Watermark bottom-right. Footer.

**Slide 4 — In the Wild + Quote:** Dark bg. Label + source type. Reframe (Playfair italic). Story (max 4 sentences). Quote block. Footer.

**Slide 5 — Quiz + CTA:** Light bg. Label. One question, 4 options (correct highlighted). Closing line. CTA bar. Footer.

**Slide 6 — Sources:** Dark bg. Label. "The Research Behind This." 3 numbered sources (reference, detail, URL). Verified badge. Footer.

### Every Slide — Fixed Elements
- **Top:** 6px gradient accent bar
- **Footer:** 60–64px — `mpgink.com · buymeacoffee.com/mpgink` / `#OnePercent #[Category]`

### Page-Bleed Prevention — MANDATORY
1. Slide 2: max 4–5 sentences at 25–27px Barlow Condensed
2. Slide 4: max 4 story sentences; quote block must clear footer
3. Slide 6: reference (1 line), detail (1–2 lines), URL — verified badge must clear footer
4. All slides: min `padding-bottom: 92px` on flex column layouts
5. Long concept names: break with `<br>` on Slide 1

Budget vertical space before writing copy. Cut copy, not padding.

---

## Output 3: LinkedIn Post File

`onepercentpost[YYYY-MM-DD]-[categoryslug]-[conceptslug].md` — for Matthew's use only.

### Format: Teaser, not summary
1. Hook — provocation or counterintuitive statement
2. Concept tease — name it, hint at why it matters
3. The pull — 2–3 lines, value without giveaway
4. CTA — direct ("Swipe through.")
5. Hashtags — `#OnePercent` + category tags

No sources. 150–250 words. No "Today I'm sharing..." openers. No slide-by-slide summaries. Conversational, not corporate.

**LinkedIn Document Title — LOCKED:** `One Percent #[entry] — [Concept Name]`
Stated at end of every generation. No improvising at upload time.

---

## Output 4: Verification Receipt

`onepercentverify[YYYY-MM-DD]-[categoryslug]-[conceptslug].md` — raw receipts for Matthew's independent fact-check before posting.

### Open-access URL rule — MANDATORY
Confirming URLs must be clickable. Use arXiv, PubMed, author pages, or Google Scholar — not paywalled publisher pages. If no open-access version exists, note it explicitly. Publisher URLs that block non-browser access → use arXiv preprint as confirming URL instead.

### Format — LOCKED

All URLs formatted as clickable markdown links. Each source block includes specific navigation directions — exactly where on the page the relevant content lives.

```markdown
# One Percent — Verification Receipt
**Entry [###] | [EditionID] | [Category] | [Concept] | Created: [YYYY-MM-DD]**

---

## How to use this file

Click any link to open the source directly. Use the "Where to find it" directions to
locate the specific passage without hunting. Flag anything that doesn't match before posting.

---

## Sources

### Source 1 — [Short label]
- **Claimed in entry:** [title, author, year, publication]
- **Search query used:** `[exact query Claude ran]`
- **Confirming URL:** [Title](full URL)
- **Where to find it:** [Specific navigation]
- **Verbatim text found:** "[exact excerpt]"
- **What to check:** [One specific caveat]

### Source 2 — [same structure]
### Source 3 — [same structure]

---

## Quote

- **Quote as used in entry:** "[exact quote]"
- **Attributed to:** [Name, work, year, location]
- **Search query used:** `[exact query]`
- **Confirming URL:** [Title](full URL)
- **Where to find it:** [Specific navigation]
- **Verbatim text found:** "[exact excerpt]"
- **Secondary confirmation URL:** [Title](URL)
- **What to check:** [caveat]

---

## In the Wild

- **Type:** [A / B / C]
- **Claimed in entry:** [Specific facts]
- **Search query used:** `[exact query]`
- **Primary confirming URL:** [Title](full URL)
- **Where to find it:** [Specific navigation]
- **Verbatim text found:** "[excerpt]"
- **Secondary URL (if used):** [Title](URL)
- **What to check:** [caveat]

---

## Verification status

| Item | Status | Quick-check link |
|---|---|---|
| Source 1 | Verified | [Open source](URL) |
| Source 2 | Verified | [Open source](URL) |
| Source 3 | Verified | [Open source](URL) |
| Quote | Verbatim confirmed | [Open confirming page](URL) |
| In the Wild | [Type] — [one-line note] | [Open primary source](URL) |

*Raw receipt for Matthew's review. Click any link above. Flag anything that doesn't match before posting.*
```

---

## Output 5: Generation Log

`onepercentlog[YYYY-MM-DD].md`

Each entry records: entry number · Edition ID · date created · category · concept · files generated · sources verified · quote confirmed · In the Wild type · notable issues or decisions.

The log is the source of truth. Always read the most recent before generating.

---

## Output — PDF (On Request Only)

PDF is not generated by default. Generate only when Matthew requests it — typically for entries going to LinkedIn that week.

**When requested:** Use Playwright script. Confirmed working (May 16, 2026).

```python
from playwright.sync_api import sync_playwright
import subprocess, os

HTML_PATH = "/path/to/onepercentcarousel[YYYY-MM-DD]-[categoryslug]-[conceptslug].html"
PDF_PATH  = "/path/to/onepercentcarousel[YYYY-MM-DD]-[categoryslug]-[conceptslug].pdf"

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1112, "height": 1080})
    page.goto(f"file://{HTML_PATH}")
    page.wait_for_timeout(2500)
    page.pdf(path=PDF_PATH, width="1080px", height="1080px",
             print_background=True,
             margin={"top": "0", "right": "0", "bottom": "0", "left": "0"})
    browser.close()

result = subprocess.run(["pdfinfo", PDF_PATH], capture_output=True, text=True)
print(result.stdout)
```

**Expected:** 6 pages · 810x810 pts. If page count ≠ 6: fix HTML, re-run, re-verify.
PDFs are not committed to the GitHub repo.

---

## Post-Generation Validation Protocol — MANDATORY

### Step 1 — Verify HTML
6 slide wrappers · correct fonts · correct accent color · footer on every slide · no date displayed.

### Step 2 — Generate post file
`onepercentpost[YYYY-MM-DD]-[categoryslug]-[conceptslug].md` · teaser format · 150–250 words · LinkedIn Document Title at bottom.

### Step 3 — Generate verification receipt
`onepercentverify[YYYY-MM-DD]-[categoryslug]-[conceptslug].md` · all sources, quote, In the Wild with search queries and open-access URLs.

### Step 4 — Update backlog
Mark used concept. Add new candidates surfaced during generation.

### Step 5 — Update generation log
`onepercentlog[YYYY-MM-DD].md` with full entry.

### Step 6 — Write to GitHub
Commit all 5 output files to their correct locations in the repo. Log to `Logs/`. Backlog update to `Backlog/`. New edition files to `Editions/[NNN-CategorySlug-ConceptSlug]/`.

### Step 7 — Declare completion

```
OUTPUTS COMPLETE — Entry [###] | [EditionID]

1. React artifact:   onepercent[YYYY-MM-DD]-[cat]-[concept].jsx
2. Carousel HTML:    onepercentcarousel[YYYY-MM-DD]-[cat]-[concept].html
3. LinkedIn post:    onepercentpost[YYYY-MM-DD]-[cat]-[concept].md
4. Verify receipt:   onepercentverify[YYYY-MM-DD]-[cat]-[concept].md
5. Generation log:   onepercentlog[YYYY-MM-DD].md

PDF: [not generated / generated on request]
GitHub: [committed / pending token]

LinkedIn Document Title: One Percent #[entry] — [Concept Name]
```

---

## Backlog File

`onepercentbacklog.md` — single living file, updated after every generation. Never versioned — updated in place. One section per category. Claude maintains it; Matthew can add or flag at any time.

---

## Weekly Content Strategy

| Day | Post |
|---|---|
| Monday | One Percent carousel (LinkedIn Document Post) |
| Tuesday | ICYMI invite post — short, first person, no pitch energy |
| Wednesday | Aloha Friday Motivation newsletter teaser/reminder |
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
- Every entry grounded in now — no outdated framing
- Neuroscience: research-grounded, not pop psychology
- Communication: practical and immediately applicable, not theoretical

---

## App Build — State as of May 19, 2026

### Stack
- **Framework:** Next.js 16 (App Router)
- **Auth + DB:** Supabase (`uuzdlubbynavybttlmeh` — project `one-percent-better`)
- **Hosting:** Vercel — `https://one-percent-app.vercel.app`
- **Repo:** `mgolia6/one-percent-app` — app lives in `/app-next/` subdirectory

### Architecture
- **`/app-next/components/EntryViewer.jsx`** — single shared UI component. Receives entry data as props. Handles all tabs, quiz, celebration, completion card, sources.
- **`/app-next/public/entries/[NNN].json`** — one JSON file per entry. This is the content source of truth for the app. NOT the JSX files.
- **`/app-next/lib/supabase.js`** — lazy Supabase client
- **`/app-next/lib/unlock.js`** — day-based unlock logic (Option A: entry N unlocks on day N of membership)
- **`/app-next/app/page.js`** — library/home view with stats bar and entry list
- **`/app-next/app/login/page.js`** — magic link login
- **`/app-next/app/entry/[id]/page.js`** — entry page, loads JSON, saves completion to Supabase

### Supabase Schema (applied)
Two tables:
- **`profiles`** — id, email, signup_date, current_streak, longest_streak, last_active_date
- **`completions`** — user_id, entry_number, score, time_to_quiz, answers (jsonb), completed_at

RLS enabled on both. Users can only read/write their own rows.

### Entry JSON Format (canonical)
Every entry JSON in `public/entries/` must have:
```json
{
  "entry": "001",
  "editionId": "AI.1.1",
  "category": "AI",
  "categoryTag": "AI",
  "concept": "Context Window",
  "accent": "#47FFE8",
  "accentDim": "rgba(71,255,232,0.10)",
  "morning": {
    "hook": "...",
    "explanation_paragraphs": ["...", "...", "..."],
    "why_today": "...",
    "morning_challenge": "..."
  },
  "midday": {
    "reframe": "...",
    "itw_label": "IN THE WILD — TYPE X · SOURCE",
    "itw_paragraphs": ["...", "...", "..."],
    "quote": "...",
    "attribution": "...",
    "midday_nudge": "..."
  },
  "quiz": [
    {
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "correct": 0,
      "explanation": "..."
    }
  ],
  "closing": "...",
  "sources": [
    { "label": "...", "detail": "...", "url": "..." }
  ]
}
```

### Content Status
All 16 entries have JSON files in `public/entries/`:
001 (AI — Context Window) · 002 (VL — Framing Effect) · 003 (SC — Discovery Questions) · 004 (MM — Inversion) · 005 (PH — Premeditatio Malorum) · 006 (AI — Prompt Sensitivity) · 007 (SC — Talk/Listen Ratio) · 008 (AI — Chain-of-Thought) · 009 (VL — Euphemism Treadmill) · 010 (SC — Anchoring) · 011 (MM — Second-Order Thinking) · 012 (AI — Hallucination) · 013 (PH — Dichotomy of Control) · 014 (SC — Tactical Empathy) · 015 (NC — Neuroplasticity) · 016 (CM — Active Listening)

### Entry Manifest (home page)
`/app-next/app/page.js` has a hardcoded `ENTRIES` array with all 16 entries for the library view. Update this array when new entries are added.

### Known Issues / Next Steps for App
1. **Post-completion UX** — completion card with "BACK TO LIBRARY" and "VIEW SOURCES" buttons added and deployed
2. **Library polish** — basic list view works, no visual upgrade yet
3. **Streak logic** — implemented client-side in entry page, saves to Supabase profiles table
4. **No entry manifest JSON** — entries array is hardcoded in page.js; should eventually be data-driven
5. **No new entry flow** — to add entry 017+: create JSON in public/entries/, add to ENTRIES array in page.js, commit and push

### Adding New Entries
1. Generate content per v1.19 instructions
2. Create `public/entries/[NNN].json` using the canonical JSON format above
3. Add entry to `ENTRIES` array in `app/page.js`
4. Commit and push — Vercel auto-deploys
5. Also add `Editions/[NNN-Category-Concept]/` folder in repo for JSX/carousel/post/verify files per existing protocol

### Env Vars (Vercel — already set)
```
NEXT_PUBLIC_SUPABASE_URL=https://uuzdlubbynavybttlmeh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1emRsdWJieW5hdnlidHRsbWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMTAzMDQsImV4cCI6MjA5NDc4NjMwNH0.Wtd0HkesOp1n3CMUdxeX_AqPpv0s5oiBcvfKkTLM-p0
```
