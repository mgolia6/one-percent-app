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

## Look & feel — premium, restrained, alive
The quality bar is **Linear · Arc · Apple · Oura · Vercel** — refined typography, real depth and
material, generous spacing, and motion that's purposeful, weighted, and physical (eased, never
decorative). Dark and neon-accented, but **elegant and expensive**, like a flagship app.

Confident and minimal: let the concept and the moment breathe. One or two hero elements, strong
type hierarchy, subtle glow/depth, motion that *rewards* rather than *decorates*.

**DO NOT produce (this is what "1st-grader CAD" looks like — avoid it):**
- Technical-drawing / blueprint / wireframe / CAD aesthetics.
- Corner brackets, crosshairs, calipers, tick-marks, or HUD/sci-fi circuit-diagram overlays.
- Hard geometric "precision" motifs that read cold, crude, and amateur.
- Segmented engineering bars, dashed borders everywhere, clip-art icons, default system UI.
- Spring-bounce, confetti, emoji-as-design, or anything that reads cheap or childish.

If a frame looks like an engineering schematic or a dashboard, it's wrong. It should look like a
beautifully art-directed moment in a premium consumer app.

**Type & color discipline (this is where it went wrong before):**
- **DM Mono is for SMALL labels only** — never hero type, never body. The concept name is large,
  confident **DM Sans display** type, and it is the hero.
- Use the accent as **light, gradient, glow, and depth** — not as thin green strokes on black.
  Thin lines + mono caps + brackets = terminal/HUD. Avoid.
- Embrace **depth and warmth**: soft gradients, subtle glow, real shadow, generous space. Flat.

**Reference the feeling of these reward moments:** Apple Fitness ring close · Oura readiness reveal ·
Copilot Money / Robinhood number resolves · Headspace session complete · Arc's little delights.

## The one principle — PEAK–END
Design strictly by the peak-end rule (it's literally lesson NC.10 in this app — practice it).
Do NOT spread equal polish across many micro-moments. Over-invest in exactly two and keep the
rest quiet. Rewards are **earned** — a full beat fires only at the top tier.

---

## MOMENT 1 — THE PEAK: mastery confirmation (start here)
The instant after the quiz when the user learns they nailed it — the single most rewarding beat of
a session. **The job:** make them *feel* they just permanently captured this concept — a genuine
little hit of pride. Premium, warm, satisfying, and earned.

- The **concept name is the hero** — set it large and beautifully; let the category accent become
  light, color, and depth around it. The reward is felt through motion + light + type, not labels.
- Motion should feel **expensive**: a settle, a bloom of light, a number resolving — the close of an
  Apple Fitness ring, not a machine.
- **Earned tiers** (visibly different via energy/color/light/motion — never via brackets or labels):
  - **3/3:** the full, warm celebration. The peak.
  - **2/3:** quieter, dimmer — acknowledged, not celebrated. "One more rep."
  - **0–1/3:** honest and kind — no celebration, a calm reset with a confident, loud RETRY. Never punishing, never sad.

Replay controls `[3/3] [2/3] [MISS]`. **Do NOT render a lock, seal, bracket, specimen, gauge, or
schematic.** The mechanic is yours — give 2–3 *premium* directions.

## MOMENT 2 — THE END: the session close
The last thing before the app is put down — weighted as heavily as the peak, and the retention
lever. It should leave the user feeling **accomplished and quietly pulled toward tomorrow** — premium,
warm, calm-confident. Three jobs (the treatment is yours — make each *beautiful*, never a dashboard
or stat readout):
1. **Bank the win** — reflect their growing mastery back in a way that feels *valuable*, not a metric.
2. **Protect the streak** — make continuing feel worth protecting (loss aversion), warmly.
3. **Open tomorrow** — a genuine, enticing hook for the next concept that creates anticipation.

End on one calm, confident exit. **Avoid gauges, segmented bars, counters, and terminal aesthetics.**

## Deliverable
One interactive artifact, phone-framed (~360×740), dark, mobile-first, using the tokens above,
with a control bar that replays each moment. Make the motion feel machined and intentional.
Prioritize the PEAK and the END feeling *exceptional* over covering breadth.
