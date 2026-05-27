import { useState, useEffect } from "react";

// ─── ENTRY METADATA ──────────────────────────────────────────────────────────
// Entry: 007 | Category: Sales Craft | Concept: Talk/Listen Ratio
// Date: May 11, 2026
//
// SOURCES — verified via web search 2026-05-11:
// [1] Orlob, C. — "The Highest Converting Talk-to-Listen Ratio in Sales"
//     Gong Labs, Gong.io, 2016 (updated March 20, 2025 by Dan Morgese)
//     gong.io/blog/talk-to-listen-conversion-ratio ✓
//     25,537 B2B sales calls analyzed. Top performers: 43% talk / 57% listen.
//     Average reps: ~70% talk / 30% listen.
// [2] Morgese, D. — "The Best Sales Insights of 2025"
//     Gong Labs, Gong.io, March 2025
//     gong.io/blog/the-best-sales-insights-of-2025 ✓
//     2025 update: biggest differentiator is not the ratio itself but consistency.
//     High performers maintain the same ratio win or lose. Low performers swing
//     10 points — talking 54% in wins, 64% in losses. Reacting vs. driving.
// [3] Covey, S.R. — The 7 Habits of Highly Effective People
//     Simon & Schuster, 1989, p. 239
//     Confirmed verbatim across Goodreads, publisher listings ✓
//
// QUOTE — verified verbatim 2026-05-11:
// "Most people do not listen with the intent to understand; they listen with
// the intent to reply."
// — Stephen R. Covey, The 7 Habits of Highly Effective People, 1989, p. 239
// Confirmed verbatim at Goodreads, multiple publisher sources ✓
//
// AI NUDGE: Applicable — analysis of real call behavior, self-assessment of
// talk patterns, building a correction plan.
//
// IN THE WILD: Type A — Gong 2025 update (Morgese). High performers hold
// consistent ratio whether they win or lose. Low performers swing 10 points
// between wins and losses — they react to how the call feels rather than
// running a disciplined process. Directly cited, documented finding.
//
// MIDDAY ESCALATION CHECK: Morning covers the 43:57 ratio — what the number
// is and why listening matters. Midday escalates to the consistency finding —
// the ratio isn't the point, controlling your behavior regardless of how the
// call feels is the point. Genuinely different angle. ✓
//
// QUIZ Q3 APPLICATION CHECK: Q3 presents a real mid-call scenario and asks
// what the rep should do — forces use of the concept, not identification. ✓
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT = "#E8FF47";
const ACCENT_DIM = "#E8FF4722";

