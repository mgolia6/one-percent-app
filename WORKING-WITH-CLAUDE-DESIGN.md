# Working with Claude design — our playbook

How we use the design tool (connected to this GitHub repo) to prototype UI/moments, and hand the
winners to Claude Code to make real. Lock this in; follow it every time.

## The mental model
- **Connecting the repo gives it CONTEXT, not INTENT.** It can read our real tokens, components,
  and briefs — but it designs nothing until you *tell it what to build*.
- **A committed brief = intent in the repo** (e.g. `DESIGN-MOMENTS.md`). That's why your kickoff
  can be one line instead of a wall of pasted spec.
- **Two roles:** *Claude design* = fast visual iteration / playable prototypes. *Claude Code* =
  make it real (wire into the actual components, real data, admin-gated, build + push).

## The golden rule: brief the PROBLEM, not the SOLUTION
If you hand it the exact mechanic, copy, and sequence, it just *renders your idea* — you lose the
reason to use it. Give it the **job + constraints + what "good" means**, and let it design.
- **Always ask for 2–3 distinct directions, then converge.** Diverge first, pick second.
- Phrase it as "solve this, three ways," not "execute this."

## Fixed vs. yours (the split — put it in every brief)
- **FIXED:** brand tokens + dark, on-brand look; the design *principle* in play (e.g. peak-end);
  the *emotional job* of the moment; restraint / earned hierarchy.
- **YOURS:** the metaphor, the mechanic, the motion vocabulary, the copy.

## The workflow
1. **Point** it at the repo + the relevant brief + ground-truth files (real tokens/components).
2. **Kickoff** — one line: which brief, which moment, "give me 2–3 directions."
3. **Judge against the bar** (below), not "does it look cool."
4. **Converge** — pick a direction, refine with one-liners.
5. **Hand off** — give Claude Code the PR/branch; it reviews against the brief and wires the winner
   into the real app, admin-gated, for live testing before rollout.

## The bar (how to judge any moment)
- Does it do the **emotional job**? (not just look nice)
- Is it **earned**? Do the tiers (e.g. 3/3 vs 2/3 vs miss) look *visibly* different?
- Is it **restrained**? A peak only reads as a peak if the rest is quiet. If everything erupts, fail.
- Is it **on-brand**? It has to live next to the real app — dark, premium, our tokens/fonts.
- Did it **diverge or just execute**? If it only rendered our reference idea, push it to propose its own.
- Did it **drift** into bounce/glow-everything/confetti clichés? That's the prompt — tighten it.

## Reusable kickoff templates
- **Explore:** "Treat `<brief>` as intent, not spec. Give me 2–3 distinct mechanics for `<moment/job>`.
  Fixed: `<brand + principle + job + restraint>`. Yours: the mechanic. Surprise me, then I'll pick."
- **Refine:** "Take direction 2. Colder / slower / more weight on the click. Show the `<category>`
  (`<accent hex>`) variant."
- **Hand off (to Claude Code):** "Wire this into `<component>`, real data, admin-gated."

## Set the aesthetic target by FEELING + REFERENCE, never by literal motifs
Hard-won lesson. We wrote "neon precision / machined / clamp / corner brackets / segmented bars"
and the tool rendered a literal **engineering schematic** — green tick-marks, brackets around the
word, "SPECIMEN 042." A HUD, not a premium app. Two failure modes to avoid:
- **Literal-motif briefs.** Describing *mechanisms* (lock, seal, clamp, gauge, brackets) makes it
  draw the mechanism. Describe the **feeling + quality bar + reference apps** instead, and let it
  invent the mechanic. ("Feels like an Apple Fitness ring closing," not "a bolt throws.")
- **Mono + thin strokes everywhere = terminal.** DM Mono is for *small labels only*; hero type is
  big confident DM Sans. Use accent color as **light/glow/gradient/depth**, not thin green lines.
Name the reference class explicitly (Linear, Arc, Apple, Oura, Copilot Money) and what to AVOID
(blueprint/CAD/wireframe/HUD/dashboard). If it looks like a schematic, the brief over-prescribed.

## Principles we've locked
- **Peak–end:** over-invest in exactly two moments; everything else whispers.
- **Restraint:** full reward only when earned.
- **Premium-emotional, not mechanical:** reward moments are consumer celebrations (warmth, depth,
  light, beautiful type), not machines locking shut.
- **On-brand:** the prototype must look like it belongs in a flagship app.
- **Design the problem, get options, then converge** — never hand it the finished answer.

## Where things live
- `DESIGN-MOMENTS.md` — the active brief (peak + end specs, as *reference*, plus fixed-vs-yours).
- Ground truth: `app-next/lib/categories.js` (accents), `app-next/components/EntryViewer.jsx`
  (the peak today), `app-next/app/page.js` (tokens + the best existing moments to match the bar).
- Repo: https://github.com/mgolia6/one-percent-app (default branch `main`).
