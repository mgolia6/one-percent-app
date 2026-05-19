import { useState, useEffect } from "react";

const ACCENT = "#FF8C47";
const ACCENT_DIM = "#FF8C4722";

// SOURCES VERIFIED via web search 2026-05-07:
// [1] Kahneman & Tversky 1979 — confirmed: Econometrica 47(2), jstor.org/stable/1914185
// [2] Entman 1993 — confirmed: Journal of Communication 43(4), academic.oup.com/joc/article-abstract/43/4/51/4160153
// [3] Levin, Schneider & Gaeth 1998 — confirmed: Org Behavior & Human Decision Processes 76(2), pubmed.ncbi.nlm.nih.gov/9831520

const data = {
  category: "Vocab & Language",
  categoryTag: "VOCAB & LANGUAGE",
  concept: "Framing Effect",
  date: "May 7, 2026",
  entry: "002",
  morning: {
    concept: "Framing Effect",
    hook: "The words you choose don't describe reality — they construct it.",
    explanation:
      "The framing effect is the cognitive phenomenon where identical information produces different decisions, emotions, and judgments depending on how it's presented. A surgery with a '90% survival rate' and one with a '10% mortality rate' are the same surgery — but the first gets more patients. This isn't irrationality; it's how human cognition actually works. Context, order, and word choice aren't decoration around the message. They ARE the message. Master communicators don't just say the right thing — they build the right frame first.",
    why_today:
      "In 2025/2026, when AI generates infinite content at zero cost, the frame is the only thing separating signal from noise.",
    morning_challenge:
      "Before your next email or message, rewrite the same core point two ways — one loss-frame ('what you'll miss'), one gain-frame ('what you'll get'). Then pick the one that serves your actual goal.",
  },
  midday: {
    reframe:
      "Framing isn't spin — it's the invisible architecture every argument lives inside.",
    real_world:
      "In 2012, NYC's proposed soda ban was framed as government overreach — not as a public health measure. Support collapsed. Same policy. Different frame. Different outcome. The policy debate was actually a framing debate that nobody labeled as such.",
    quote: "Language is not a neutral medium.",
    attribution: "Mikhail Bakhtin, The Dialogic Imagination, 1981",
    midday_nudge:
      "When was the last time someone changed your mind — and was it the data or the frame that actually moved you?",
  },
  quiz: [
    {
      question: "What does the framing effect primarily demonstrate?",
      options: [
        "People are consistently irrational decision-makers",
        "Identical information can produce different responses based on presentation",
        "Negative framing always outperforms positive framing",
        "Data alone is sufficient to persuade",
      ],
      correct: 1,
      explanation:
        "The framing effect shows that how information is presented shapes response — not just the information itself.",
    },
    {
      question:
        "A drug trial reports '1 in 5 patients experienced side effects.' A second framing says '80% had no side effects.' Which is more likely to increase willingness to take the drug?",
      options: [
        "The first — specificity builds trust",
        "Neither — rational people treat them as equal",
        "The second — the gain frame feels safer",
        "The second only for risk-averse patients",
      ],
      correct: 2,
      explanation:
        "Gain frames ('80% safe') consistently outperform loss frames ('1 in 5 harmed') for encouraging action. Kahneman and Tversky documented this extensively in Prospect Theory (1979).",
    },
    {
      question:
        "A buyer keeps stalling on a $50K deal. Which framing is most likely to shift the conversation?",
      options: [
        "'This will cost you $50K' — transparency builds credibility",
        "'Every month you wait costs ~$4K in unrealized upside' — reframe delay as the price",
        "'Other companies in your space have already moved' — social proof",
        "'We can discount if needed' — reduce the loss frame",
      ],
      correct: 1,
      explanation:
        "Reframing inaction as costly applies loss aversion to the status quo — often more persuasive than defending the solution's price. Make delay the expensive option.",
    },
  ],
  score_labels: ["REVIEW TOMORROW", "ALMOST THERE", "LOCKED IN"],
  closing_line:
    "Tomorrow you'll get 1% sharper. Tonight, notice the frames in everything you read.",
  linkedin_post: `Same facts. Completely different answer.

That's not a trick. That's the 𝗙𝗿𝗮𝗺𝗶𝗻𝗴 𝗘𝗳𝗳𝗲𝗰𝘁 — and once you see it, you can't unsee it.

Most people think persuasion is about having the right information. It's not. It's about the container you put that information in.

The container changes everything.

Swipe through today's One Percent for the full breakdown — including a real-world example that might make you rethink every important message you've sent this week.

#OnePercent #VocabAndLanguage #FramingEffect #Communication #Persuasion

📚 Sources:
[1] Kahneman & Tversky — Prospect Theory: An Analysis of Decision under Risk. Econometrica, 1979. jstor.org/stable/1914185
[2] Entman — Framing: Toward Clarification of a Fractured Paradigm. Journal of Communication, 1993. academic.oup.com/joc/article-abstract/43/4/51/4160153
[3] Levin, Schneider & Gaeth — All Frames Are Not Created Equal. Organizational Behavior & Human Decision Processes, 1998. pubmed.ncbi.nlm.nih.gov/9831520`,
  sources: [
    {
      label: "Kahneman & Tversky — Prospect Theory: An Analysis of Decision under Risk. Econometrica, 1979.",
      detail:
        "The foundational paper on loss aversion — demonstrates how framing alters decisions in measurable, predictable ways.",
      url: "https://www.jstor.org/stable/1914185",
    },
    {
      label: "Entman — Framing: Toward Clarification of a Fractured Paradigm. Journal of Communication, 1993.",
      detail:
        "Defines framing in communication: how selection and salience shape how audiences process information.",
      url: "https://academic.oup.com/joc/article-abstract/43/4/51/4160153",
    },
    {
      label: "Levin, Schneider & Gaeth — All Frames Are Not Created Equal. Org. Behavior & Human Decision Processes, 1998.",
      detail:
        "Distinguishes risky choice, attribute, and goal framing — the clearest practical taxonomy of framing types.",
      url: "https://pubmed.ncbi.nlm.nih.gov/9831520/",
    },
  ],
};

