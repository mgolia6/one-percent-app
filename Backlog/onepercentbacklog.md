# One Percent — Concept Backlog
**onepercentbacklog.md | Living file — updated after every generation**
Last updated: May 19, 2026 — v1.19 (Entry 017: Multi-Threading marked used) (7 categories, 9-slot rotation)

This is the standing candidate list. Claude reads this before every generation, cross-references against the search signal, marks used concepts, and adds new candidates as they surface.

Status codes: `candidate` · `used` · `needs-verification`

---

## How to use this file

- **Claude:** Read before every concept selection. Cross-reference with search signal. Pick the strongest candidate for the current rotation slot. Mark as `used` after generation. Add new candidates surfaced during research.
- **Matthew:** Add ideas at any time. Flag anything with `[PRIORITY]` to move it to the top of the queue for that category. Notes on specific angles or sources are welcome.

---

## Category Registry — v1.17

| Code | Category | Accent | Rotation Slot |
|---|---|---|---|
| SC | Sales Craft | #E8FF47 | Slots 1 + 4 (double) |
| AI | AI | #47FFE8 | Slots 2 + 6 (double) |
| VL | Vocab & Language | #FF8C47 | Slot 3 |
| MM | Mental Models | #C847FF | Slot 5 |
| PH | Philosophy | #FF4778 | Slot 7 |
| NC | Neuroscience & Cognition | #47C8FF | Slot 8 |
| CM | Communication | #FF8C00 | Slot 9 |

9-slot cycle: `SC → AI → VL → SC → MM → AI → PH → NC → CM` → repeat
Target library: 365 entries (~40 full cycles)

---

## Sales Craft (SC) — Accent: #E8FF47

**Used:**
- Discovery Questions — SC.1.1
- Talk/Listen Ratio — SC.1.2
- Anchoring in Negotiation — SC.2.1

### Chris Voss / Black Swan Group — Negotiation Series

*Never Split the Difference* (2016) and Black Swan Group's ongoing training content are the most-cited negotiation framework in enterprise sales right now. These concepts are distinct entries — don't batch them. Each one carries a full carousel. Primary source for all: Voss, C. & Raz, T. *Never Split the Difference.* HarperBusiness, 2016. Black Swan Group publishes active blog/training content at blackswanltd.com. Voss has been active on podcast circuit through 2025-2026 (Lex Fridman, MasterClass, etc.) — verify recency of any quotes before use.

| Concept | Relevance Note | Status |
|---|---|---|
| Tactical empathy | Understanding and articulating the counterpart's perspective and emotions — not agreeing with them, but demonstrating you hear them. Foundation of the Voss method. Chapter 3, NSTD. | **used — SC.2.2** |
| Mirroring | Repeating the last 1–3 words of what someone said to keep them talking. Deceptively simple. FBI-sourced. Chapter 2, NSTD. | candidate |
| Labeling | Naming the counterpart's emotion to defuse it: "It seems like..." / "It sounds like..." Distinct from sympathy — it's tactical acknowledgment. Chapter 3, NSTD. | candidate |
| Calibrated questions | "How" and "What" questions that give the counterpart the illusion of control while extracting information. "How am I supposed to do that?" as a no-cost rejection. Chapter 7, NSTD. | candidate |
| The accusation audit | Preemptively listing every negative thing the counterpart might think or feel about you — before they can say it. Disarms defensiveness. Chapter 5, NSTD. | candidate |
| "That's right" vs. "You're right" | The most important distinction in negotiation. "You're right" ends the conversation. "That's right" means they feel genuinely understood. Chapter 5, NSTD. | candidate |
| The late-night FM DJ voice | Downward inflection = authority and calm. Upward inflection = seeking approval. How tone of voice controls frame. Chapter 1, NSTD. | candidate |
| The Black Swan concept | Unknown unknowns that completely change the negotiation landscape when discovered. Why information gathering never stops. Chapter 10, NSTD. | candidate |
| No-oriented questions | Getting the counterpart to say "no" as a way of making them feel safe and in control — more powerful than yes in many scenarios. Chapter 6, NSTD. | candidate |
| The Ackerman model | Systematic anchoring and concession strategy: start at 65%, move to 85%, 95%, 100% of target, with decreasing increments and non-round numbers. Chapter 9, NSTD. Distinct from anchoring entry (which covered Tversky/Kahneman theory). | candidate |

