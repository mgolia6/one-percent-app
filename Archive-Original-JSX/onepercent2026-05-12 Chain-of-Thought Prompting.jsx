import { useState, useEffect } from "react";

// ─── ENTRY METADATA ──────────────────────────────────────────────────────────
// Entry: 008 | Category: AI | Concept: Chain-of-Thought Prompting
// Date: May 12, 2026
//
// SOURCES — verified via web search 2026-05-12:
// [1] Wei, J. et al. — "Chain-of-Thought Prompting Elicits Reasoning in Large
//     Language Models" — NeurIPS 2022 (Advances in Neural Information
//     Processing Systems 35, pp. 24824–24837)
//     arxiv.org/abs/2201.11903 ✓
//     3 LLMs tested across arithmetic, commonsense, symbolic reasoning.
//     CoT only improves performance in models ≥~100B parameters.
//     Smaller models: fluent but illogical chains of thought.
// [2] Kojima, T. et al. — "Large Language Models are Zero-Shot Reasoners"
//     NeurIPS 2022 (proceedings.neurips.cc/...8bb0d291acd4acf06ef112099c16f326)
//     arxiv.org/abs/2205.11916 ✓
//     Single phrase "Let's think step by step" boosts MultiArith accuracy
//     from 17.7% to 78.7% with InstructGPT (175B). Zero-shot. No examples.
// [3] Google Research Blog — "Language Models Perform Reasoning via Chain of
//     Thought" — Jason Wei, 2022
//     research.google/blog/language-models-perform-reasoning-via-chain-of-thought ✓
//     Official Google Research explainer on Wei et al. findings.
//
// QUOTE — verified verbatim 2026-05-12:
// "standard prompting only provides a lower bound on the capabilities
//  of large language models."
// — Jason Wei et al., Chain-of-Thought Prompting Elicits Reasoning in Large
//   Language Models, NeurIPS 2022 (arxiv.org/abs/2201.11903)
// Confirmed verbatim in PDF at arxiv.org/pdf/2201.11903 and openreview.net ✓
//
// AI NUDGE: Applicable (and central) — the concept IS a prompting technique;
// morning challenge gives reader a copy-paste CoT prompt to use right now.
//
// IN THE WILD: Type A — Kojima et al. NeurIPS 2022. Zero-shot CoT: single
// phrase "Let's think step by step" → 17.7% to 78.7% on MultiArith with no
// examples. Escalation: morning covers the mechanism (step-by-step reasoning);
// midday reveals zero-shot CoT — you don't need elaborate few-shot examples,
// one sentence changes the output. Reversal of the assumed effort required. ✓
//
// MIDDAY ESCALATION CHECK: Morning covers what CoT is and why it works.
// Midday escalates to the counterintuitive finding: you don't need engineered
// examples — a single phrase is sufficient. Flips the assumption that CoT
// requires heavy prompt engineering. Genuinely different angle. ✓
//
// QUIZ Q3 APPLICATION CHECK: Q3 presents a real scenario — user wants model
// to choose a business strategy — and asks what to do. Forces application,
// not identification. Wrong answers are plausible misapplications. ✓
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT = "#47FFE8";
const ACCENT_DIM = "#47FFE822";
const ACCENT_BORDER = "#47FFE844";

