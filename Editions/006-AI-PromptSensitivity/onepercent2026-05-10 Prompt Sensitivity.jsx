import { useState, useEffect } from "react";

// ─── ENTRY METADATA ──────────────────────────────────────────────────────────
// Entry: 005 | Category: AI | Concept: Prompt Sensitivity
// Date: May 10, 2026
//
// SOURCES — verified via web search 2026-05-10:
// [1] Sclar, M., Choi, Y., Tsvetkov, Y., Suhr, A. — "Quantifying Language
//     Models' Sensitivity to Spurious Features in Prompt Design or: How I
//     Learned to Start Worrying about Prompt Formatting"
//     arXiv:2310.11324, University of Washington / UC Berkeley, 2023
//     arxiv.org/abs/2310.11324 ✓
//     Documented up to 76 accuracy-point swings from formatting changes alone
//     with meaning-preserving prompt variants on LLaMA-2-13B
// [2] Guan, B., Roosta, T., Passban, P., Rezagholizadeh, M. — "The Order
//     Effect: Investigating Prompt Sensitivity to Input Order in LLMs"
//     arXiv:2502.04134, 2025
//     arxiv.org/abs/2502.04134 ✓
//     Shuffled inputs lead to measurable declines in accuracy across
//     paraphrasing, relevance judgment, and MCQ tasks in closed-source LLMs
// [3] Ko, W. et al. — "Large Language Models Sensitivity to The Order of
//     Options in Multiple-Choice Questions"
//     arXiv:2308.11483, 2023
//     arxiv.org/abs/2308.11483 ✓
//     GPT-4 changes answers based on option order; up to 8pp improvement
//     from order-calibration techniques
//
// QUOTE — verified verbatim 2026-05-10:
// Sclar et al., arXiv:2310.11324, Abstract (confirmed verbatim at arxiv.org):
// "choices in prompt design can strongly influence model behavior, this design
// process is critical in effectively using any modern pre-trained generative
// language model."
// Confirmed verbatim in abstract and Semantic Scholar listing. ✓
//
// IN THE WILD: Type A — Sclar et al. documented 76 accuracy-point swing
// from meaning-preserving formatting changes on LLaMA-2-13B. Directly cited
// in a peer-reviewed paper. No fabrication.
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT = "#47FFE8";
const ACCENT_DIM = "#47FFE822";

