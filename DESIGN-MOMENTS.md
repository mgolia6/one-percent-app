# One Percent — Reward Moments Design Brief

Brief for Claude design (or any prototyping tool) pointed at this repo. Build **interactive,
playable, phone-framed prototypes** of the app's key reward moments — then we wire the winners
into the real app. Read the ground-truth files below; don't guess the brand.

> **Read this as INTENT, not a spec.** The mechanics described below (corner-bracket clamp, vault,
> segmented streak, etc.) are **one reference direction, not a requirement.** Your job is to
> *design* — bring your own mechanic and **give me 2–3 distinct directions per moment**, including
> ones I didn't ask for. Then I'll pick one to refine. Process guide: `WORKING-WITH-CLAUDE-DESIGN.md`.

## What's FIXED vs. what's YOURS
**Fixed (non-negotiable):**
- Brand tokens + a dark, premium, on-brand look (it has to live next to the real app).
- The **peak-end discipline** (over-invest in exactly two moments; keep the rest quiet).
- The **emotional job** of each moment (peak = *you just permanently captured this, and you earned
  it*; end = *bank the win, protect the streak, pull me back tomorrow*).
- **Restraint / earned tiers** — a full reward fires only at the top tier.

**Yours (design it):** the metaphor, the mechanic, the motion vocabulary, the exact copy. Surprise me.

## Read these files for ground truth
- `app-next/lib/categories.js` — **canonical category names + accent colors** (source of truth).
- `app-next/components/EntryViewer.jsx` — the lesson + quiz flow. The **PEAK** currently lives
  here: the `Celebration` component (~line 9) and the `op-score-perfect/close/low` score boxes
  + `scoreLabel`/`scoreSub` (~514–518). This is what we're replacing.
- `app-next/app/page.js` — home/library. The `S` style object holds the live design tokens; the
  **commit ritual** (~1671) and **badge overlay** (~208) are the best existing moments — match
  that bar. Streak is written silently in `app-next/app/entry/[id]/page.js` (~328).

## Brand tokens (canonical)
- Background `#0e141c` · surfaces `#1a2a3a` · ink `#e8eef5` · muted `rgba(232,238,245,0.5)` ·
  hairlines `rgba(255,255,255,0.10)`.
- Category accents (use the active one): AI `#47FFE8` · Personal Finance `#3DE88A` ·
  Health & Performance `#FF5151` · History `#E0A93D` · Sales `#E8FF47` · Vocab `#FF8C47` ·
  Mental Models `#C847FF` · Philosophy `#FF4778` · Neuroscience `#47C8FF` · Communication `#FF8C00`.
- Type: **DM Sans** (UI) + **DM Mono** (labels/numbers — uppercase, letter-spaced ~0.16em).
- Voice: terse, confident, no fluff, lightly gamified. "Locked in." not "Great job!!".

## Material language — NEON PRECISION
Cold, machined, futuristic. Thin 1px strokes, hard mechanical easing `cubic-bezier(.6,0,.2,1)`,
light sweeps/pulses, snap/clamp motions, corner brackets, segmented bars.
**NO skeuomorphism, NO springy bounce, NO wax/paper/confetti.** Weight and precision, never cartoon.

## The one principle — PEAK–END
Design strictly by the peak-end rule (it's literally lesson NC.10 in this app — practice it).
Do NOT spread equal polish across many micro-moments. Over-invest in exactly two and keep the
rest quiet. Rewards are **earned** — a full beat fires only at the top tier.

---

## MOMENT 1 — THE PEAK: "the concept locks in" (start here)
The instant of mastery confirmation after the 3-question quiz. Single highest-intensity moment.

The concept name (e.g. "Compound Interest") sits in a thin-bordered frame (the specimen).
- **3/3:** two corner brackets (top-left + bottom-right) snap inward and clamp the frame like
  calipers closing (fast, hard ease). A hard click (one-frame flash). A thin light-line sweeps
  left→right once. The border brightens to the accent with a single light-pulse bloom. A DM Mono
  label types in `LOCKED · 3/3`, then a terse line: "Filed for life."
- **2/3:** brackets snap but only partially seat; dimmer, no glow, no sweep. `ONE OPEN · 2/3`
  (muted/amber). "Close. One rep from sealed." CTA `RUN IT BACK`.
- **0–1/3:** the clamp tries and **releases** — brackets snap inward then slide back open (it
  didn't take). Border stays dim. `DIDN'T TAKE · 1/3`. "Reps fix this." The RETRY button is the
  loud accent CTA. Honest, never punishing.

Control bar to replay: `[3/3] [2/3] [MISS]`. 3/3 must feel like a genuine, restrained win; the
miss must feel honest, not sad.

## MOMENT 2 — THE END: the session close (one continuous beat)
The last thing before the app is put down — weighted as heavily as the peak, and the retention
lever. After the peak, the screen resolves into `SESSION · COMPLETE`, assembling top→bottom:
1. **Bank the win** — the locked concept files into `THE VAULT`; a counter ticks `11 → 12`,
   `12 / 70 LOCKED`, a thin progress notch fills.
2. **Secure the streak** — a 7-segment week bar; today's segment lights with a click + single
   pulse; `🔒 6 DAYS · SAFE TILL TOMORROW` (loss aversion made physical).
3. **Open tomorrow's loop** — a panel slides up: kicker `TOMORROW`, the next category in its
   accent, a one-line teaser hook ("The 2-minute habit that flattens your blood-sugar spike."),
   and a thin `unlocks in 14h` countdown.
4. A single quiet exit: `SEE YOU TOMORROW`.

## Deliverable
One interactive artifact, phone-framed (~360×740), dark, mobile-first, using the tokens above,
with a control bar that replays each moment. Make the motion feel machined and intentional.
Prioritize the PEAK and the END feeling *exceptional* over covering breadth.