const tabs = ["MORNING", "MIDDAY", "EVENING", "POST"];

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

  const switchTab = (i) => {
    setFadeKey((k) => k + 1);
    setActiveTab(i);
  };

  const handleAnswer = (qi, ai) => {
    if (submitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qi]: ai }));
  };

  const handleSubmit = () => {
    if (Object.keys(quizAnswers).length < data.quiz.length) return;
    setSubmitted(true);
  };

  const score = submitted
    ? data.quiz.reduce((acc, q, i) => acc + (quizAnswers[i] === q.correct ? 1 : 0), 0)
    : 0;

  const scoreLabel =
    score === 3 ? data.score_labels[2] : score === 2 ? data.score_labels[1] : data.score_labels[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(data.linkedin_post).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={S.root}>
      <style>{css(ACCENT, ACCENT_DIM)}</style>

      {/* Header */}
      <div style={S.header}>
        <div style={S.hLeft}>
          <span style={S.logo}>ONE PERCENT</span>
          <span style={S.entryBadge}>#{data.entry}</span>
        </div>
        <div style={S.hRight}>
          <span style={S.streak}>🔥 {streak}</span>
          <span style={S.catBadge}>{data.categoryTag}</span>
        </div>
      </div>

      <div style={S.dateBar}>{data.date}</div>

      <div style={S.conceptBlock}>
        <div style={S.conceptName}>{data.concept}</div>
        <div style={{ width: 40, height: 2, background: ACCENT, marginTop: 10 }} />
      </div>

      <div style={S.tabRow}>
        {tabs.map((t, i) => (
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
            quiz={data.quiz}
            answers={quizAnswers}
            submitted={submitted}
            score={score}
            scoreLabel={scoreLabel}
            closing={data.closing_line}
            onAnswer={handleAnswer}
            onSubmit={handleSubmit}
            accent={ACCENT}
          />
        )}
        {activeTab === 3 && (
          <PostTab post={data.linkedin_post} copied={copied} onCopy={handleCopy} accent={ACCENT} />
        )}
      </div>

      {/* Sources — always present */}
      <div style={S.sourcesSection}>
        <div style={S.sourcesDivider} />
        <button className="src-toggle" onClick={() => setSourcesOpen(!sourcesOpen)}>
          {sourcesOpen ? "▲ SOURCES" : "▼ SOURCES"}
        </button>
        {sourcesOpen && (
          <div style={S.sourcesList}>
            {data.sources.map((s, i) => (
              <div key={i} style={S.sourceItem}>
                <a href={s.url} target="_blank" rel="noreferrer" className="src-link">
                  {s.label}
                </a>
                <div style={S.sourceDetail}>{s.detail}</div>
              </div>
            ))}
            <div style={S.verifiedBadge}>✓ All sources verified via web search</div>
          </div>
        )}
      </div>
    </div>
  );
}

