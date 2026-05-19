import { useState, useEffect } from "react";

// ─── ENTRY METADATA ──────────────────────────────────────────────────────────
// Entry: 003 | Category: Sales Craft | Concept: Discovery Questions
// Date: May 8, 2026
//
// SOURCES — verified via web search 2026-05-08:
// [1] Rackham, SPIN Selling — McGraw-Hill, 1988
//     amazon.com/SPIN-Selling-Neil-Rackham/dp/0070511136 ✓
//     35,000 sales calls, 10,000 reps, 12 years — foundational research on
//     question types in major sales (Situation, Problem, Implication, Need-Payoff)
// [2] Tamir & Mitchell, "Disclosing information about the self is intrinsically
//     rewarding" — PNAS 109(21), 2012
//     pnas.org/doi/10.1073/pnas.1202129109 ✓
//     Humans devote 30–40% of speech output to self-disclosure; activates
//     mesolimbic dopamine system — explains why opinion-based questions outperform
//     fact-based questions in discovery
// [3] Schein, Humble Inquiry: The Gentle Art of Asking Instead of Telling
//     Berrett-Koehler, 2013
//     penguinrandomhouse.com/books/786686/humble-inquiry-3rd-edition ✓
//     Defines humble inquiry; "culture of Tell" framework
//
// QUOTE — verified verbatim 2026-05-08:
// Schein, Humble Inquiry, Berrett-Koehler, 2013, p. 2
// "Humble Inquiry is the fine art of drawing someone out, of asking questions
// to which you do not already know the answer, of building a relationship
// based on curiosity and interest in the other person."
// Confirmed verbatim across ResearchGate, Goodreads, Google Books, Amazon. ✓
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT = "#E8FF47";
const ACCENT_DIM = "#E8FF4722";

