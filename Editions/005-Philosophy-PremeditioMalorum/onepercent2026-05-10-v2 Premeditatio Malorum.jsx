import { useState, useEffect } from "react";

// ─── ENTRY METADATA ──────────────────────────────────────────────────────────
// Entry: 006 | Category: Philosophy | Concept: Premeditatio Malorum
// Date: May 10, 2026
//
// SOURCES — verified via web search 2026-05-10:
// [1] Seneca — Moral Letters to Lucilius (Epistulae Morales ad Lucilium)
//     Letter 13: "On Groundless Fears," c. AD 65
//     Wikisource (Gummere translation): en.wikisource.org/wiki/Moral_letters_to_Lucilius/Letter_13 ✓
//     Primary source for the concept — Seneca's systematic treatment of
//     anticipatory fear vs. actual suffering
// [2] Wilson, T.D. & Gilbert, D.T. — "Affective Forecasting"
//     Advances in Experimental Social Psychology, Vol. 35, pp. 345–411, 2003
//     journals.sagepub.com/doi/10.1111/j.0963-7214.2005.00355.x ✓
//     Coined "impact bias" — people systematically overestimate the intensity
//     and duration of their emotional reactions to negative future events
// [3] Wilson, T.D. & Gilbert, D.T. — "Affective Forecasting: Knowing What to Want"
//     Current Directions in Psychological Science, 14(3), 2005
//     Confirmed across populations: college students, sports fans, registered voters
//
// QUOTE — verified verbatim 2026-05-10:
// Seneca, Moral Letters to Lucilius, Letter 13 (Gummere translation, c. AD 65):
// "There are more things, Lucilius, likely to frighten us than there are to
// crush us; we suffer more often in imagination than in reality."
// Confirmed verbatim at Wikisource en.wikisource.org/wiki/Moral_letters_to_Lucilius/Letter_13 ✓
//
// AI NUDGE: Not applicable — this is a reflective/observational philosophy entry.
// The morning challenge is inherently observational. Forcing a prompt would be contrived.
//
// IN THE WILD: Type B — the pre-event dread pattern is universally experienced
// and empirically documented by Wilson & Gilbert across multiple populations.
// No fabricated specifics. The example is the human condition itself.
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT = "#FF4778";
const ACCENT_DIM = "#FF477822";

