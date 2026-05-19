import { useState, useEffect } from "react";

// ─── ENTRY METADATA ──────────────────────────────────────────────────────────
// Entry: 004 | Category: Mental Models | Concept: Inversion
// Date: May 9, 2026
//
// SOURCES — verified via web search 2026-05-09:
// [1] Munger, Poor Charlie's Almanack — ed. Peter Kaufman, Donning Company, 2005
//     (Stripe Press expanded ed. 2023)
//     amazon.com/Poor-Charlies-Almanack-Charles-Expanded/dp/1578645018 ✓
//     Primary source for Munger's inversion framework — "invert, always invert"
//     traced to Jacobi; Munger's application across investing, life decisions
// [2] Klein, G. — "Performing a Project Premortem"
//     Harvard Business Review, 85(9), pp. 18–19, September 2007
//     hbr.org/2007/09/performing-a-project-premortem ✓
//     Formalized inversion as a team decision tool (premortem method);
//     cites Mitchell et al. 1989 finding that prospective hindsight improves
//     risk identification by 30%
// [3] Mitchell, D.J., Russo, J.E., Pennington, N. — "Back to the Future:
//     Temporal Perspective in the Explanation of Events"
//     Journal of Behavioral Decision Making, 2(1), 25–38, 1989
//     doi.org/10.1002/bdm.3960020103 ✓
//     Original prospective hindsight research underpinning the premortem
//
// QUOTE — verified verbatim 2026-05-09:
// "All I want to know is where I'm going to die so I'll never go there."
// — Charlie Munger, Poor Charlie's Almanack (ed. Kaufman, 2005)
// Confirmed verbatim across Goodreads, fs.blog, mastersinvest.com, compoundingquality.net ✓
//
// IN THE WILD: Type A — Klein's HBR-documented premortem method, directly citing
// Mitchell et al. 1989. Documented real-world application in corporate/military contexts.
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT = "#C847FF";
const ACCENT_DIM = "#C847FF22";