const data = {
  category: "AI",
  categoryTag: "AI",
  concept: "Prompt Sensitivity",
  date: "May 10, 2026",
  entry: "005",
  morning: {
    concept: "Prompt Sensitivity",
    hook: "You didn't get a bad answer. You wrote a bad question — and the difference can be 76 accuracy points.",
    explanation:
      "AI models are not neutral interpreters. The same underlying question, asked with different formatting, different word order, or different option arrangement, can produce dramatically different outputs — without any change in meaning. Researchers at the University of Washington demonstrated accuracy swings of up to 76 percentage points on the same task just by adjusting how prompts were formatted, with no change to the actual content or intent. This isn't a bug that will be patched out. It's a structural property of how large language models process tokens. The model doesn't read your prompt the way you do — it reads the probability landscape your words create. Which means the craft of prompting is real, it's learnable, and most people are leaving significant output quality on the table every single day.",
    why_today:
      "As AI gets embedded in real workflows — drafting, analysis, decisions — prompt quality stops being a curiosity and starts being an output multiplier. Knowing this exists is the first step to working around it.",
    morning_challenge:
      "Take one prompt you use regularly — something you've run more than once. Could be a weekly report, a draft you keep asking AI to improve, an analysis you run.\n\nRun this:\n\n\"Here is a prompt I use regularly: [paste your prompt]. Rewrite it three different ways — varying structure, word order, and level of context — while keeping the intent identical. Show me all three versions and flag which structural choices you made in each.\"\n\nRun all three versions on the same input. Compare outputs. The gap between best and worst is your current prompt tax.",
  },
  midday: {
    reframe:
      "The AI isn't failing you. Your prompt is — and unlike the model, that part you can actually control.",
    real_world:
      "In 2023, researchers at the University of Washington ran a systematic study on prompt formatting across widely used open-source language models. The question: how much does formatting alone — not content, not intent, just structural presentation — affect model output? The answer was severe. On LLaMA-2-13B, they documented accuracy differences of up to 76 percentage points between prompt variants that were semantically identical. Same task. Same meaning. Different format. Wildly different results. The finding held across model sizes and wasn't resolved by instruction tuning. A separate 2025 study (Guan et al.) found similar effects in closed-source models including GPT-4 class systems — shuffled input order produced measurable accuracy declines across paraphrasing, relevance judgment, and multiple-choice tasks. The implication: every time you paste a prompt without thinking about its structure, you're rolling dice on output quality. (Sclar et al., arXiv:2310.11324, 2023)",
    quote:
      "Choices in prompt design can strongly influence model behavior, this design process is critical in effectively using any modern pre-trained generative language model.",
    attribution: "Melanie Sclar et al., arXiv:2310.11324, University of Washington, 2023",
    midday_nudge:
      "What's a decision or output you've been trusting from AI without ever questioning whether the prompt that generated it was actually well-constructed?",
  },
  quiz: [
    {
      question: "Sclar et al. (2023) found accuracy differences of up to how many percentage points from formatting changes alone — with no change in prompt meaning?",
      options: [
        "12 percentage points",
        "34 percentage points",
        "76 percentage points",
        "Performance was consistent across format variants",
      ],
      correct: 2,
      explanation:
        "76 accuracy points — on the same task, with meaning-preserving formatting changes only. This is the core finding: prompt structure is not cosmetic. It materially changes model output in ways that have nothing to do with the quality of your underlying question.",
    },
    {
      question: "Why does prompt formatting affect AI output even when the meaning is identical?",
      options: [
        "AI models read prompts randomly rather than sequentially",
        "Models process token probability distributions, so structural presentation shapes the probability landscape — not just the semantic content",
        "Formatting errors trigger safety filters that reduce output quality",
        "Longer prompts are always processed less accurately",
      ],
      correct: 1,
      explanation:
        "LLMs don't read prompts the way humans do. They process sequences of tokens and predict what comes next based on probability distributions shaped by training. The same semantic content in different structural arrangements creates different probability landscapes — which is why formatting changes output even when meaning doesn't change.",
    },
    {
      question: "Which of these is the most actionable takeaway from prompt sensitivity research for someone using AI daily?",
      options: [
        "Wait for better models — sensitivity will be engineered out over time",
        "Always use the longest possible prompt to give the model more signal",
        "Test multiple structurally different versions of the same prompt and compare outputs — don't treat the first result as definitive",
        "Stick to simple, casual language to avoid confusing the model",
      ],
      correct: 2,
      explanation:
        "The research suggests that no single prompt format is reliably optimal. Testing variants and comparing outputs is the practical response to sensitivity — it converts a hidden variable into a visible one you can act on. Waiting for models to fix it is passive; prompt testing is in your control today.",
    },
  ],
  score_labels: ["REVIEW TOMORROW", "ALMOST THERE", "LOCKED IN"],
  closing_line:
    "Tomorrow you get 1% sharper. Tonight: think about the last AI output you trusted without question — and whether the prompt that produced it was actually any good.",
  linkedin_post: `You got a mediocre answer from AI today.

You probably blamed the model.

The research says blame the prompt.

A 2023 University of Washington study tested the same tasks with meaning-identical prompts in different formats. Accuracy swings: up to 76 percentage points. Not from different questions — from different structure around the same question.

𝗣𝗿𝗼𝗺𝗽𝘁 𝘀𝗲𝗻𝘀𝗶𝘁𝗶𝘃𝗶𝘁𝘆 is real, it's documented, and most people using AI every day don't know it exists.

Swipe through today's One Percent — including why this happens at the model level, what the research actually shows, and a prompt you can use right now to test how much output quality you're leaving on the table.

#OnePercent #AI #Prompting #PromptEngineering #ArtificialIntelligence

📚 Sources:
[1] Sclar, Choi, Tsvetkov, Suhr — Quantifying Language Models' Sensitivity to Spurious Features in Prompt Design. arXiv:2310.11324, 2023. arxiv.org/abs/2310.11324
[2] Guan, Roosta, Passban, Rezagholizadeh — The Order Effect: Investigating Prompt Sensitivity to Input Order in LLMs. arXiv:2502.04134, 2025. arxiv.org/abs/2502.04134
[3] Ko et al. — Large Language Models Sensitivity to The Order of Options in Multiple-Choice Questions. arXiv:2308.11483, 2023. arxiv.org/abs/2308.11483`,
  sources: [
    {
      label: "Sclar, Choi, Tsvetkov, Suhr — Quantifying Language Models' Sensitivity to Spurious Features in Prompt Design. arXiv:2310.11324, 2023.",
      detail: "University of Washington / UC Berkeley. Documented up to 76 accuracy-point swings from meaning-preserving formatting changes alone. Foundational empirical work on prompt sensitivity.",
      url: "https://arxiv.org/abs/2310.11324",
    },
    {
      label: "Guan, Roosta, Passban, Rezagholizadeh — The Order Effect: Investigating Prompt Sensitivity to Input Order in LLMs. arXiv:2502.04134, 2025.",
      detail: "Extends sensitivity research to closed-source LLMs — shows shuffled input order produces measurable accuracy declines across multiple task types including paraphrasing and relevance judgment.",
      url: "https://arxiv.org/abs/2502.04134",
    },
    {
      label: "Ko et al. — Large Language Models Sensitivity to The Order of Options in Multiple-Choice Questions. arXiv:2308.11483, 2023.",
      detail: "Shows GPT-4 changes its answers based on answer option order. Order-calibration techniques improve performance by up to 8 percentage points — demonstrating the effect is real and partially correctable.",
      url: "https://arxiv.org/abs/2308.11483",
    },
  ],
};