const data = {
  category: "Philosophy",
  categoryTag: "PHILOSOPHY",
  concept: "Premeditatio Malorum",
  date: "May 10, 2026",
  entry: "006",
  morning: {
    concept: "Premeditatio Malorum",
    hook: "You have already suffered most of the bad things that will happen to you today. None of them have occurred yet.",
    explanation:
      "Premeditatio malorum — the premeditation of evils — is a Stoic practice rooted in a precise observation: most human suffering happens before the thing itself. Seneca noticed that we pay the emotional price of a disaster many times over in anticipation, while the actual event, when it arrives, is almost always more survivable than the mental rehearsal. The practice isn't pessimism — it's the opposite. By facing what could go wrong directly and clearly, you drain it of its power to terrorize you from a distance. The Stoics weren't trying to suffer more. They were trying to suffer less, and only once.",
    why_today:
      "In an era of ambient anxiety — news cycles, status comparison, uncertainty about the future — most people are running a continuous background simulation of worst cases. Premeditatio malorum is the antidote: face it once, clearly, then release it.",
    morning_challenge:
      "Name the thing you've been dreading most this week. Not vaguely — specifically. Write it down in one sentence.\n\nNow answer these three questions in writing:\n— What is the actual worst outcome?\n— How likely is that outcome, honestly?\n— If it happened, what would you do next?\n\nYou've just done the practice. The dread lives in the unexamined space. Once you've looked at it directly, it shrinks to its actual size.",
  },
  midday: {
    reframe:
      "Fear is not a warning about the future. It's a tax you pay in advance on something that may never arrive.",
    real_world:
      "In 2003, psychologists Timothy Wilson and Daniel Gilbert published research on what they called the \"impact bias\" — the systematic tendency for people to overestimate how intensely and how long a negative future event will make them feel bad. Across populations that included college students, sports fans, and registered voters, people consistently predicted their emotional responses to negative events would be more severe and more lasting than they actually turned out to be. The dread before the hard conversation, the medical result, the job loss — always felt larger in anticipation than in the living of it. This isn't because the events weren't hard. It's because human beings dramatically underestimate their own capacity to adapt, cope, and keep going. Seneca was writing about the same phenomenon nearly 2,000 years earlier. Wilson and Gilbert put a name to it and measured it. The conclusion is the same: we suffer more in imagination than in reality — not occasionally, but as a consistent, documented pattern of human psychology.",
    quote:
      "There are more things, Lucilius, likely to frighten us than there are to crush us; we suffer more often in imagination than in reality.",
    attribution: "Seneca, Moral Letters to Lucilius, Letter 13, c. AD 65",
    midday_nudge:
      "Think of something you've been dreading that eventually happened. How did the actual experience compare to what you had imagined? What does that tell you about what you're dreading right now?",
  },
  quiz: [
    {
      question: "What is the core Stoic insight behind premeditatio malorum?",
      options: [
        "Expecting the worst makes you a more realistic thinker",
        "Visualizing failure helps you avoid it through better planning",
        "Most suffering happens in anticipation — facing what could go wrong directly drains it of its power to terrorize you",
        "Negative thinking is a form of intellectual honesty",
      ],
      correct: 2,
      explanation:
        "The practice isn't about pessimism or planning — it's about confronting anticipated suffering directly so it loses its ambient, unexamined power. Seneca's insight: you pay the emotional price of a disaster many times in imagination; the actual event is almost always more survivable.",
    },
    {
      question: "Wilson & Gilbert's 'impact bias' research found that people consistently:",
      options: [
        "Underestimate how bad negative events will feel",
        "Accurately predict their emotional responses to future events",
        "Overestimate the intensity and duration of their negative emotional reactions",
        "Feel worse after negative events than they expected",
      ],
      correct: 2,
      explanation:
        "The impact bias is the documented tendency to overestimate — not underestimate — how severely and how long a bad event will affect you. People are systematically worse at predicting their own resilience than the actual experience warrants.",
    },
    {
      question: "The Stoic practice of premeditatio malorum is best described as:",
      options: [
        "Catastrophizing — dwelling on worst cases to motivate action",
        "Deliberate, clear-eyed confrontation of what could go wrong in order to reduce its power over you",
        "A form of pessimism that accepts failure as inevitable",
        "A planning tool for identifying and preventing bad outcomes",
      ],
      correct: 1,
      explanation:
        "Premeditatio malorum is distinct from catastrophizing (which amplifies fear) and from planning (which is forward-looking problem-solving). It's the practice of looking directly at what you're avoiding so that the unexamined dread loses its grip. Face it once, clearly. Then release it.",
    },
  ],
  score_labels: ["REVIEW TOMORROW", "ALMOST THERE", "LOCKED IN"],
  closing_line:
    "Tomorrow you get 1% sharper. Tonight: think of one thing you've been dreading — and ask whether the suffering is happening in your life or in your head.",
  linkedin_post: `Most of what's hurting you right now hasn't happened yet.

That's not optimism. That's a documented pattern of human psychology.

In 2003, Wilson & Gilbert published research showing that people consistently overestimate how bad negative events will feel — and underestimate how quickly they'll recover. They called it the impact bias. Seneca was writing about the same thing in 65 AD.

𝗣𝗿𝗲𝗺𝗲𝗱𝗶𝘁𝗮𝘁𝗶𝗼 𝗠𝗮𝗹𝗼𝗿𝘂𝗺 — the Stoic practice of facing what could go wrong directly, so it loses its power to terrorize you from a distance.

"We suffer more often in imagination than in reality." — Seneca, 65 AD.

Still true. Still the most useful thing you can do with five minutes this morning.

Swipe through today's One Percent for the full concept, the research, and the three questions that do the work.

#OnePercent #Philosophy #Stoicism #MentalHealth #Resilience

📚 Sources:
[1] Seneca — Moral Letters to Lucilius, Letter 13. c. AD 65. en.wikisource.org/wiki/Moral_letters_to_Lucilius/Letter_13
[2] Wilson & Gilbert — Affective Forecasting. Advances in Experimental Social Psychology, Vol. 35, 2003. journals.sagepub.com/doi/10.1111/j.0963-7214.2005.00355.x
[3] Wilson & Gilbert — Affective Forecasting: Knowing What to Want. Current Directions in Psychological Science, 14(3), 2005.`,
  sources: [
    {
      label: "Seneca — Moral Letters to Lucilius, Letter 13: On Groundless Fears. c. AD 65.",
      detail: "Primary Stoic source on anticipatory suffering. Letter 13 is Seneca's systematic treatment of imagined vs. actual fear — the philosophical foundation of the concept.",
      url: "https://en.wikisource.org/wiki/Moral_letters_to_Lucilius/Letter_13",
    },
    {
      label: "Wilson & Gilbert — Affective Forecasting. Advances in Experimental Social Psychology, Vol. 35, 2003.",
      detail: "Coined 'impact bias' — people overestimate the intensity and duration of negative emotional reactions. Documented across college students, sports fans, and registered voters.",
      url: "https://journals.sagepub.com/doi/10.1111/j.0963-7214.2005.00355.x",
    },
    {
      label: "Wilson & Gilbert — Affective Forecasting: Knowing What to Want. Current Directions in Psychological Science, 14(3), 2005.",
      detail: "Extends impact bias research — identifies 'immune neglect' as a key mechanism: people underestimate their own psychological capacity to adapt and recover from negative events.",
      url: "https://journals.sagepub.com/doi/10.1111/j.0963-7214.2005.00355.x",
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
        <div style={{ color: accent, fontSize: 10, letterSpacing: "0.12em", marginBottom: 10 }}>⚡ MORNING CHALLENGE</div>
        {parts.map((p, i) => (
          <div key={i} style={p.startsWith("—") || p.startsWith("-")
            ? { fontSize: 12, color: "#bbb", lineHeight: 1.8, fontStyle: "italic", paddingLeft: 8, borderLeft: `1px solid ${accent}33`, marginBottom: 4 }
            : { fontSize: 13, color: "#ccc", lineHeight: 1.7, marginBottom: i < parts.length - 1 ? 10 : 0 }
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
  conceptName: { fontSize: 28, fontWeight: 500, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.1 },
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
