# One Percent — Full-App Visual Direction Brief

Goal: establish **one coherent, premium visual language** for the entire app, prove it on a core
screen, then roll it across every screen. Read with `WORKING-WITH-CLAUDE-DESIGN.md` (the playbook)
and `DESIGN-MOMENTS.md` (the reward moments live inside this system).

## The approach — identity FIRST, screens second
1. **Phase 1 — set the language on the INTERACTIVE QUIZ.** Design the quiz *experience* — how it
   plays out, end to end, resolving into the peak — 2–3 distinct ways, as a playable prototype.
   The quiz is the core interactive loop (states, motion, feedback, the run-up to the reward), so
   designing it proves the whole language at once. We pick the one that feels like a flagship app.
2. **Phase 2 — roll it out.** Apply the chosen language across every screen (inventory below),
   including the lesson reading view, home, review, progress, profile.
3. **Phase 3 — the END moment.** The session close (see `DESIGN-MOMENTS.md`) designed *inside* the
   locked language. (The peak is already designed in Phase 1 as the quiz's resolution.)

> Read this as INTENT, not a spec. Bring your own system; give **2–3 directions** in Phase 1.
> Fixed vs. yours below.

## Quality bar & references
The bar is **Linear · Arc · Apple · Oura · Copilot Money · Things** — refined typography, real depth
and material, generous space, purposeful weighted motion. Dark, premium, **emotional**, expensive.
**Best input you can give it: real reference screenshots** of those apps as the north star.

**Avoid (what "1st-grader CAD" looked like):** blueprint/wireframe/CAD/HUD/dashboard aesthetics;
corner brackets, crosshairs, tick-marks, segmented gauges; mono type everywhere; thin accent strokes
on black; flat, cold, clinical layouts; clip-art icons; emoji-as-design; spring-bounce/confetti.
If a screen looks like a schematic or an admin dashboard, it's wrong.

## Brand foundations
**Fixed (the identity):**
- Dark base: bg `#0e141c`, surfaces `#1a2a3a`, ink `#e8eef5`.
- Category accent colors (the soul of the brand — keep the hues): AI `#47FFE8` · Personal Finance
  `#3DE88A` · Health `#FF5151` · History `#E0A93D` · Sales `#E8FF47` · Vocab `#FF8C47` · Mental
  Models `#C847FF` · Philosophy `#FF4778` · Neuroscience `#47C8FF` · Communication `#FF8C00`.
  Each lesson is themed by its category accent.
- Type family: **DM Sans** (UI/display) + **DM Mono** (small labels only).

**Yours to elevate (the craft):** the type scale & hierarchy, spacing system, depth/material
(gradients, glow, shadow, glass), component styling (cards, buttons, tabs, inputs), iconography,
motion language, and how the accent is used (as **light/gradient/glow**, not thin strokes). Make it
feel considered and expensive. The current app (read the files below) is *functional but plain* —
your job is to elevate it into something premium while keeping the identity.

## Read for ground truth (what exists today, to elevate — not copy)
- `app-next/lib/categories.js` — category names + accent colors (source of truth).
- `app-next/components/EntryViewer.jsx` — the **lesson view** (Phase 1 target): morning concept,
  midday application, evening quiz, sources. This is the heart.
- `app-next/app/page.js` — home/library (Today / Library / Prompts / Progress) + the best existing
  moments (commit ritual, badge overlay) as a polish bar.
- `app-next/app/review/page.js`, `app-next/app/profile/page.js`, `app-next/app/onboarding/page.js`.

## Fixed vs. yours
- **FIXED:** the identity (dark base + category accents + DM Sans/Mono), the content structure of
  each screen, the premium/emotional bar, accessibility (legible contrast).
- **YOURS:** everything in "craft" above — invent the system.

## Phase 1 deliverable — the INTERACTIVE QUIZ, as it plays out (2–3 directions)

> **The MOTION is the deliverable — not a screen.** Do NOT build a static quiz form that reveals
> answers. Build the *choreography* of playing through it: every beat below must be **animated and
> playable** (tap an option → it responds → feedback animates → it transitions to the next →
> resolves into the peak). If it looks like a form with selectable options, it's wrong. Think
> Oura/Arc-grade micro-interaction, alive and tactile.

Playable, phone-framed (~390×844), dark prototype on a real lesson (Personal Finance ·
"Compound Interest"). It must play through, with motion on every beat:

1. **Question presentation.** One concept, 3 questions. *(Today all 3 render at once with a single
   SUBMIT that reveals everything — `EntryViewer.jsx` ~670. You're free to redesign the flow — e.g.
   one question at a time with transitions, a progress sense, building anticipation.)*
2. **Answering.** Selecting an option should feel responsive and satisfying — state, depth, motion;
   not a flat form. The accent is light, not a thin border.
3. **Feedback.** Right/wrong lands with **premium, kind** feedback — no harsh red/green boxes. Let
   correct answers feel good and wrong ones feel like a nudge, not a buzzer. Build a little tension
   across the three.
4. **Resolution → the PEAK.** The last answer flows into the mastery-confirmation moment
   (`DESIGN-MOMENTS.md`): 3/3 / 2/3 / miss, premium, earned, emotional — NOT a lock/seal/schematic.

This single flow proves the entire language — type, color, depth, components, motion, feedback.
Make the 2–3 directions genuinely *distinct* takes on "a premium quiz experience," not one idea
restyled. Include a replay/reset so we can run it again and try the miss path.

## Phase 2 — screen inventory (after the language is locked)
Apply the chosen language to: **Home/Library** (Today, library grid, progress) · **Lesson** (the
three parts + quiz) · **Peak + End moments** (`DESIGN-MOMENTS.md`) · **Review** (spaced repetition,
recall/grade) · **Progress** (stats, streak, score trend) · **Profile** · **Onboarding / first-run**
· **Login**. (Internal tools — admin, verify — are out of scope for the premium pass.)

## Process
Give 2–3 Phase-1 directions → we pick → you refine with one-liners ("warmer," "bigger type," "more
depth," "show the Health red theme") → roll across the inventory → hand the set to Claude Code to
build into the real app, screen by screen, behind the admin gate.