function MorningTab({ data, accent }) {
  return (
    <div>
      <div style={{ ...S.tabLabel, color: accent }}>🌱 PLANT THE SEED</div>
      <div style={S.hook}>{data.hook}</div>
      <div style={S.bodyText}>{data.explanation}</div>
      <div style={{ borderLeft: `2px solid ${accent}`, paddingLeft: 14, marginBottom: 20 }}>
        <span style={{ color: accent, fontSize: 10, letterSpacing: "0.12em" }}>WHY TODAY</span>
        <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.6, marginTop: 6 }}>{data.why_today}</div>
      </div>
      <div style={{ background: accent + "12", border: `1px solid ${accent}33`, borderRadius: 4, padding: 16 }}>
        <div style={{ color: accent, fontSize: 10, letterSpacing: "0.12em", marginBottom: 8 }}>⚡ MORNING CHALLENGE</div>
        <div style={{ fontSize: 13, color: "#ddd", lineHeight: 1.6 }}>{data.morning_challenge}</div>
      </div>
    </div>
  );
}

function MiddayTab({ data, accent }) {
  return (
    <div>
      <div style={{ ...S.tabLabel, color: accent }}>👁 SEE IT DIFFERENTLY</div>
      <div style={{ borderLeft: `3px solid ${accent}`, paddingLeft: 16, marginBottom: 24 }}>
        <div style={{ fontSize: 17, color: "#fff", lineHeight: 1.5 }}>{data.reframe}</div>
      </div>
      <div style={{ fontSize: 10, color: "#333", letterSpacing: "0.15em", marginBottom: 10 }}>IN THE WILD</div>
      <div style={S.bodyText}>{data.real_world}</div>
      <div style={{ border: `1px solid ${accent}44`, borderRadius: 4, padding: "14px 16px", marginBottom: 20 }}>
        <div style={{ fontSize: 14, color: "#ddd", fontStyle: "italic", lineHeight: 1.5, marginBottom: 8 }}>"{data.quote}"</div>
        <div style={{ fontSize: 11, color: accent, letterSpacing: "0.08em" }}>— {data.attribution}</div>
      </div>
      <div style={{ borderLeft: `2px solid ${accent}66`, paddingLeft: 14 }}>
        <span style={{ color: accent, fontSize: 10, letterSpacing: "0.12em" }}>SIT WITH THIS</span>
        <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.6, marginTop: 6 }}>{data.midday_nudge}</div>
      </div>
    </div>
  );
}