const data = {
  category: "AI",
  categoryTag: "AI",
  concept: "Chain-of-Thought Prompting",
  date: "May 12, 2026",
  entry: "008",
  morning: {
    concept: "Chain-of-Thought Prompting",
    hook: "You're asking AI to answer. You should be asking it to think.",
    explanation:
      "When you send a prompt, the model generates the most statistically likely next token — then the next — all the way to the answer. If you skip straight to asking for the answer, the model skips straight to giving you one, without the intermediate reasoning steps that would actually improve it. Chain-of-thought prompting changes that. By prompting the model to work through a problem step by step before answering, you force it to surface intermediate reasoning — and that reasoning both catches errors and produces better conclusions. Wei et al. tested this across three major language models on arithmetic, commonsense, and symbolic reasoning tasks. The results weren't marginal. For complex multi-step problems, CoT dramatically outperformed standard prompting — but only in large models. Below ~100B parameters, the models produced reasoning that was fluent and confident but logically broken. The chain looked right. The answer was wrong.",
    why_today:
      "Applies to standard models: GPT-4o, Claude Sonnet (non-thinking mode), Gemini Flash. Dedicated reasoning models — o3, Claude with extended thinking, DeepSeek R1 — run CoT internally; explicitly prompting them for it adds cost without gains. Know which tier you're in.",
    morning_challenge:
      "Pick a real decision, evaluation, or analysis task you're working through today — something with at least two or three moving parts.\n\nInstead of asking the model for the answer directly, use this prompt structure:\n\n\"I need you to think through this step by step before giving me your final answer. Here's the situation: [your actual situation]. Walk me through your reasoning — what factors matter, what the tradeoffs are, what's uncertain — and then give me your recommendation at the end.\"\n\nCompare the output to what you'd normally get asking the same question directly. Notice whether the reasoning surfaces anything the direct answer would have buried.",
  },
  midday: {
    reframe:
      "Chain-of-thought prompting isn't about getting the model to explain itself — it's about making the model do harder work before it answers.",
    real_world:
      "Kojima et al. (NeurIPS 2022) ran a follow-up experiment that flips everything you might assume about how CoT prompting works. Wei et al. had used few-shot CoT: carefully crafted examples showing the model how to reason step by step. Kojima's team asked: what if you strip all the examples out? No demonstrations. No engineering. Just add the phrase 'Let's think step by step' before the model's answer. On MultiArith — a benchmark of multi-step math word problems — accuracy jumped from 17.7% to 78.7%. With a single sentence. No examples, no prompt engineering, no fine-tuning. Zero-shot CoT. This doesn't just confirm that CoT works. It reframes what the mechanism actually is: you're not teaching the model to reason by showing it examples. You're unlocking reasoning that's already latent in a large enough model, simply by signaling that reasoning is expected.",
    quote:
      "standard prompting only provides a lower bound on the capabilities of large language models.",
    attribution: "Jason Wei et al., Chain-of-Thought Prompting Elicits Reasoning in Large Language Models, NeurIPS 2022",
    midday_nudge:
      "If one sentence can unlock a 4x accuracy improvement, what are you leaving on the table every time you send a prompt that just asks for an answer?",
  },
  quiz: [
    {
      question:
        "According to Wei et al. (NeurIPS 2022), chain-of-thought prompting consistently improves model performance only in models above approximately what size?",
      options: [
        "7B parameters — most instruction-tuned models meet this threshold",
        "20B parameters — the cutoff for commercial deployment",
        "~100B parameters — below this, CoT produces fluent but illogical reasoning",
        "500B parameters — only frontier models benefit meaningfully",
      ],
      correct: 2,
      explanation:
        "Wei et al. found CoT is an emergent ability of scale. Below ~100B parameters, models produce chains of thought that sound coherent but are logically broken — leading to lower accuracy than standard prompting.",
    },
    {
      question:
        "Why does chain-of-thought prompting improve output quality in large models — what is the actual mechanism?",
      options: [
        "CoT forces models to access a different part of their training data — one optimized for reasoning tasks",
        "Breaking a problem into explicit intermediate steps shapes the probability landscape so each subsequent token is generated with more relevant context",
        "CoT activates the model's fact-retrieval mode, which reduces hallucination by cross-referencing stored knowledge",
        "The model interprets step-by-step instructions as a signal to increase response length, which statistically correlates with accuracy",
      ],
      correct: 1,
      explanation:
        "Each step in a chain of thought becomes context for the next token. Explicit intermediate reasoning keeps the model on track through multi-step problems instead of jumping directly to a likely-but-wrong answer.",
    },
    {
      question:
        "You're using a frontier LLM to evaluate which of three market expansion strategies your team should pursue. You paste in a summary of all three options and ask: 'Which strategy should we choose?' The model picks Strategy B with a short rationale. What would chain-of-thought prompting change about this workflow?",
      options: [
        "You'd ask for the answer in a different format — bullet points instead of prose — so the reasoning is easier to scan",
        "You'd add 'think carefully' to the prompt, signaling the model to draw from more of its training data before answering",
        "You'd instruct the model to work through each strategy's tradeoffs, risks, and assumptions before committing to a recommendation — surfacing the reasoning rather than just the conclusion",
        "You'd run the same prompt three times and take the most common answer, which statistically reflects the model's highest-confidence output",
      ],
      correct: 2,
      explanation:
        "CoT is about making the reasoning explicit before the answer. Asking for the recommendation directly buries whatever intermediate analysis might have changed the answer — or revealed why it shouldn't be trusted.",
    },
  ],
  closing_line: "Tomorrow: the reasoning you don't see is the reasoning that can't be challenged.",
  post: `Most people use AI like a search engine.
Ask a question. Get an answer. Move on.

Chain-of-thought prompting is the technique that changes that equation.

Instead of asking the model for an answer directly — you ask it to think first.

Here's the research:

Wei et al. (NeurIPS 2022) tested CoT across three large language models on arithmetic, commonsense, and symbolic reasoning tasks.

For complex multi-step problems, CoT dramatically outperformed standard prompting.

Then Kojima et al. went further.

They stripped out all the carefully engineered examples — and just added one sentence before the model's answer:

"Let's think step by step."

MultiArith accuracy: 17.7% → 78.7%.
Zero examples. Zero fine-tuning. One sentence.

What that tells you: you're not teaching the model to reason by showing it examples. You're unlocking reasoning that's already latent in a large enough model — just by signaling that reasoning is expected.

The practical version for anything you're doing today:

"Think through this step by step before giving me your final answer. Walk me through the reasoning, then give me the recommendation."

That's it.

Standard prompting only gets you the answer.
Chain-of-thought gets you the work behind it.

→ Swipe through for the full breakdown.

#OnePercent #AI #Prompting #ChainOfThought #LLM`,
  sources: [
    {
      label: "Wei, J. et al. — Chain-of-Thought Prompting Elicits Reasoning in Large Language Models, NeurIPS 2022",
      detail:
        "Foundational CoT paper. Tested on 3 LLMs across arithmetic, commonsense, and symbolic reasoning. CoT is emergent above ~100B parameters; smaller models produce fluent but illogical chains.",
      url: "https://arxiv.org/abs/2201.11903",
    },
    {
      label: "Kojima, T. et al. — Large Language Models are Zero-Shot Reasoners, NeurIPS 2022",
      detail:
        'Zero-shot CoT: single phrase "Let\'s think step by step" boosts MultiArith from 17.7% to 78.7% accuracy with InstructGPT (175B). No examples required.',
      url: "https://arxiv.org/abs/2205.11916",
    },
    {
      label: 'Wei, J. — "Language Models Perform Reasoning via Chain of Thought," Google Research Blog, 2022',
      detail:
        "Official Google Research explainer on the Wei et al. NeurIPS findings, covering the emergent nature of CoT and the scale requirement.",
      url: "https://research.google/blog/language-models-perform-reasoning-via-chain-of-thought/",
    },
  ],
};