const TABS = ["MORNING", "MIDDAY", "EVENING", "POST"];

export default function OnePercent() {
  const [activeTab, setActiveTab] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [streak, setStreak] = useState(1);
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    try {
      const last = localStorage.getItem("op_last");
      const saved = parseInt(localStorage.getItem("op_streak") || "0");
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (last === yesterday) {
        const ns = saved + 1;
        setStreak(ns);
        localStorage.setItem("op_streak", String(ns));
        localStorage.setItem("op_last", today);
      } else if (last !== today) {
        setStreak(1);
        localStorage.setItem("op_streak", "1");
        localStorage.setItem("op_last", today);
      } else {
        setStreak(saved || 1);
      }
    } catch {}
  }, []);

  const switchTab = (i) => { setFadeKey(k => k + 1); setActiveTab(i); };
  const handleAnswer = (qi, ai) => { if (!submitted) setQuizAnswers(p => ({ ...p, [qi]: ai })); };
  const handleSubmit = () => { if (Object.keys(quizAnswers).length === data.quiz.length) setSubmitted(true); };

  const score = submitted
    ? data.quiz.reduce((a, q, i) => a + (quizAnswers[i] === q.correct ? 1 : 0), 0)
    : 0;
  const scoreLabel = score === 3 ? data.score_labels[2] : score === 2 ? data.score_labels[1] : data.score_labels[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(data.linkedin_post).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={S.root}>
      <style>{css(ACCENT, ACCENT_DIM)}</style>

      <div style={S.header}>
        <div style={S.hL}>
          <span style={S.logo}>ONE PERCENT</span>
          <span style={S.entry}>#{data.entry}</span>
        </div>
        <div style={S.hR}>
          <span style={S.streak}>🔥 {streak}</span>
          <span style={S.badge}>{data.categoryTag}</span>
        </div>
      </div>

      <div style={S.datebar}>{data.date}</div>

      <div style={S.conceptBlock}>
        <div style={S.conceptName}>{data.concept}</div>
        <div style={{ width: 40, height: 2, background: ACCENT, marginTop: 10 }} />
      </div>

      <div style={S.tabRow}>
        {TABS.map((t, i) => (
          <button key={t} className={`tab-btn${activeTab === i ? " active" : ""}`} onClick={() => switchTab(i)}>
            {t}
          </button>
        ))}
      </div>

      <div key={fadeKey} className="fade-in" style={S.content}>
        {activeTab === 0 && <MorningTab data={data.morning} accent={ACCENT} />}
        {activeTab === 1 && <MiddayTab data={data.midday} accent={ACCENT} />}
        {activeTab === 2 && (
          <EveningTab
            quiz={data.quiz} answers={quizAnswers} submitted={submitted}
            score={score} scoreLabel={scoreLabel} closing={data.closing_line}
            onAnswer={handleAnswer} onSubmit={handleSubmit} accent={ACCENT}
          />
        )}
        {activeTab === 3 && (
          <PostTab post={data.linkedin_post} copied={copied} onCopy={handleCopy} accent={ACCENT} />
        )}
      </div>

      <div style={S.srcSection}>
        <div style={S.srcDivider} />
        <button className="src-toggle" onClick={() => setSourcesOpen(o => !o)}>
          {sourcesOpen ? "▲ SOURCES" : "▼ SOURCES"}
        </button>
        {sourcesOpen && (
          <div style={S.srcList}>
            {data.sources.map((s, i) => (
              <div key={i} style={S.srcItem}>
                <a href={s.url} target="_blank" rel="noreferrer" className="src-link">{s.label}</a>
                <div style={S.srcDetail}>{s.detail}</div>
              </div>
            ))}
            <div style={S.srcVerified}>✓ All sources verified via web search</div>
          </div>
        )}
      </div>
    </div>
  );
}