const data = {
  category: "Sales Craft",
  categoryTag: "SALES CRAFT",
  concept: "Discovery Questions",
  date: "May 8, 2026",
  entry: "003",
  morning: {
    concept: "Discovery Questions",
    hook: "The rep who asks the best questions doesn't just gather information — they shape how the buyer understands their own problem.",
    explanation:
      "Most reps treat discovery like a checklist: budget, authority, timeline, need. That's not discovery — that's intake. Real discovery is the cognitive work of helping a buyer move from vague discomfort to vivid, felt pain. Rackham's 12-year study of 35,000 sales calls found one thing that separated top performers from average ones — not their pitches, not their closing techniques. It was the type of questions they asked. Specifically: Implication questions. The questions that make a prospect feel the downstream cost of doing nothing. If your discovery is just a fact-finding sprint before you demo, you're leaving deals on the table. The best question doesn't inform the rep — it transforms the buyer.",
    why_today:
      "In 2026, when buyers have already Googled your product and read three competitor reviews before picking up the phone, surface-level situation questions are a waste of everyone's time.",
    morning_challenge:
      "Pull up a deal in your pipeline right now — one that's stalled, slow, or where you're not sure the buyer really feels the urgency. You know who I mean.\n\nRun this prompt:\n\n\"I'm a sales rep working a deal with [role/company type]. The buyer's problem is [problem]. They seem engaged but aren't moving. Generate 5 implication questions I can ask on our next call — questions that help them feel the real cost of staying where they are. Make them conversational, not interrogative. Don't include any question they can answer with a yes or no.\"\n\nPick the two that scare you a little. Those are the right ones.",
  },
  midday: {
    reframe:
      "You're not asking questions to learn — you're asking questions to help the buyer teach themselves.",
    real_world:
      "Rackham's research didn't just identify what top performers did differently — it quantified it. Across 35,000 observed sales calls, top performers asked four times more implication questions than their average peers. Not better situation questions. Not more polished pitches. Four times more questions about consequences. The finding held across industries and company sizes. Average reps were diagnosing the problem and jumping to the solution. Top performers were staying in the problem — letting the buyer feel the weight of it — before ever moving toward an answer. That gap in question type, not question count, was the measurable difference between performers. (Rackham, SPIN Selling, 1988)",
    quote:
      "Humble Inquiry is the fine art of drawing someone out, of asking questions to which you do not already know the answer, of building a relationship based on curiosity and interest in the other person.",
    attribution: "Edgar H. Schein, Humble Inquiry, 2013",
    midday_nudge:
      "Think about your last discovery call. How many of your questions were really just statements with a question mark at the end?",
  },
  quiz: [
    {
      question: "According to Rackham's SPIN research, which question type is most associated with success in major sales?",
      options: [
        "Situation questions — establish context early and thoroughly",
        "Problem questions — identify what the buyer is struggling with",
        "Implication questions — surface the downstream cost of the problem",
        "Need-payoff questions — confirm the buyer wants your solution",
      ],
      correct: 2,
      explanation:
        "Rackham found that Implication questions were the single strongest predictor of success in major sales — they transform a stated problem into felt urgency. Top performers asked far more of them than average performers.",
    },
    {
      question: "A buyer says, 'Our reporting is a bit slow but we manage.' What's the best next move in discovery?",
      options: [
        "Pivot to the demo — they've confirmed a problem exists",
        "Ask how long it's been slow — get more situation context",
        "Ask what happens when a decision-maker needs a number they can't pull fast — make the cost vivid",
        "Offer a feature that solves reporting speed",
      ],
      correct: 2,
      explanation:
        "The buyer has named an implied need. The discovery move is to develop it into felt pain — asking about consequences makes the problem real and expensive in the buyer's mind, which is what drives urgency.",
    },
    {
      question: "Tamir & Mitchell's 2012 neuroscience research suggests that in discovery, opinion-based questions outperform fact-based questions because:",
      options: [
        "Facts are harder for buyers to remember under pressure",
        "Sharing opinions activates reward centers in the brain, making buyers more engaged",
        "Opinion questions signal that you've done your homework",
        "Fact-based questions are more likely to be answered defensively",
      ],
      correct: 1,
      explanation:
        "Tamir & Mitchell found that self-disclosure activates the mesolimbic dopamine system — the same reward circuitry triggered by food and money. Buyers aren't just more comfortable sharing opinions; it literally feels good to them. That's why 'What do you think is causing this?' lands better than 'How many users do you have?'",
    },
  ],
  score_labels: ["REVIEW TOMORROW", "ALMOST THERE", "LOCKED IN"],
  closing_line:
    "Tomorrow you'll get 1% sharper. Tonight, count how many questions you asked today that had a real answer you didn't already know.",
  linkedin_post: `Most reps walk out of discovery thinking they nailed it.

The deal goes quiet two weeks later.

Here's what actually happened: they ran an intake form, not a discovery call.

The difference between a deal that moves and one that ghosts you isn't your pitch — it's whether the buyer left the call feeling the cost of staying still.

𝗗𝗶𝘀𝗰𝗼𝘃𝗲𝗿𝘆 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻𝘀 aren't about what you learn. They're about what the buyer realizes.

Swipe through today's One Percent for the framework — including the specific question type Rackham's 12-year study found that separates average reps from top performers (most reps almost never ask it).

#OnePercent #SalesCraft #DiscoveryQuestions #B2BSales #Selling

📚 Sources:
[1] Rackham — SPIN Selling. McGraw-Hill, 1988. amazon.com/SPIN-Selling-Neil-Rackham/dp/0070511136
[2] Tamir & Mitchell — Disclosing information about the self is intrinsically rewarding. PNAS 109(21), 2012. pnas.org/doi/10.1073/pnas.1202129109
[3] Schein — Humble Inquiry: The Gentle Art of Asking Instead of Telling. Berrett-Koehler, 2013. penguinrandomhouse.com/books/786686/humble-inquiry-3rd-edition`,
  sources: [
    {
      label: "Rackham — SPIN Selling. McGraw-Hill, 1988.",
      detail: "The foundational research on major-sale questioning — 35,000 calls across 12 years establishing Situation, Problem, Implication, and Need-payoff question types.",
      url: "https://www.amazon.com/SPIN-Selling-Neil-Rackham/dp/0070511136",
    },
    {
      label: "Tamir & Mitchell — Disclosing information about the self is intrinsically rewarding. PNAS 109(21), 2012.",
      detail: "Neuroscience evidence that self-disclosure activates the mesolimbic dopamine system — explains why opinion-based discovery questions engage buyers more deeply than fact-based ones.",
      url: "https://www.pnas.org/doi/10.1073/pnas.1202129109",
    },
    {
      label: "Schein — Humble Inquiry: The Gentle Art of Asking Instead of Telling. Berrett-Koehler, 2013.",
      detail: "Frames the cultural bias toward telling over asking — and defines the posture of genuine curiosity that makes discovery questions land.",
      url: "https://www.penguinrandomhouse.com/books/786686/humble-inquiry-3rd-edition-by-edgar-h-schein-and-peter-a-schein/",
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
          <div key={i} style={p.startsWith('"') || p.startsWith('"')
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