// ─── STYLES ─────────────────────────────────────────────────────────────────

const S = {
  root: {
    background: "#0A0A0A",
    minHeight: "100vh",
    fontFamily: "'DM Mono', monospace",
    color: "#fff",
    padding: "0 0 60px",
  },
  inner: {
    maxWidth: 680,
    margin: "0 auto",
    padding: "0 16px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 0 8px",
    borderBottom: "1px solid #111",
  },
  logo: {
    fontSize: 11,
    letterSpacing: "0.2em",
    color: "#fff",
    fontWeight: 700,
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  entryBadge: {
    fontSize: 9,
    letterSpacing: "0.15em",
    color: "#333",
    border: "1px solid #222",
    padding: "3px 7px",
    borderRadius: 3,
  },
  streakBox: {
    fontSize: 10,
    color: ACCENT,
    letterSpacing: "0.1em",
    border: `1px solid ${ACCENT_BORDER}`,
    padding: "3px 8px",
    borderRadius: 3,
  },
  catBadge: {
    fontSize: 9,
    letterSpacing: "0.15em",
    background: ACCENT,
    color: "#0A0A0A",
    padding: "3px 8px",
    borderRadius: 3,
    fontWeight: 700,
  },
  datebar: {
    padding: "8px 0 0",
    fontSize: 10,
    color: "#333",
    letterSpacing: "0.08em",
  },
  conceptBlock: {
    padding: "32px 0 0",
  },
  conceptTitle: {
    fontSize: 36,
    fontWeight: 700,
    letterSpacing: "-0.02em",
    lineHeight: 1.1,
    marginBottom: 10,
  },
  accentRule: {
    width: 48,
    height: 3,
    background: ACCENT,
    borderRadius: 2,
    marginBottom: 28,
  },
  tabs: {
    display: "flex",
    gap: 0,
    marginBottom: 28,
    borderBottom: "1px solid #111",
  },
  tab: (active) => ({
    fontSize: 10,
    letterSpacing: "0.12em",
    padding: "10px 14px",
    cursor: "pointer",
    color: active ? ACCENT : "#333",
    borderBottom: active ? `2px solid ${ACCENT}` : "2px solid transparent",
    background: "none",
    border: "none",
    borderBottom: active ? `2px solid ${ACCENT}` : "2px solid transparent",
    fontFamily: "'DM Mono', monospace",
    transition: "color 0.2s",
    whiteSpace: "nowrap",
  }),
  fadeWrap: (visible) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(6px)",
    transition: "opacity 0.28s ease, transform 0.28s ease",
  }),
  sectionLabel: {
    fontSize: 10,
    letterSpacing: "0.15em",
    color: "#333",
    marginBottom: 10,
  },
  hook: {
    fontSize: 18,
    color: "#fff",
    letterSpacing: "-0.01em",
    lineHeight: 1.45,
    marginBottom: 20,
    fontWeight: 500,
  },
  body: {
    fontSize: 13,
    color: "#888",
    lineHeight: 1.7,
    marginBottom: 20,
  },
  whyBox: {
    background: ACCENT_DIM,
    border: `1px solid ${ACCENT_BORDER}`,
    borderRadius: 6,
    padding: "12px 16px",
    fontSize: 12,
    color: "#aaa",
    lineHeight: 1.6,
    marginBottom: 16,
  },
  challengeBox: {
    background: ACCENT_DIM,
    border: `1px solid ${ACCENT_BORDER}`,
    borderRadius: 6,
    padding: "16px",
    fontSize: 12,
    color: "#ccc",
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
  },
  reframeBlock: {
    borderLeft: `3px solid ${ACCENT}`,
    paddingLeft: 16,
    marginBottom: 24,
    fontSize: 15,
    color: "#ddd",
    lineHeight: 1.55,
    letterSpacing: "-0.01em",
  },
  wildLabel: {
    fontSize: 10,
    letterSpacing: "0.15em",
    color: "#333",
    marginBottom: 10,
    marginTop: 24,
  },
  wildText: {
    fontSize: 13,
    color: "#888",
    lineHeight: 1.7,
    marginBottom: 24,
  },
  quoteBlock: {
    border: `1px solid ${ACCENT_BORDER}`,
    borderRadius: 6,
    padding: "14px 16px",
    marginBottom: 16,
  },
  quoteText: {
    fontSize: 13,
    color: "#bbb",
    lineHeight: 1.6,
    fontStyle: "italic",
    marginBottom: 6,
  },
  quoteAttr: {
    fontSize: 10,
    color: "#444",
    letterSpacing: "0.06em",
  },
  nudgeBox: {
    background: "#0f0f0f",
    border: "1px solid #1a1a1a",
    borderRadius: 6,
    padding: "12px 16px",
    fontSize: 12,
    color: "#777",
    lineHeight: 1.6,
    fontStyle: "italic",
  },
  quizQ: {
    fontSize: 14,
    color: "#ddd",
    lineHeight: 1.55,
    marginBottom: 16,
    letterSpacing: "-0.01em",
  },
  quizOpts: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginBottom: 16,
  },
  quizOpt: (sel, correct, wrong, submitted) => ({
    background: submitted && correct ? "#0d2a1a" : submitted && wrong ? "#2a0d0d" : sel ? ACCENT_DIM : "#111",
    border: `1px solid ${submitted && correct ? "#2a7a4a" : submitted && wrong ? "#7a2a2a" : sel ? ACCENT : "#222"}`,
    borderRadius: 6,
    padding: "10px 14px",
    fontSize: 12,
    color: submitted && correct ? "#5adc8a" : submitted && wrong ? "#dc5a5a" : sel ? "#fff" : "#555",
    cursor: submitted ? "default" : "pointer",
    textAlign: "left",
    fontFamily: "'DM Mono', monospace",
    lineHeight: 1.5,
    transition: "all 0.15s",
  }),
  submitBtn: {
    background: ACCENT,
    color: "#0A0A0A",
    border: "none",
    borderRadius: 6,
    padding: "10px 24px",
    fontSize: 11,
    letterSpacing: "0.12em",
    fontFamily: "'DM Mono', monospace",
    fontWeight: 700,
    cursor: "pointer",
    marginBottom: 16,
  },
  scoreBox: (score) => ({
    border: `1px solid ${ACCENT_BORDER}`,
    borderRadius: 6,
    padding: "16px",
    textAlign: "center",
    marginBottom: 16,
    background: ACCENT_DIM,
  }),
  scoreNum: {
    fontSize: 32,
    fontWeight: 700,
    color: ACCENT,
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 11,
    letterSpacing: "0.15em",
    color: "#555",
  },
  explanationText: {
    fontSize: 11,
    color: "#444",
    lineHeight: 1.55,
    marginTop: 6,
    fontStyle: "italic",
  },
  closingLine: {
    fontSize: 13,
    color: "#aaa",
    lineHeight: 1.6,
    marginTop: 16,
    borderTop: "1px solid #111",
    paddingTop: 16,
  },
  postLabel: {
    fontSize: 9,
    letterSpacing: "0.2em",
    color: ACCENT,
    marginBottom: 10,
    fontWeight: 700,
  },
  postBox: {
    background: "#0f0f0f",
    border: "1px solid #1a1a1a",
    borderRadius: 6,
    padding: "16px",
    fontSize: 12,
    color: "#888",
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
    marginBottom: 12,
  },
  copyBtn: {
    background: ACCENT,
    color: "#0A0A0A",
    border: "none",
    borderRadius: 6,
    padding: "10px 20px",
    fontSize: 11,
    letterSpacing: "0.12em",
    fontFamily: "'DM Mono', monospace",
    fontWeight: 700,
    cursor: "pointer",
  },
  sourcesToggle: {
    fontSize: 10,
    letterSpacing: "0.12em",
    color: "#333",
    cursor: "pointer",
    background: "none",
    border: "none",
    fontFamily: "'DM Mono', monospace",
    padding: "8px 0",
    display: "block",
  },
  sourceItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottom: "1px solid #111",
  },
  sourceLink: {
    fontSize: 11,
    color: ACCENT,
    textDecoration: "none",
    lineHeight: 1.5,
    display: "block",
    marginBottom: 4,
  },
  sourceDetail: {
    fontSize: 11,
    color: "#444",
    lineHeight: 1.5,
  },
  verifiedBadge: {
    fontSize: 10,
    color: "#2a7a4a",
    letterSpacing: "0.1em",
    marginTop: 8,
  },
};