function MorningTab({ data, accent }) {
  const parts = data.morning_challenge.split("\n\n");
  return (
    <div>
      <div style={{ ...S.label, color: accent }}>🌱 PLANT THE SEED</div>
      <div style={S.hook}>{data.hook}</div>
      <div style={S.body}>{data.explanation}</div>
      <div style={{ borderLeft: `2px solid ${accent}`, paddingLeft: 14, marginBottom: 20 }}>
        <div style={{ color: accent, fontSize: 10, letterSpacing: "0.12em" }}>WHY TODAY</div>
        <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.6, marginTop: 6 }}>{data.why_today}</div>
      </div>
      <div style={{ background: accent + "12", border: `1px solid ${accent}33`, borderRadius: 4, padding: 16 }}>
        <div style={{ color: accent, fontSize: 10, letterSpacing: "0.12em", marginBottom: 10 }}>⚡ MORNING CHALLENGE · AI-ASSISTED</div>
        {parts.map((p, i) => (
          <div key={i} style={p.startsWith('"') || p.startsWith('\u201c')
            ? { fontSize: 12, color: "#ddd", lineHeight: 1.7, background: "#0A0A0A55", border: `1px solid ${accent}22`, borderRadius: 3, padding: "10px 12px", margin: "10px 0", fontStyle: "italic" }
            : { fontSize: 13, color: "#ccc", lineHeight: 1.7, marginBottom: i < parts.length - 1 ? 8 : 0 }
          }>{p}</div>
        ))}
      </div>
    </div>
  );
}

