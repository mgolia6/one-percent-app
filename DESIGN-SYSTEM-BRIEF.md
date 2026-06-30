# One Percent — Full-App Visual Direction Brief

Goal: establish **one coherent, premium visual language** for the entire app, prove it on a core
screen, then roll it across every screen. Read with `WORKING-WITH-CLAUDE-DESIGN.md` (the playbook)
and `DESIGN-MOMENTS.md` (the reward moments live inside this system).

## The approach — identity FIRST, screens second
1. **Phase 1 — set the language on the conversational "LOCK IT IN" chat.** Design the app's flagship
   AI interaction — a coached 3-turn chat that ends in a score + memory hook + keeper — as a playable
   prototype, 2–3 distinct ways. It's the densest mix of presence, motion, feedback, and payoff, so
   designing it proves the whole language. (The multiple-choice quiz is the fallback, designed later.)
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

## Phase 1 deliverable — the conversational "LOCK IT IN" experience (2–3 directions)

> **This is the app's flagship, AI-native interaction — a short *coached chat* that locks the concept
> in. NOT the multiple-choice quiz (that's the fallback), NOT a static screen.** The deliverable is
> the **playable, animated conversation** — the AI's presence, the streaming, the message
> choreography, the build, and the payoff. If it looks like a form or a plain chat-bubble clone,
> it's wrong. Think a beautifully art-directed AI tutor (Arc/Oura-grade), alive and warm.

Ground truth: `app-next/components/LockItIn.jsx` (the real 3-turn flow) + `app-next/app/api/lock-it-in`.
Playable, phone-framed (~390×844), dark, themed by the category accent. Real lesson: Personal
Finance · "Compound Interest". The flow, animated on every beat:

1. **The AI opens** (recall): *"In your own words — what is **Compound Interest**, and why does it
   matter?"* The question should *arrive* with presence (a tutor thinking/typing), not just appear.
2. **You answer** — a beautiful, inviting input. On send, your message settles in and the AI
   **streams** a short, warm coaching reply (*"Good — that's the kind of thinking that makes it stick."*).
3. **Move 2** (apply): *"Can you think of an example of this in action?"* → answer → coached reply.
4. **Move 3** (the keeper): *"If you kept one sentence about Compound Interest, what's the keeper?"*
   → answer → FINISH. A quiet sense of progress builds across the three moves.
5. **The payoff** (the peak for this mode — currently flat, make it land): a premium reveal of the
   **score**, a one-line recap, a **🧠 memory hook** (an AI-offered image/association to make it
   stick), and **YOUR KEEPER** — an editable sentence saved for later (with a "your version / sharper
   version" choice). End on **LOCK IT IN →**. See `DESIGN-MOMENTS.md` for the peak's emotional bar
   (premium, earned — NOT a lock/seal/schematic).

This proves the entire language — type, color, depth, motion, the feel of an AI presence, and the
payoff. Make the 2–3 directions genuinely *distinct* takes on "a premium AI learning conversation,"
not one idea restyled. Include a replay so we can run it again.

## Phase 2 — screen inventory (after the language is locked)
Apply the chosen language to: **Home/Library** (Today, library grid, progress) · **Lesson** (the
three parts + quiz) · **Peak + End moments** (`DESIGN-MOMENTS.md`) · **Review** (spaced repetition,
recall/grade) · **Progress** (stats, streak, score trend) · **Profile** · **Onboarding / first-run**
· **Login**. (Internal tools — admin, verify — are out of scope for the premium pass.)

## Process
Give 2–3 Phase-1 directions → we pick → you refine with one-liners ("warmer," "bigger type," "more
depth," "show the Health red theme") → roll across the inventory → hand the set to Claude Code to
build into the real app, screen by screen, behind the admin gate.