### General Sales Craft Candidates

| Concept | Relevance Note | Status |
|---|---|---|
| SPIN Selling | Neil Rackham's 40,000-call research base. Still the most evidence-backed discovery methodology. Being revisited in context of complex enterprise deals. | candidate |
| Challenger Sale methodology | Dixon & Adamson 2011. "Teach, Tailor, Take Control" — resurging as buyers become more informed and value-led. Relevant contrast to relationship selling. | candidate |
| Loss aversion in sales | Kahneman/Tversky applied to buyer behavior. Distinct from anchoring entry. How framing a deal around loss vs. gain shifts close rates. | candidate |
| Multi-threading / executive access | Getting above the champion to multiple stakeholders. Critical in enterprise sales, documented in win/loss data (Gong, Chorus). | **used — SC.3.1** |
| Pipeline velocity | The four levers: deal count, average deal size, win rate, sales cycle length. Measurable. Good Measurable Behavior Rule candidate. | candidate |
| MEDDIC / MEDDPICC | Qualification framework. Widely adopted in enterprise SaaS. Strong source availability (John McMahon, Force Management). | candidate |
| Objection handling as intelligence | Objections aren't resistance, they're data. How top reps use objections to diagnose deal health. Behavioral sourcing from Gong available. | candidate |
| Social proof in B2B | Reference customers, case studies, peer validation. How and when it works — and when it backfires. | candidate |
| The follow-up cadence | Persistence vs. annoyance. Research on optimal follow-up timing and messaging variation. Measurable Behavior Rule candidate. | candidate |
| Value-based selling | Shift from feature/price to business outcome. Counter to commoditization. Relevant as buyers face budget scrutiny. | candidate |
| Building champions | How reps develop internal advocates. Distinct from multi-threading — this is the relationship play inside the account. | candidate |
| The 1-call close myth | Why most enterprise deals require 7+ touches and what that means for pipeline management. Research-backed, contrarian framing. | candidate |

---

## AI — Accent: #47FFE8

**Used:**
- Context Window — AI.1.1
- Prompt Sensitivity — AI.1.2
- Chain-of-Thought Prompting — AI.2.1
- Hallucination / Confabulation — AI.2.2

**Candidates:**

| Concept | Relevance Note | Status |
|---|---|---|
| RAG (Retrieval-Augmented Generation) | How LLMs connect to external knowledge bases. Critical for anyone building AI-powered tools or evaluating vendor claims. Active 2026 architecture topic. | candidate |
| AI Agents and tool use | Models that take actions, not just generate text. Rapidly evolving in 2026 — agentic workflows are the current frontier. High relevance, verifiable sources. | candidate |
| Temperature and sampling | What controls model "creativity" vs. predictability. Practical for prompt engineers and anyone building with AI APIs. | candidate |
| Fine-tuning vs. prompting | When you need a custom model vs. better prompts. Decision framework relevant to any org deploying AI. | candidate |
| Embeddings and vector search | How AI finds "similar" things. Foundation of semantic search, RAG, recommendation systems. More accessible than it sounds. | candidate |
| RLHF (Reinforcement Learning from Human Feedback) | How models are aligned to human preferences. Explains why ChatGPT feels different from base GPT. Accessible framing available. | candidate |
| Model evals and benchmarks | How AI capability is measured — and why benchmarks are often gamed or misunderstood. Critical AI literacy concept for 2026. | candidate |
| System prompts | The hidden instructions that shape AI behavior. Relevant to anyone using AI tools at work — most don't know they exist. | candidate |
| Multimodal AI | Models that process text, image, audio, video. Where the field is in 2026 — not just language anymore. | candidate |
| AI and cognitive bias | How training data biases surface in model outputs. Practical for anyone making decisions with AI assistance. | candidate |
| Prompt injection | Security concept — how malicious instructions can hijack AI behavior. Increasingly relevant as AI agents take real-world actions. | candidate |
| The context length race | Why model makers keep extending context windows — and what the actual limits are in practice. Follow-on to AI.1.1. | candidate |