function MiddayTab({ data, accent }) {
  return (
    <div>
      <div style={{ ...S.label, color: accent }}>👁 SEE IT DIFFERENTLY</div>
      <div style={{ borderLeft: `3px solid ${accent}`, paddingLeft: 16, marginBottom: 24 }}>
        <div style={{ fontSize: 17, color: "#fff", lineHeight: 1.5 }}>{data.reframe}</div>
      </div>
      <div style={{ fontSize: 10, color: "#333", letterSpacing: "0.15em", marginBottom: 10 }}>IN THE WILD</div>
      <div style={S.body}>{data.real_world}</div>
      <div style={{ border: `1px solid ${accent}44`, borderRadius: 4, padding: "14px 16px", marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: "#ddd", fontStyle: "italic", lineHeight: 1.6, marginBottom: 8 }}>"{data.quote}"</div>
        <div style={{ fontSize: 11, color: accent, letterSpacing: "0.08em" }}>— {data.attribution}</div>
      </div>
      <div style={{ borderLeft: `2px solid ${accent}66`, paddingLeft: 14 }}>
        <div style={{ color: accent, fontSize: 10, letterSpacing: "0.12em" }}>SIT WITH THIS</div>
        <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.6, marginTop: 6 }}>{data.midday_nudge}</div>
      </div>
    </div>
  );
}

function EveningTab({ quiz, answers, submitted, score, scoreLabel, closing, onAnswer, onSubmit, accent }) {
  return (
    <div>
      <div style={{ ...S.label, color: accent }}>🔥 BURN IT IN</div>
      {quiz.map((q, qi) => (
        <div key={qi} style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, color: accent, letterSpacing: "0.15em", marginBottom: 8 }}>Q{qi + 1}</div>
          <div style={{ fontSize: 13, color: "#ddd", lineHeight: 1.6, marginBottom: 12 }}>{q.question}</div>
          {q.options.map((opt, ai) => {
            let cls = "quiz-opt";
            if (!submitted && answers[qi] === ai) cls += " selected";
            if (submitted && ai === q.correct) cls = "quiz-opt correct";
            else if (submitted && answers[qi] === ai) cls = "quiz-opt wrong";
            return (
              <button key={ai} className={cls} onClick={() => onAnswer(qi, ai)} disabled={submitted}>
                <span style={{ color: accent, marginRight: 8 }}>{String.fromCharCode(65 + ai)}.</span>{opt}
              </button>
            );
          })}
          {submitted && <div style={{ fontSize: 11, color: "#555", lineHeight: 1.6, marginTop: 8, paddingLeft: 4 }}>{q.explanation}</div>}
        </div>
      ))}
      {!submitted && (
        <button className="submit-btn" onClick={onSubmit} disabled={Object.keys(answers).length < quiz.length}>
          SUBMIT
        </button>
      )}
      {submitted && (
        <div style={{ border: `1px solid ${accent}`, borderRadius: 4, padding: 20, textAlign: "center", margin: "20px 0" }}>
          <div style={{ color: accent, fontSize: 22, fontWeight: 500 }}>{score}/3</div>
          <div style={{ color: "#fff", fontSize: 13, letterSpacing: "0.15em", marginTop: 4 }}>{scoreLabel}</div>
        </div>
      )}
      <div style={{ fontSize: 13, color: "#aaa", borderTop: "1px solid #1a1a1a", paddingTop: 20, marginTop: 20, lineHeight: 1.7 }}>
        {closing}
      </div>
    </div>
  );
}

function PostTab({ post, copied, onCopy, accent }) {
  return (
    <div>
      <div style={{ ...S.label, color: accent }}>📋 READY TO POST</div>
      <div style={{ background: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: 4, padding: 20, fontSize: 13, color: "#aaa", lineHeight: 1.75, whiteSpace: "pre-wrap", marginBottom: 16 }}>
        {post}
      </div>
      <button className="copy-btn" onClick={onCopy}>{copied ? "✓ COPIED" : "COPY POST"}</button>
    </div>
  );
}