const data = {
  category: "Sales Craft",
  categoryTag: "SALES CRAFT",
  concept: "Talk/Listen Ratio",
  date: "May 11, 2026",
  entry: "007",
  morning: {
    concept: "Talk/Listen Ratio",
    hook: "You think you're running discovery. You're actually delivering a monologue with question marks.",
    explanation:
      "Gong analyzed 25,537 B2B sales calls and found that top-performing reps talk 43% of the time. Average reps talk around 70%. That 27-point gap isn't about being quiet — it's about who's doing the cognitive work on the call. When you're talking, you're telling. When the buyer's talking, they're revealing. Every minute you spend explaining your product is a minute they're not telling you why they'd buy it, what's blocking them, or what actually matters to them. The math is brutal: if you're on a 30-minute discovery call and you're talking 70% of the time, you're giving the buyer 9 minutes to tell you everything you need to close the deal. Top performers give them 17.",
    why_today:
      "AI conversation intelligence tools now track this in real time. If you're not measuring your ratio, your competitors with Gong or Chorus are — and they're coaching their reps on it weekly.",
    morning_challenge:
      "Pull your actual talk/listen ratio from your call recording platform — Gong, Chorus, whatever your org runs. Look at your last three discovery calls. That number is your baseline.\n\nIf your org isn't giving you this data: that's the first conversation to have with your manager. It's 2026. This is table stakes. In the meantime, tools like Fireflies or Otter will give you a free read — no excuse to fly blind.\n\nOnce you have your number, run this prompt:\n\n\"I'm a B2B sales rep. My current talk/listen ratio in discovery is [your actual number]%. My goal is 43% or lower. Give me 5 specific techniques to shift the ratio — not just 'ask more questions' but actual tactical moves I can use in the first 10 minutes of a call to hand the floor to the buyer and keep it there.\"\n\nPick one. Use it on your next call today.",
  },
  midday: {
    reframe:
      "The ratio is a symptom. What it's actually measuring is whether you trust your process enough to run it the same way when the call feels off.",
    real_world:
      "In 2025, Gong revisited the talk/listen ratio across their dataset and found something that reframes the whole concept. The biggest separator between high and low performers wasn't the ratio itself — it was consistency. High performers maintained essentially the same talk/listen ratio whether they won or lost a deal. Low performers swung 10 points between outcomes — talking 54% of the time in won deals and 64% in lost ones. That swing is the tell. When a call feels hard, average reps talk more. They fill silence, over-explain, pitch harder. They're reacting to how the call feels rather than running a process. Top performers stay disciplined. They ask the question and wait. They let the silence sit. They don't let the anxiety of a quiet call pull them into monologue mode. The ratio isn't the goal — consistent, process-driven behavior regardless of call temperature is. (Morgese, Gong Labs, 2025)",
    quote:
      "Most people do not listen with the intent to understand; they listen with the intent to reply.",
    attribution: "Stephen R. Covey, The 7 Habits of Highly Effective People, 1989",
    midday_nudge:
      "On your last deal that went quiet or stalled — were you talking more on those calls than the ones that were moving? What were you filling the silence with?",
  },
  quiz: [
    {
      question: "According to Gong's analysis of 25,537 B2B sales calls, what is the talk/listen ratio of top-performing reps?",
      options: [
        "50% talk / 50% listen — an even split",
        "43% talk / 57% listen",
        "35% talk / 65% listen",
        "60% talk / 40% listen",
      ],
      correct: 1,
      explanation:
        "43/57 is the Gong finding — top performers talk less than half the time. Average reps were closer to 70% talk, a 27-point gap that represents the difference between telling and learning on a discovery call.",
    },
    {
      question: "Gong's 2025 update found that the biggest differentiator between high and low performers wasn't the ratio itself, but:",
      options: [
        "The number of questions asked per call",
        "Whether the rep used video during the call",
        "Consistency — high performers maintain the same ratio win or lose; low performers swing 10 points",
        "The length of the call — longer calls correlated with higher win rates",
      ],
      correct: 2,
      explanation:
        "Consistency is the real signal. Low performers talk 54% in won deals and 64% in lost ones — they react to call temperature. High performers run the same disciplined process regardless of how the call feels. The ratio is the output of process, not a thing you chase directly.",
    },
    {
      question: "You're 15 minutes into a discovery call. The buyer's answers are getting shorter and you can feel the energy drop. Your instinct is to start explaining your product's capabilities to re-engage them. What does the talk/listen ratio research say you should do instead?",
      options: [
        "Lean into the instinct — demonstrating value re-engages buyers who are losing interest",
        "End the call early and reschedule when they're more engaged",
        "Hold the ratio — ask a direct, open question about what's most important to them right now and let the silence sit",
        "Introduce a case study to shift the conversation to social proof",
      ],
      correct: 2,
      explanation:
        "The consistency finding is the guide here: low performers react to a dropping call by talking more. The discipline is to hold the process — ask an open question, wait out the silence, let the buyer fill it. Pitching harder when a call goes quiet is exactly the behavior that widens the gap between high and low performers.",
    },
  ],
  score_labels: ["REVIEW TOMORROW", "ALMOST THERE", "LOCKED IN"],
  closing_line:
    "Tomorrow you get 1% sharper. Tonight: count how many times you spoke last just to fill silence on a call this week.",
  linkedin_post: `Most sales reps think they're running discovery.

They're delivering a monologue with question marks.

@Gong analyzed 25,537 B2B sales calls and found top performers talk 43% of the time. Average reps talk 70%.

That 27-point gap is 8 extra minutes of buyer silence per 30-minute call. Eight minutes where they could be telling you exactly why they'd buy — or what's in the way.

But here's the 2025 finding that reframes everything: the ratio isn't the point.

𝗖𝗼𝗻𝘀𝗶𝘀𝘁𝗲𝗻𝗰𝘆 is. Top performers hold the same ratio whether they win or lose. Average reps swing 10 points — talking more when calls go quiet. Reacting instead of driving.

Swipe through today's One Percent for the full breakdown — including the one scenario that separates disciplined reps from everyone else.

#OnePercent #SalesCraft #B2BSales #DiscoveryCalls #Selling`,
  sources: [
    {
      label: "Orlob / Morgese — Talk-to-Listen Ratio in Sales. Gong Labs, Gong.io, 2016 (updated March 2025).",
      detail: "Analysis of 25,537 B2B sales calls. Top performers: 43% talk / 57% listen. Average reps: ~70% talk. Foundational dataset for the concept.",
      url: "https://www.gong.io/blog/talk-to-listen-conversion-ratio",
    },
    {
      label: "Morgese — The Best Sales Insights of 2025. Gong Labs, Gong.io, March 2025.",
      detail: "2025 update: the real differentiator is consistency, not the ratio. High performers hold steady; low performers swing 10 points between wins and losses — talking 64% on lost deals.",
      url: "https://www.gong.io/blog/the-best-sales-insights-of-2025",
    },
    {
      label: "Covey, S.R. — The 7 Habits of Highly Effective People. Simon & Schuster, 1989.",
      detail: "Habit 5: Seek first to understand, then to be understood. The philosophical foundation for why listening is the primary act — and why most people fail at it.",
      url: "https://www.simonandschuster.com/books/The-7-Habits-of-Highly-Effective-People/Stephen-R-Covey/9781982137274",
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

      <div style={S.datebar}>
        <span>{data.date}</span>
        <span style={{ color: "#2a2a2a", margin: "0 6px" }}>·</span>
        <span style={{ color: ACCENT, opacity: 0.7 }}>{data.category}</span>
        <span style={{ color: "#2a2a2a", margin: "0 6px" }}>·</span>
        <span>{data.concept}</span>
      </div>

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
  .quiz-opt.selected { border-color: ${accent}; color: #0A0A0A; background: ${accent}; }
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