---

## Vocab & Language (VL) — Accent: #FF8C47

**Used:**
- Framing Effect — VL.1
- Euphemism Treadmill — VL.2

**Candidates:**

| Concept | Relevance Note | Status |
|---|---|---|
| Loaded language | Words that carry emotional/political charge beyond their literal meaning. How loaded language shapes perception — and how to recognize it in real-time. | candidate |
| Dog whistles and coded language | Communication designed to mean different things to different audiences. Active in political, marketing, and corporate discourse. | candidate |
| The illusion of explanatory depth | People think they understand complex systems better than they do until asked to explain them. Classic psychology concept with strong professional application. | candidate |
| Semantic satiation | When a word loses meaning from repetition. Relevant to brand language, corporate buzzwords, political rhetoric. | candidate |
| Weasel words | Vague qualifiers that dilute accountability in communication. "Some people say," "many experts believe." Active in media literacy discourse. | candidate |
| Jargon as power | How technical language creates in-group/out-group dynamics. Who benefits from impenetrable jargon — and who gets excluded. | candidate |
| The Overton Window | The range of ideas politically or socially acceptable at any given time. How it shifts — and who moves it. Active in 2026 discourse. | candidate |
| Code-switching | Adapting language, tone, and register across social contexts. Professional and cultural dimensions. | candidate |
| Nominalization | Turning verbs into nouns to obscure agency. "A decision was made" vs. "I decided." Common in corporate and political language. | candidate |
| Metalanguage | Language used to talk about language. How framing the conversation shapes the conversation itself. | candidate |

---

## Mental Models (MM) — Accent: #C847FF

**Used:**
- Inversion — MM.1
- Second-Order Thinking — MM.2

**Candidates:**

| Concept | Relevance Note | Status |
|---|---|---|
| First Principles Thinking | Breaking problems down to foundational truths rather than analogies. Musk made it mainstream; the concept predates him significantly (Aristotle, Descartes). Active in startup and innovation discourse. | candidate |
| The Map Is Not the Territory | Korzybski. All models are simplifications — the danger is mistaking the model for reality. Foundational epistemology with enormous practical scope. | candidate |
| Opportunity Cost | Every choice forecloses other choices. The invisible cost of decisions. Underused outside economics. | candidate |
| Survivorship Bias | We study what survived, not what failed. Distorts our understanding of success across fields. Broad, high-impact, well-sourced. | candidate |
| Hanlon's Razor | Never attribute to malice what can adequately be explained by stupidity (or incompetence). Reduces paranoia, improves diagnosis. | candidate |
| The Overfitting Trap | Optimizing too hard for past data, losing generalizability. Applies beyond ML — relevant to strategy, hiring, product. | candidate |
| Confirmation Bias | We seek information that confirms what we already believe. Most documented cognitive bias. Strong sourcing (Nickerson 1998, Kahneman). | candidate |
| Occam's Razor | Among competing explanations, prefer the simplest one that fits the evidence. | candidate |
| Sunk Cost Fallacy | Past investment shouldn't drive future decisions. Well-sourced, universally applicable. | candidate |
| Dunning-Kruger Effect | Incompetent people overestimate their competence; experts underestimate theirs. Active in professional development discourse. | candidate |
| Availability Heuristic | We judge probability by how easily examples come to mind — recent or vivid events dominate. | candidate |
| Steel-Manning | Constructing the strongest possible version of an opposing argument before engaging with it. Counter to strawmanning. | candidate |
| The Planning Fallacy | We systematically underestimate how long things take. Kahneman, active in project management discourse. | candidate |
| Chesterton's Fence | Don't remove a fence until you understand why it was built. Powerful constraint on "move fast" thinking. | candidate |

---

## Philosophy (PH) — Accent: #FF4778

**Used:**
- Premeditatio Malorum — PH.1
- Dichotomy of Control — PH.2

**Candidates:**