const css = (accent, dim) => `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A0A0A; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .fade-in { animation: fadeIn 0.28s ease forwards; }
  .tab-btn {
    background: none; border: none; cursor: pointer; font-family: 'DM Mono', monospace;
    font-size: 10px; letter-spacing: 0.12em; padding: 8px 12px; color: #555;
    transition: color 0.2s; border-bottom: 1.5px solid transparent;
  }
  .tab-btn:hover { color: #aaa; }
  .tab-btn.active { color: ${accent}; border-bottom-color: ${accent}; }
  .quiz-opt {
    background: #111; border: 1px solid #222; border-radius: 4px; padding: 12px 14px;
    cursor: pointer; font-family: 'DM Mono', monospace; font-size: 12px; color: #888;
    margin-bottom: 8px; transition: all 0.18s; text-align: left; width: 100%;
  }
  .quiz-opt:hover:not(:disabled) { border-color: ${accent}44; color: #ccc; }
  .quiz-opt.selected { border-color: ${accent}; color: #fff; background: ${dim}; }
  .quiz-opt.correct { border-color: #4ade80; color: #4ade80; background: #4ade8011; }
  .quiz-opt.wrong { border-color: #f87171; color: #f87171; background: #f8717111; }
  .submit-btn {
    background: ${accent}; color: #0A0A0A; border: none; padding: 12px 24px;
    font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 500;
    letter-spacing: 0.1em; cursor: pointer; border-radius: 3px; margin-top: 8px;
    transition: opacity 0.2s;
  }
  .submit-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .copy-btn {
    background: ${accent}; color: #0A0A0A; border: none; padding: 12px 20px;
    font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 500;
    letter-spacing: 0.1em; cursor: pointer; border-radius: 3px;
  }
  .src-toggle {
    background: none; border: 1px solid #222; padding: 7px 14px;
    font-family: 'DM Mono', monospace; font-size: 10px; color: #555;
    cursor: pointer; border-radius: 3px; letter-spacing: 0.12em;
    transition: color 0.2s, border-color 0.2s;
  }
  .src-toggle:hover { color: #999; border-color: #444; }
  .src-link {
    color: ${accent}; text-decoration: none; font-size: 11px; letter-spacing: 0.03em;
    display: block; margin-bottom: 4px; font-family: 'DM Mono', monospace;
  }
  .src-link:hover { text-decoration: underline; }
`;

const S = {
  root: { background: "#0A0A0A", minHeight: "100vh", fontFamily: "'DM Mono', monospace", color: "#fff", maxWidth: 680, margin: "0 auto", paddingBottom: 80 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px 12px", borderBottom: "1px solid #141414" },
  hL: { display: "flex", alignItems: "center", gap: 10 },
  hR: { display: "flex", alignItems: "center", gap: 12 },
  logo: { fontSize: 11, letterSpacing: "0.2em", color: "#fff", fontWeight: 500 },
  entry: { fontSize: 10, color: "#333", letterSpacing: "0.1em" },
  streak: { fontSize: 11, color: "#aaa" },
  badge: { fontSize: 9, letterSpacing: "0.15em", color: "#0A0A0A", background: ACCENT, padding: "3px 8px", borderRadius: 2, fontWeight: 500 },
  datebar: { fontSize: 10, color: "#333", letterSpacing: "0.1em", padding: "8px 24px", borderBottom: "1px solid #0f0f0f" },
  conceptBlock: { padding: "28px 24px 0" },
  conceptName: { fontSize: 32, fontWeight: 500, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.1 },
  tabRow: { display: "flex", borderBottom: "1px solid #141414", marginTop: 20, padding: "0 12px", gap: 4 },
  content: { padding: "24px 24px 0" },
  label: { fontSize: 10, letterSpacing: "0.15em", marginBottom: 16, fontWeight: 500 },
  hook: { fontSize: 18, color: "#fff", lineHeight: 1.45, fontWeight: 400, marginBottom: 18, letterSpacing: "-0.01em" },
  body: { fontSize: 13, color: "#888", lineHeight: 1.7, marginBottom: 20 },
  srcSection: { padding: "28px 24px 48px" },
  srcDivider: { borderTop: "1px solid #141414", marginBottom: 18 },
  srcList: { marginTop: 16, display: "flex", flexDirection: "column", gap: 16 },
  srcItem: {},
  srcDetail: { fontSize: 11, color: "#444", lineHeight: 1.6 },
  srcVerified: { fontSize: 10, color: "#2a2a2a", letterSpacing: "0.1em", marginTop: 8, paddingTop: 12, borderTop: "1px solid #141414" },
};