const data = {
  category: "Mental Models",
  categoryTag: "MENTAL MODELS",
  concept: "Inversion",
  date: "May 9, 2026",
  entry: "004",
  morning: {
    concept: "Inversion",
    hook: "Stop asking how to succeed. Ask what would guarantee failure — then don't do those things.",
    explanation:
      "Inversion is the practice of approaching a problem backward. Instead of asking \"how do I achieve X?\", you ask \"what would make X impossible — or guarantee the opposite?\" Charlie Munger picked this up from the 19th-century mathematician Carl Jacobi, who famously counseled: invert, always invert. The logic is simple: forward thinking is optimistic and tends to miss the landmines. Backward thinking forces you to confront the specific ways things actually break. Most smart people can tell you what good looks like. Fewer can tell you, in granular detail, what disaster looks like. The ones who can — and who systematically avoid those conditions — build remarkably durable outcomes.",
    why_today:
      "In a world of endless advice on what to do, inversion is a cheat code: it shrinks the problem to a list of things to avoid, which turns out to be far more actionable than a list of things to pursue.",
    morning_challenge:
      "Pick one decision you're sitting on — a plan you're about to execute, a pitch you're about to make, a project you're about to greenlight.\n\nRun this prompt:\n\n\"I'm planning to [describe your plan or decision]. Invert this for me: describe in specific detail how this plan would most likely fail. What are the 5 most plausible paths to a bad outcome? Don't be optimistic. Be the skeptic in the room. After listing the failure modes, flag which ones I have any actual control over.\"\n\nTake the top two failure modes you have control over. Fix them before you move.",
  },
  midday: {
    reframe:
      "Wisdom isn't knowing how to win. It's knowing exactly where the floors are — and staying well above them.",
    real_world:
      "In 2007, psychologist Gary Klein published the premortem technique in Harvard Business Review — a direct application of inversion to project planning. Before a project launches, the team imagines it's a year later and the project has failed spectacularly. Then they ask: what went wrong? Klein's method draws on research by Mitchell, Russo, and Pennington (1989) showing that this kind of prospective hindsight — treating a future failure as already having occurred — improves the ability to identify the real reasons for failure by roughly 30% compared to conventional risk assessment. The key insight: humans are dramatically better at explaining a failure that has already happened than predicting one that might. Inversion borrows that cognitive advantage and applies it to the future. The technique has since been adopted in corporate boardrooms, military planning, and by major tech organizations as standard pre-launch protocol.",
    quote:
      "All I want to know is where I'm going to die so I'll never go there.",
    attribution: "Charlie Munger, Poor Charlie's Almanack, 2005",
    midday_nudge:
      "What's a current plan or commitment where you've been thinking almost entirely about the upside — and haven't seriously mapped the specific ways it could blow up?",
  },
  quiz: [
    {
      question: "What is the core move of inversion as a mental model?",
      options: [
        "Analyzing the best-case outcome of a decision before committing",
        "Identifying what you want, then listing the steps to get there",
        "Flipping the problem — asking what would cause failure instead of success",
        "Seeking a second opinion before acting",
      ],
      correct: 2,
      explanation:
        "Inversion means reasoning backward from failure rather than forward toward success. It's useful precisely because humans are better at explaining why something went wrong than predicting what will go right.",
    },
    {
      question: "According to research by Mitchell, Russo, and Pennington (1989), prospective hindsight — treating a future failure as already occurred — improves failure-mode identification by approximately:",
      options: [
        "10%",
        "30%",
        "50%",
        "There was no significant improvement",
      ],
      correct: 1,
      explanation:
        "Klein cites the Mitchell et al. finding in his HBR premortem article: prospective hindsight improves the ability to correctly identify reasons for future outcomes by 30% — which is the empirical basis for why the premortem works.",
    },
    {
      question: "Munger's inversion principle is most useful when applied to which type of situation?",
      options: [
        "Situations where you're optimizing a known process with clear feedback loops",
        "Situations with high uncertainty where forward planning tends toward overconfidence",
        "Situations where you're following a proven playbook with little original thinking required",
        "Situations where speed matters more than accuracy",
      ],
      correct: 1,
      explanation:
        "Inversion is most powerful under uncertainty, where optimism bias and planning fallacy distort forward thinking. When outcomes are unclear and stakes are high, asking what would guarantee failure reveals the landmines that enthusiasm tends to skip over.",
    },
  ],
  score_labels: ["REVIEW TOMORROW", "ALMOST THERE", "LOCKED IN"],
  closing_line:
    "Tomorrow you get 1% sharper. Tonight: name one thing you're currently not doing that, if you did it, would most reliably wreck something you care about.",
  linkedin_post: `Most frameworks tell you what to aim for.

This one tells you what to avoid — and that turns out to be more useful.

It's called 𝗜𝗻𝘃𝗲𝗿𝘀𝗶𝗼𝗻.

Charlie Munger built much of his decision-making around it. Gary Klein turned it into a documented planning technique adopted by corporations and the military. The underlying research shows it makes you 30% better at identifying how things actually go wrong.

The move: instead of asking how to succeed, ask what would guarantee failure — in specific, honest detail. Then don't do those things.

Swipe through today's One Percent for the full framework — including how to run it on any decision you're sitting on right now.

#OnePercent #MentalModels #DecisionMaking #Inversion #Thinking

📚 Sources:
[1] Munger / Kaufman — Poor Charlie's Almanack. Donning Company, 2005. amazon.com/Poor-Charlies-Almanack-Charles-Expanded/dp/1578645018
[2] Klein — Performing a Project Premortem. Harvard Business Review, 85(9), 2007. hbr.org/2007/09/performing-a-project-premortem
[3] Mitchell, Russo, Pennington — Back to the Future: Temporal Perspective in the Explanation of Events. Journal of Behavioral Decision Making, 2(1), 1989. doi.org/10.1002/bdm.3960020103`,
  sources: [
    {
      label: "Munger / Kaufman — Poor Charlie's Almanack. Donning Company, 2005.",
      detail: "Primary source for Munger's inversion framework — tracing Jacobi's maxim through investing, life decisions, and the practice of avoiding stupidity as a path to durable success.",
      url: "https://www.amazon.com/Poor-Charlies-Almanack-Charles-Expanded/dp/1578645018",
    },
    {
      label: "Klein — Performing a Project Premortem. Harvard Business Review, 85(9), 2007.",
      detail: "Formalizes inversion as a team planning tool — the premortem method. Documents real-world adoption in corporate and military contexts and cites the 30% improvement in failure-mode identification.",
      url: "https://hbr.org/2007/09/performing-a-project-premortem",
    },
    {
      label: "Mitchell, Russo, Pennington — Back to the Future. Journal of Behavioral Decision Making, 2(1), 1989.",
      detail: "The empirical basis for the premortem: prospective hindsight — imagining a future event has already occurred — improves identification of the reasons for that outcome by roughly 30%.",
      url: "https://doi.org/10.1002/bdm.3960020103",
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
  badge: { fontSize: 9, letterSpacing: "0.15em", color: "#fff", background: ACCENT, padding: "3px 8px", borderRadius: 2, fontWeight: 500 },
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