| Concept | Relevance Note | Status |
|---|---|---|
| Amor Fati | Love of fate — not just accepting what happens, but embracing it. Nietzsche. Distinct from Stoic resignation. Active in resilience discourse. | candidate |
| Memento Mori | Remembering death as a clarifying force for how to live. Distinct from Premeditatio. Marcus Aurelius, Ryan Holiday 2025 Stoic series. | candidate |
| The Ship of Theseus | Identity and continuity through change. Relevant to orgs, products, personal transformation. Classic paradox. | candidate |
| Epistemic humility | Knowing the limits of what you can know. Foundational to good decision-making, scientific thinking, leadership. | candidate |
| The Trolley Problem | Moral intuition vs. ethical reasoning under constraint. Still the most efficient entry point into utilitarian vs. deontological ethics. | candidate |
| Examined life (Socrates) | "The unexamined life is not worth living." What it means to reflect deliberately. Entry point to virtue ethics. | candidate |
| Absurdism (Camus) | Life has no inherent meaning — and that's okay. The response to meaninglessness as creative act. Relevant to burnout and purpose discourse. | candidate |
| The Hedonic Treadmill | Returning to a stable happiness baseline after gains or losses. Why achievement doesn't produce lasting satisfaction. Psychology-philosophy crossover. | candidate |
| Veil of Ignorance (Rawls) | Design a just society without knowing what position you'd occupy in it. Powerful framework for fairness and policy thinking. | candidate |
| Negative utilitarianism | Minimize suffering rather than maximize happiness — and why that framing changes everything. | candidate |
| Kairos vs. Chronos | Greek distinction between clock time and opportune/meaningful time. Relevant to how we think about timing, urgency, and readiness. | candidate |
| Eudaimonia | Aristotelian flourishing — not pleasure, but living in accordance with your highest nature. Foundational concept, broadly accessible. | candidate |

---

## Neuroscience & Cognition (NC) — Accent: #47C8FF

How the brain actually works: learning, memory, attention, habit, decision-making at the neural level. Research-grounded, not pop psychology. Connects to why the One Percent format itself works.

**Used:** *(none yet — first NC entry is NC.1)*

**Candidates:**