function EveningTab({ quiz, answers, submitted, score, scoreLabel, closing, onAnswer, onSubmit, accent }) {
  return (
    <div>
      <div style={{ ...S.tabLabel, color: accent }}>🔥 BURN IT IN</div>
      {quiz.map((q, qi) => (
        <div key={qi} style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, color: accent, letterSpacing: "0.15em", marginBottom: 8 }}>Q{qi + 1}</div>
          <div style={{ fontSize: 13, color: "#ddd", lineHeight: 1.6, marginBottom: 12 }}>{q.question}</div>
          {q.options.map((opt, ai) => {
            let cls = "quiz-opt";
            if (!submitted && answers[qi] === ai) cls += " selected";
            if (submitted && ai === q.correct) cls = "quiz-opt correct";
            else if (submitted && answers[qi] === ai && ai !== q.correct) cls = "quiz-opt wrong";
            return (
              <button key={ai} className={cls} onClick={() => onAnswer(qi, ai)} disabled={submitted}>
                <span style={{ color: accent, marginRight: 8 }}>{String.fromCharCode(65 + ai)}.</span>
                {opt}
              </button>
            );
          })}
          {submitted && (
            <div style={{ fontSize: 11, color: "#666", lineHeight: 1.6, marginTop: 8, paddingLeft: 4 }}>
              {q.explanation}
            </div>
          )}
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
      <div style={{ fontSize: 12, color: "#444", fontStyle: "italic", borderTop: "1px solid #1a1a1a", paddingTop: 20, marginTop: 20, lineHeight: 1.6 }}>
        {closing}
      </div>
    </div>
  );
}

function PostTab({ post, copied, onCopy, accent }) {
  return (
    <div>
      <div style={{ ...S.tabLabel, color: accent }}>📋 LINKEDIN POST</div>
      <div style={{ fontSize: 10, color: "#444", letterSpacing: "0.1em", marginBottom: 12 }}>
        TEASER — swipe-driver for the carousel · sources appended
      </div>
      <div style={{ background: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: 4, padding: 20, fontSize: 13, color: "#aaa", lineHeight: 1.75, whiteSpace: "pre-wrap", marginBottom: 16 }}>
        {post}
      </div>
      <button className="copy-btn" onClick={onCopy}>
        {copied ? "✓ COPIED" : "COPY POST"}
      </button>
    </div>
  );
}

const css = (accent, accentDim) => `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A0A0A; }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-in { animation: fadeIn 0.28s ease forwards; }
  .tab-btn {
    background: none; border: none; cursor: pointer;
    font-family: 'DM Mono', monospace; font-size: 10px;
    letter-spacing: 0.12em; padding: 8px 12px; color: #555;
    transition: color 0.2s; border-bottom: 1.5px solid transparent;
  }
  .tab-btn:hover { color: #aaa; }
  .tab-btn.active { color: ${accent}; border-bottom-color: ${accent}; }
  .quiz-opt {
    background: #111; border: 1px solid #222; border-radius: 4px;
    padding: 12px 14px; cursor: pointer; font-family: 'DM Mono', monospace;
    font-size: 12px; color: #888; margin-bottom: 8px;
    transition: all 0.18s; text-align: left; width: 100%;
  }
  .quiz-opt:hover:not(:disabled) { border-color: ${accent}44; color: #ccc; }
  .quiz-opt.selected { border-color: ${accent}; color: #fff; background: ${accentDim}; }
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
    color: ${accent}; text-decoration: none; font-size: 11px;
    letter-spacing: 0.03em; display: block; margin-bottom: 4px;
    font-family: 'DM Mono', monospace;
  }
  .src-link:hover { text-decoration: underline; }
`;

const S = {
  root: {
    background: "#0A0A0A", minHeight: "100vh",
    fontFamily: "'DM Mono', monospace", color: "#fff",
    maxWidth: 680, margin: "0 auto", paddingBottom: 80,
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "20px 24px 12px", borderBottom: "1px solid #141414",
  },
  hLeft: { display: "flex", alignItems: "center", gap: 10 },
  hRight: { display: "flex", alignItems: "center", gap: 12 },
  logo: { fontSize: 11, letterSpacing: "0.2em", color: "#fff", fontWeight: 500 },
  entryBadge: { fontSize: 10, color: "#333", letterSpacing: "0.1em" },
  streak: { fontSize: 11, color: "#aaa" },
  catBadge: {
    fontSize: 9, letterSpacing: "0.15em", color: "#0A0A0A",
    background: ACCENT, padding: "3px 8px", borderRadius: 2, fontWeight: 500,
  },
  dateBar: {
    fontSize: 10, color: "#333", letterSpacing: "0.1em",
    padding: "8px 24px", borderBottom: "1px solid #0f0f0f",
  },
  conceptBlock: { padding: "28px 24px 0" },
  conceptName: { fontSize: 32, fontWeight: 500, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.1 },
  tabRow: {
    display: "flex", borderBottom: "1px solid #141414",
    marginTop: 20, padding: "0 12px", gap: 4,
  },
  content: { padding: "24px 24px 0" },
  tabLabel: { fontSize: 10, letterSpacing: "0.15em", marginBottom: 16, fontWeight: 500 },
  hook: { fontSize: 18, color: "#fff", lineHeight: 1.45, fontWeight: 400, marginBottom: 18, letterSpacing: "-0.01em" },
  bodyText: { fontSize: 13, color: "#888", lineHeight: 1.7, marginBottom: 20 },
  sourcesSection: { padding: "28px 24px 48px" },
  sourcesDivider: { borderTop: "1px solid #141414", marginBottom: 18 },
  sourcesList: { marginTop: 16, display: "flex", flexDirection: "column", gap: 16 },
  sourceItem: {},
  sourceDetail: { fontSize: 11, color: "#444", lineHeight: 1.6 },
  verifiedBadge: {
    fontSize: 10, color: "#2a2a2a", letterSpacing: "0.1em",
    marginTop: 8, paddingTop: 12, borderTop: "1px solid #141414",
  },
};