// ─── STREAK LOGIC ────────────────────────────────────────────────────────────

function getStreak() {
  try {
    const last = localStorage.getItem("op_last");
    const streak = parseInt(localStorage.getItem("op_streak") || "0", 10);
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (last === today) return streak;
    if (last === yesterday) {
      const next = streak + 1;
      localStorage.setItem("op_streak", String(next));
      localStorage.setItem("op_last", today);
      return next;
    }
    localStorage.setItem("op_streak", "1");
    localStorage.setItem("op_last", today);
    return 1;
  } catch {
    return 1;
  }
}

// ─── QUIZ SUB-COMPONENT ──────────────────────────────────────────────────────

function Quiz() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = data.quiz.every((_, i) => answers[i] !== undefined);
  const score = submitted
    ? data.quiz.filter((q, i) => answers[i] === q.correct).length
    : null;
  const scoreLabel =
    score === 3 ? "LOCKED IN" : score === 2 ? "ALMOST THERE" : "REVIEW TOMORROW";

  function handleAnswer(qi, ai) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qi]: ai }));
  }

  function handleSubmit() {
    if (!allAnswered) return;
    setSubmitted(true);
  }

  return (
    <div>
      <div style={S.sectionLabel}>🔥 BURN IT IN</div>
      {data.quiz.map((q, qi) => (
        <div key={qi} style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, color: ACCENT, letterSpacing: "0.15em", marginBottom: 8 }}>
            Q{qi + 1}
          </div>
          <div style={S.quizQ}>{q.question}</div>
          <div style={S.quizOpts}>
            {q.options.map((opt, ai) => (
              <button
                key={ai}
                style={S.quizOpt(
                  answers[qi] === ai,
                  submitted && ai === q.correct,
                  submitted && answers[qi] === ai && ai !== q.correct,
                  submitted
                )}
                onClick={() => handleAnswer(qi, ai)}
              >
                <span style={{ color: "#444", marginRight: 8 }}>{["A", "B", "C", "D"][ai]}.</span>
                {opt}
              </button>
            ))}
          </div>
          {submitted && (
            <div style={S.explanationText}>{q.explanation}</div>
          )}
        </div>
      ))}
      {!submitted && (
        <button
          style={{ ...S.submitBtn, opacity: allAnswered ? 1 : 0.35, cursor: allAnswered ? "pointer" : "not-allowed" }}
          onClick={handleSubmit}
        >
          SUBMIT
        </button>
      )}
      {submitted && (
        <>
          <div style={S.scoreBox(score)}>
            <div style={S.scoreNum}>{score}/3</div>
            <div style={S.scoreLabel}>{scoreLabel}</div>
          </div>
          <div style={S.closingLine}>{data.closing_line}</div>
        </>
      )}
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function OnePercent() {
  const [tab, setTab] = useState(0);
  const [visible, setVisible] = useState(true);
  const [streak] = useState(getStreak);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const tabs = ["🌱 MORNING", "👁 MIDDAY", "🔥 EVENING", "📋 POST"];

  function switchTab(i) {
    setVisible(false);
    setTimeout(() => {
      setTab(i);
      setVisible(true);
    }, 140);
  }

  function copyPost() {
    navigator.clipboard.writeText(data.post).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap"
        rel="stylesheet"
      />
      <div style={S.root}>
        <div style={S.inner}>
          {/* HEADER */}
          <div style={S.header}>
            <div style={S.logo}>ONE PERCENT</div>
            <div style={S.headerRight}>
              <div style={S.entryBadge}>#{data.entry}</div>
              <div style={S.streakBox}>🔥 {streak}d</div>
              <div style={S.catBadge}>{data.categoryTag}</div>
            </div>
          </div>

          {/* DATEBAR */}
          <div style={S.datebar}>
            <span>{data.date}</span>
            <span style={{ color: "#1e1e1e", margin: "0 6px" }}>·</span>
            <span style={{ color: ACCENT, opacity: 0.7 }}>{data.category}</span>
            <span style={{ color: "#1e1e1e", margin: "0 6px" }}>·</span>
            <span style={{ color: "#444" }}>{data.concept}</span>
          </div>

          {/* CONCEPT TITLE */}
          <div style={S.conceptBlock}>
            <div style={S.conceptTitle}>{data.concept}</div>
            <div style={S.accentRule} />
          </div>

          {/* TABS */}
          <div style={S.tabs}>
            {tabs.map((t, i) => (
              <button key={i} style={S.tab(tab === i)} onClick={() => switchTab(i)}>
                {t}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div style={S.fadeWrap(visible)}>
            {/* ── MORNING ── */}
            {tab === 0 && (
              <div>
                <div style={S.sectionLabel}>🌱 PLANT THE SEED</div>
                <div style={S.hook}>{data.morning.hook}</div>
                <div style={S.body}>{data.morning.explanation}</div>
                <div style={S.sectionLabel}>WHY NOW</div>
                <div style={S.whyBox}>{data.morning.why_today}</div>
                <div style={S.sectionLabel}>⚡ MORNING CHALLENGE</div>
                <div style={S.challengeBox}>{data.morning.morning_challenge}</div>
              </div>
            )}

            {/* ── MIDDAY ── */}
            {tab === 1 && (
              <div>
                <div style={S.sectionLabel}>👁 SEE IT DIFFERENTLY</div>
                <div style={S.reframeBlock}>{data.midday.reframe}</div>
                <div style={S.wildLabel}>IN THE WILD</div>
                <div style={S.wildText}>{data.midday.real_world}</div>
                <div style={S.quoteBlock}>
                  <div style={S.quoteText}>"{data.midday.quote}"</div>
                  <div style={S.quoteAttr}>— {data.midday.attribution}</div>
                </div>
                <div style={S.sectionLabel}>MIDDAY NUDGE</div>
                <div style={S.nudgeBox}>{data.midday.midday_nudge}</div>
              </div>
            )}

            {/* ── EVENING ── */}
            {tab === 2 && (
              <div>
                <Quiz />
              </div>
            )}

            {/* ── POST ── */}
            {tab === 3 && (
              <div>
                <div style={S.postLabel}>READY TO POST</div>
                <div style={S.postBox}>{data.post}</div>
                <button style={S.copyBtn} onClick={copyPost}>
                  {copied ? "COPIED ✓" : "COPY POST"}
                </button>
              </div>
            )}
          </div>

          {/* SOURCES */}
          <div style={{ marginTop: 40, borderTop: "1px solid #111", paddingTop: 16 }}>
            <button style={S.sourcesToggle} onClick={() => setSourcesOpen(!sourcesOpen)}>
              {sourcesOpen ? "▲" : "▼"} SOURCES
            </button>
            {sourcesOpen && (
              <div style={{ marginTop: 12 }}>
                {data.sources.map((s, i) => (
                  <div key={i} style={S.sourceItem}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" style={S.sourceLink}>
                      {s.label}
                    </a>
                    <div style={S.sourceDetail}>{s.detail}</div>
                  </div>
                ))}
                <div style={S.verifiedBadge}>✓ ALL SOURCES VERIFIED</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