| Concept | Relevance Note | Status |
|---|---|---|
| Neuroplasticity | **[PRIORITY — Matthew's request]** The brain's ability to rewire through experience. Foundation of all learning. Active in 2026 L&D research — multiple peer-reviewed papers Dec 2025/Jan 2026. | **used — NC.1** |
| Cognitive load theory | Sweller 1988, updated through 2020s. How working memory limits learning. Directly relevant to anyone designing or consuming information. | candidate |
| Spaced repetition | The forgetting curve (Ebbinghaus) and how spacing practice dramatically improves retention. Why One Percent works as a daily format — meta-relevant. | candidate |
| The default mode network | What the brain does when "idle" — creativity, consolidation, self-referential thought. Implications for rest, focus, creative work. | candidate |
| Decision fatigue | Willpower and decision quality degrade over the course of a day. Baumeister, Muraven. Relevant to how we structure work. | candidate |
| Sleep and memory consolidation | Sleep is when memories consolidate — not rest. Walker 2017 plus subsequent research. Directly actionable. | candidate |
| Stress and the prefrontal cortex | Acute vs. chronic stress effects on executive function. Amy Arnsten's research at Yale. Why stress makes you worse at the thing you most need to be good at. | candidate |
| Habit loops | Neural basis of habit: cue, routine, reward, basal ganglia. Duhigg built on Graybiel's MIT research. Distinct from philosophical habit discussion. | candidate |
| Attention and deep work | Neural basis of focused attention vs. mind-wandering. Gloria Mark's distraction research (UC Irvine). Cal Newport's applied framework. | candidate |
| Mirror neurons and empathy | Neural basis of social understanding. Rizzolatti's discovery, subsequent debate, what it actually explains about human connection. | candidate |
| Retrieval practice effect | Testing yourself is more effective than re-reading. Roediger & Karpicke 2006. Why the quiz in One Percent is pedagogy, not decoration. Meta-relevant. | candidate |
| Interleaving | Mixing practice across topics improves long-term retention even though it feels harder. Kornell & Bjork 2008. Counterintuitive and well-sourced. | candidate |

---

## Communication (CM) — Accent: #FF8C00

How people get ideas across effectively — or fail to. Practical and immediately applicable. Distinct from Vocab & Language (how language works) — this is about how people actually communicate.

**Used:** *(none yet — first CM entry is CM.1)*

**Candidates:**

| Concept | Relevance Note | Status |
|---|---|---|
| Active listening | Beyond hearing — attending to what someone is actually saying. Research on listening vs. hearing. Relevant to sales, leadership, relationships. | **used — CM.1** |
| Nonviolent communication (NVC) | Marshall Rosenberg's framework: observations, feelings, needs, requests. Widely used in conflict resolution and management. Strong sourcing. | candidate |
| Feedback that lands | The difference between feedback people hear and feedback they don't. Kim Scott (Radical Candor), SBI model. Active in management discourse. | candidate |
| Intent vs. impact | What you meant vs. what they received. Why good intent doesn't prevent bad impact — and what to do about it. | candidate |
| Crucial conversations | Patterson et al. — what happens to communication when stakes are high, opinions differ, emotions run strong. | candidate |
| Writing clearly under pressure | Inverted pyramid, plain language, why clarity is a form of respect. Orwell's six rules. Relevant to anyone writing at work. | candidate |
| The BLUF principle | Bottom Line Up Front — military communication technique for getting to the point under pressure. Immediately applicable. | candidate |
| Persuasion vs. manipulation | Where the ethical line is. Aristotle's rhetoric (ethos, pathos, logos) applied to modern professional communication. | candidate |
| The ladder of inference | Argyris — how we move from raw data to conclusions without noticing the steps. Why two people see the same event and reach opposite conclusions. | candidate |
| Asking better questions | Closed vs. open vs. probing questions — why most professionals default to the weakest form. Universally framed (connects to but distinct from Sales Craft discovery). | candidate |
| Psychological safety in communication | Amy Edmondson's research on team communication. Why people don't speak up — and what creates conditions where they do. | candidate |
| Silence as communication | Pausing, waiting, and what silence signals in negotiation, feedback, and difficult conversations. | candidate |

---

## Recently Surfaced (from search signal — May 17, 2026)

These came up during the research pass for Entry 013. Adding as candidates for future consideration:

- **AI literacy as a workplace skill** — being discussed as a distinct competency separate from AI tool use. Could be an AI entry.
- **Adaptability as a teachable skill** — showing up heavily in L&D research. Could sit in Mental Models or a future Leadership category.
- **Dwell time as a content metric** — LinkedIn algorithm is now weighting time spent, not just clicks. Platform-relevant but probably too meta for One Percent content.
- **Cognitive flexibility** — distinct from neuroplasticity, more behavioral. Could fit Mental Models or Neuroscience.

---

*This file is maintained by Claude. Matthew can add, flag, or reprioritize at any time.*
*Next generation: SC.2.2 — Sales Craft, second slot, cycle 2.*

---

## App Feature Backlog (non-content)

*Logged here until a dedicated product backlog file is created.*

### In Progress / Next Up
- [ ] **Button audit** — all buttons need loading/disabled/feedback states. Sign out flagged May 20.
- [ ] **Entry 017 verify audit** — interactive step-by-step, not a data dump. Quote flag: "about themselves" vs "themselves."
- [ ] **Entry 018 generation** — AI.3.1. Candidates: RAG, AI Agents, Temperature/Sampling.

### Profile & Identity
- [ ] **Profile page** `/profile` — editable first name, last name, phone. Email read-only. Access from library header.
- [ ] **Profile picture** — upload via Supabase Storage or external URL. Display on profile page + optionally library header.

### Badges & Gamification
- [ ] **Founder's Club badge** — permanent badge for all beta testers. `is_founder` boolean on profiles. Auto-grant or admin-controlled TBD.
- [ ] **Streak badges** — 3-day, 7-day, 30-day, 100-day. Awarded on streak milestone.
- [ ] **Usage badges** — First entry, first 3/3, 10 entries, 25 entries, all 7 categories, perfect week.
- [ ] **Badge system schema** — `badges` table + `user_badges` join table. Display on profile page.

### Known Issues (app)
- [ ] ISSUE-002 — Weekly feedback trigger broken for backdated/admin signups
- [ ] ISSUE-003 — Multi-threading bug (parallel entry loading) — not yet investigated
- [ ] ISSUE-004 — Sign out button has no visual feedback
