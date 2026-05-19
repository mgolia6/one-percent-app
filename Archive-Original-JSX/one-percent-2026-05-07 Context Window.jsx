import { useState, useEffect } from "react";

const TODAY = "2026-05-07";
const CATEGORY = "AI";
const COLOR = "#47FFE8";

const CONTENT = {
  morning: {
    concept: "Context Window",
    hook: "Every AI conversation is an amnesiac. What you put in the window is everything it knows.",
    explanation: "The context window is the total amount of text — your prompt, the conversation history, any documents you've loaded — that a model can 'see' at once. When you hit the limit, the earliest content falls off. This isn't a bug; it's the architecture. For sales ops and enterprise AI deployment, this is the single most misunderstood constraint. Teams build workflows assuming AI has persistent memory. It doesn't. Each call is stateless. The window is the whole world.",
    why_today: "In 2026, models like Claude and GPT-4o have 128K–1M token windows — but enterprise teams are still designing AI workflows as if context is infinite, and burning budget on hallucinations caused by truncated context.",
    morning_challenge: "Open your current AI workflow or prompt. What information are you assuming the model already knows? Write down the three things you never explicitly tell it — and add at least one of them to your next prompt."
  },
  midday: {
    reframe: "Context windows aren't a memory limit — they're a forcing function for clarity.",
    real_world: "Klarna's AI customer service deployment, which handled millions of conversations in 2024, succeeded in part because their engineers were obsessive about context hygiene — structuring exactly what went into the window per query type. Teams that just 'paste in everything' saw accuracy drop as conversations got longer. The constraint made them think harder about signal vs. noise.",
    quote: "Clarity about what you're trying to do is 90% of the problem.",
    attribution: "Jensen Huang, NVIDIA CEO",
    midday_nudge: "If your AI output degrades over a long conversation, where's the real problem — the model, or what you're feeding it?"
  },
  evening: {
    questions: [
      {
        q: "What happens to a language model's context when a conversation exceeds the context window limit?",
        options: [
          "A) The model summarizes earlier content automatically",
          "B) The earliest tokens are dropped from the active context",
          "C) The model saves context to external memory",
          "D) Processing stops and an error is returned"
        ],
        correct: 1,
        explanation: "Most transformer-based models use a sliding or truncating window — older tokens simply fall out of scope. Some systems add summarization layers on top, but the base model itself has no persistent memory."
      },
      {
        q: "A sales ops team's AI-powered deal summary tool works great for short deals but gives inaccurate outputs on deals with 3 months of email history. The most likely cause is:",
        options: [
          "A) The model hasn't been fine-tuned on their CRM data",
          "B) The prompt needs better formatting",
          "C) The email history exceeds the effective context window, causing early context to be lost or diluted",
          "D) The model needs a higher temperature setting"
        ],
        correct: 2,
        explanation: "Long histories frequently exceed what the model can effectively attend to. The fix is usually chunking, retrieval-augmented generation (RAG), or strategic summarization — not prompt wording."
      },
      {
        q: "You're designing an AI workflow for your territory planning. Deals have rich histories. Which architecture best addresses context window limitations?",
        options: [
          "A) Use a model with the largest available context window and load everything",
          "B) Implement RAG — retrieve only the most relevant deal fragments per query, keeping context lean and targeted",
          "C) Summarize all historical data into one document before every call",
          "D) Run multiple parallel prompts and manually reconcile the outputs"
        ],
        correct: 1,
        explanation: "RAG (Retrieval-Augmented Generation) is the production-grade answer. It keeps context tight and relevant by dynamically fetching only what matters for each query — rather than bloating the window with everything and hoping the model handles it."
      }
    ],
    closing_line: "The sharpest AI workflows aren't built by people who know the most — they're built by people who know what to leave out."
  },
  sources: [
    {
      label: "Anthropic — Claude Model Documentation (2024–2025)",
      detail: "Official documentation on context window sizes, token limits, and how context is managed across Claude model variants.",
      url: "https://docs.anthropic.com/en/docs/about-claude/models/overview"
    },
    {
      label: "Lewis et al. — Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (2020)",
      detail: "The foundational RAG paper from Meta AI — the architecture that resolves context window constraints in production AI systems.",
      url: "https://arxiv.org/abs/2005.11401"
    },
    {
      label: "Klarna — AI in Customer Service: First Year Results (2024)",
      detail: "Klarna's public reporting on deploying AI at scale — context design decisions were central to their accuracy outcomes.",
      url: "https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/"
    }
  ],
  linkedin: {
    post: `💡 One Percent — Daily Edge | AI

𝗖𝗼𝗻𝘁𝗲𝘅𝘁 𝗪𝗶𝗻𝗱𝗼𝘄

Every AI conversation is an amnesiac.
What you put in the window is everything it knows.

Here's what most people get wrong:

They assume AI has memory.
It doesn't.

The context window is the entire "world" a model can see during one conversation — your prompt, the history, any docs you load. When it fills up, the oldest content drops off. Silently. No warning.

This is why your AI deal summaries get worse on long accounts.
This is why chatbots lose the thread after 20 messages.
This is why "just paste everything in" isn't a workflow.

𝗪𝗵𝗮𝘁 𝗮𝗰𝘁𝘂𝗮𝗹𝗹𝘆 𝘄𝗼𝗿𝗸𝘀:

Think like an editor, not a hoarder.
Give the model exactly what it needs for this query — not everything you have.

The teams building AI workflows that actually scale aren't the ones with the biggest context windows.

They're the ones who are ruthless about signal vs. noise.

𝗧𝗵𝗲 𝗽𝗿𝗮𝗰𝘁𝗶𝗰𝗲:
Open your current AI prompt. What are you assuming the model already knows? Add it explicitly. Watch what changes.

"Clarity about what you're trying to do is 90% of the problem."
— Jensen Huang

─────────────────────
🧠 One Percent — a daily concept, challenge & quiz to stay sharp.
#AI #SalesOps #OnePercent #ContextWindow #LLM #EnterpriseAI`
  }
};

export default function OnePercent() {
  const [phase, setPhase] = useState("morning");
  const [quiz, setQuiz] = useState({ answers: {}, submitted: false });
  const [streak, setStreak] = useState(0);
  const [showSources, setShowSources] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const last = localStorage.getItem("op_last");
      const s = parseInt(localStorage.getItem("op_streak") || "0");
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
      const yKey = yesterday.toISOString().split("T")[0];
      const ns = last === yKey ? s + 1 : last === TODAY ? s : 1;
      setStreak(ns);
      if (last !== TODAY) {
        localStorage.setItem("op_last", TODAY);
        localStorage.setItem("op_streak", String(ns));
      }
    } catch {}
  }, []);

  const answerQ = (qi, ai) => {
    if (!quiz.submitted) setQuiz(s => ({ ...s, answers: { ...s.answers, [qi]: ai } }));
  };
  const submitQuiz = () => setQuiz(s => ({ ...s, submitted: true }));
  const score = quiz.submitted
    ? CONTENT.evening.questions.filter((q, i) => quiz.answers[i] === q.correct).length
    : null;

  const copyPost = () => {
    navigator.clipboard.writeText(CONTENT.linkedin.post).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const phases = [
    { key: "morning", icon: "◐", label: "MORNING" },
    { key: "midday", icon: "○", label: "MIDDAY" },
    { key: "evening", icon: "●", label: "EVENING" },
    { key: "linkedin", icon: "in", label: "POST" },
  ];

  const Label = ({ text, color: c }) => (
    <div style={{ fontSize: 10, letterSpacing: "0.3em", color: c || "#555", marginBottom: 8 }}>{text}</div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0A0A",
      fontFamily: "'DM Mono','Courier New',monospace",
      color: "#F0EDE6",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .card { animation: fadeIn 0.25s ease forwards; }
        button { transition: all 0.15s; }
        a { color: inherit; text-decoration: none; }
        a:hover { opacity: 0.8; text-decoration: underline; }
        button:hover { opacity: 0.85; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 520, padding: "32px 20px 0", boxSizing: "border-box" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.25em", color: "#444", marginBottom: 4 }}>{TODAY}</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>ONE<span style={{ color: COLOR }}> %</span></div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#444" }}>STREAK</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: COLOR }}>{streak}</div>
          </div>
        </div>

        {/* Category badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: COLOR + "15", border: `1px solid ${COLOR}33`,
          borderRadius: 4, padding: "4px 10px", marginBottom: 24
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLOR }} />
          <span style={{ fontSize: 10, letterSpacing: "0.2em", color: COLOR }}>{CATEGORY.toUpperCase()}</span>
        </div>

        {/* Phase tabs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 28 }}>
          {phases.map(p => (
            <button key={p.key} onClick={() => setPhase(p.key)} style={{
              background: phase === p.key ? (p.key === "linkedin" ? "#0A66C2" : COLOR) : "transparent",
              border: `1px solid ${phase === p.key ? (p.key === "linkedin" ? "#0A66C2" : COLOR) : "#222"}`,
              borderRadius: 6, padding: "10px 4px", cursor: "pointer",
            }}>
              <div style={{
                fontSize: p.key === "linkedin" ? 10 : 14,
                color: phase === p.key ? (p.key === "linkedin" ? "#fff" : "#0A0A0A") : "#444",
                fontWeight: p.key === "linkedin" ? 700 : 400
              }}>{p.icon}</div>
              <div style={{
                fontSize: 9, letterSpacing: "0.2em",
                color: phase === p.key ? (p.key === "linkedin" ? "#fff" : "#0A0A0A") : "#444",
                fontWeight: 700, marginTop: 2
              }}>{p.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: 520, padding: "0 20px 48px", boxSizing: "border-box" }}>

        {/* MORNING */}
        {phase === "morning" && (
          <div className="card">
            <div style={{
              background: "#111", borderLeft: `3px solid ${COLOR}`,
              border: `1px solid #1E1E1E`, borderRadius: 10, padding: 22, marginBottom: 14
            }}>
              <Label text="TODAY'S CONCEPT" />
              <div style={{ fontSize: 24, fontWeight: 700, color: COLOR, marginBottom: 12 }}>{CONTENT.morning.concept}</div>
              <div style={{ fontSize: 15, color: "#F0EDE6", lineHeight: 1.7, fontStyle: "italic", marginBottom: 14 }}>"{CONTENT.morning.hook}"</div>
              <div style={{ fontSize: 13, color: "#AAA", lineHeight: 1.9 }}>{CONTENT.morning.explanation}</div>
            </div>
            <div style={{ background: "#111", border: "1px solid #1E1E1E", borderRadius: 10, padding: 20, marginBottom: 14 }}>
              <Label text="WHY TODAY" />
              <div style={{ fontSize: 13, color: "#CCC", lineHeight: 1.7 }}>{CONTENT.morning.why_today}</div>
            </div>
            <div style={{ background: COLOR + "12", border: `1px solid ${COLOR}33`, borderRadius: 10, padding: 20 }}>
              <Label text="MORNING CHALLENGE" color={COLOR} />
              <div style={{ fontSize: 14, color: "#F0EDE6", lineHeight: 1.7 }}>{CONTENT.morning.morning_challenge}</div>
            </div>
          </div>
        )}

        {/* MIDDAY */}
        {phase === "midday" && (
          <div className="card">
            <div style={{
              background: "#111", borderLeft: `3px solid ${COLOR}`,
              border: `1px solid #1E1E1E`, borderRadius: 10, padding: 22, marginBottom: 14
            }}>
              <Label text="NEW ANGLE" />
              <div style={{ fontSize: 15, color: "#F0EDE6", lineHeight: 1.8 }}>{CONTENT.midday.reframe}</div>
            </div>
            <div style={{ background: "#111", border: "1px solid #1E1E1E", borderRadius: 10, padding: 20, marginBottom: 14 }}>
              <Label text="IN THE WILD" />
              <div style={{ fontSize: 13, color: "#AAA", lineHeight: 1.9 }}>{CONTENT.midday.real_world}</div>
            </div>
            <div style={{ background: "#111", border: "1px solid #1E1E1E", borderRadius: 10, padding: 20, marginBottom: 14 }}>
              <div style={{ fontSize: 14, color: "#F0EDE6", lineHeight: 1.8, fontStyle: "italic" }}>"{CONTENT.midday.quote}"</div>
              <div style={{ fontSize: 11, color: "#555", marginTop: 8 }}>— {CONTENT.midday.attribution}</div>
            </div>
            <div style={{ background: COLOR + "12", border: `1px solid ${COLOR}33`, borderRadius: 10, padding: 20 }}>
              <Label text="SIT WITH THIS" color={COLOR} />
              <div style={{ fontSize: 14, color: "#F0EDE6", lineHeight: 1.7 }}>{CONTENT.midday.midday_nudge}</div>
            </div>
          </div>
        )}

        {/* EVENING */}
        {phase === "evening" && (
          <div className="card">
            {CONTENT.evening.questions.map((q, qi) => (
              <div key={qi} style={{ background: "#111", border: "1px solid #1E1E1E", borderRadius: 10, padding: 20, marginBottom: 14 }}>
                <Label text={`Q${qi + 1} / ${CONTENT.evening.questions.length}`} />
                <div style={{ fontSize: 14, color: "#F0EDE6", lineHeight: 1.7, marginBottom: 14 }}>{q.q}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {q.options.map((opt, ai) => {
                    const sel = quiz.answers[qi] === ai;
                    const isCorrect = quiz.submitted && ai === q.correct;
                    const isWrong = quiz.submitted && sel && ai !== q.correct;
                    return (
                      <button key={ai} onClick={() => answerQ(qi, ai)} style={{
                        background: isCorrect ? COLOR + "22" : isWrong ? "#FF477822" : sel ? "#FFFFFF11" : "transparent",
                        border: `1px solid ${isCorrect ? COLOR : isWrong ? "#FF4778" : sel ? "#555" : "#2A2A2A"}`,
                        borderRadius: 6, padding: "10px 14px", textAlign: "left",
                        cursor: quiz.submitted ? "default" : "pointer",
                        fontSize: 13, color: isCorrect ? COLOR : isWrong ? "#FF4778" : "#999",
                        fontFamily: "'DM Mono',monospace",
                      }}>{opt}</button>
                    );
                  })}
                </div>
                {quiz.submitted && (
                  <div style={{ fontSize: 12, color: "#666", marginTop: 12, lineHeight: 1.6 }}>{q.explanation}</div>
                )}
              </div>
            ))}

            {!quiz.submitted && Object.keys(quiz.answers).length === CONTENT.evening.questions.length && (
              <button onClick={submitQuiz} style={{
                width: "100%", background: COLOR, color: "#0A0A0A", border: "none",
                borderRadius: 6, padding: 14, fontSize: 12, letterSpacing: "0.2em",
                fontWeight: 700, cursor: "pointer", fontFamily: "'DM Mono',monospace", marginBottom: 14
              }}>
                SUBMIT
              </button>
            )}

            {quiz.submitted && (
              <div style={{
                background: COLOR + "12", border: `1px solid ${COLOR}33`,
                borderRadius: 10, padding: 24, textAlign: "center", marginBottom: 14
              }}>
                <div style={{ fontSize: 40, fontWeight: 700, color: COLOR, marginBottom: 4 }}>
                  {score}/{CONTENT.evening.questions.length}
                </div>
                <div style={{ fontSize: 10, letterSpacing: "0.25em", color: "#555", marginBottom: 16 }}>
                  {score === CONTENT.evening.questions.length ? "LOCKED IN" : score >= 2 ? "ALMOST THERE" : "REVIEW TOMORROW"}
                </div>
                <div style={{ fontSize: 13, color: "#AAA", lineHeight: 1.7, fontStyle: "italic" }}>
                  {CONTENT.evening.closing_line}
                </div>
              </div>
            )}
          </div>
        )}

        {/* LINKEDIN POST */}
        {phase === "linkedin" && (
          <div className="card">
            <div style={{ background: "#fff", borderRadius: 10, padding: 24, marginBottom: 14, color: "#000" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%", background: "#0A66C2",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 700, fontSize: 16, flexShrink: 0
                }}>M</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "sans-serif", color: "#000" }}>Matthew</div>
                  <div style={{ fontSize: 12, color: "#666", fontFamily: "sans-serif" }}>Sales Operations Program Manager · Amazon Business</div>
                  <div style={{ fontSize: 11, color: "#999", fontFamily: "sans-serif" }}>Just now · 🌐</div>
                </div>
              </div>
              <div style={{ fontSize: 13, fontFamily: "sans-serif", color: "#1a1a1a", lineHeight: 1.7, whiteSpace: "pre-line" }}>
                {CONTENT.linkedin.post}
              </div>
            </div>

            <button onClick={copyPost} style={{
              width: "100%",
              background: copied ? "#0A66C2" : "transparent",
              border: `1px solid #0A66C2`,
              borderRadius: 6, padding: "13px",
              fontSize: 12, letterSpacing: "0.2em", fontWeight: 700,
              cursor: "pointer", fontFamily: "'DM Mono',monospace",
              color: copied ? "#fff" : "#0A66C2",
              marginBottom: 14,
            }}>
              {copied ? "✓ COPIED" : "COPY POST"}
            </button>

            <div style={{ fontSize: 11, color: "#333", lineHeight: 1.7, textAlign: "center" }}>
              Paste directly into LinkedIn · Edit freely before posting
            </div>
          </div>
        )}

        {/* SOURCES */}
        <div style={{ marginTop: 8 }}>
          <button onClick={() => setShowSources(s => !s)} style={{
            background: "transparent", border: "1px solid #1E1E1E", borderRadius: 6,
            padding: "8px 14px", cursor: "pointer", width: "100%",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 10, letterSpacing: "0.25em", color: "#555" }}>SOURCES</span>
            <span style={{ fontSize: 12, color: "#444" }}>{showSources ? "▲" : "▼"}</span>
          </button>

          {showSources && (
            <div className="card" style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 10 }}>
              {CONTENT.sources.map((src, i) => (
                <div key={i} style={{ background: "#111", border: "1px solid #1E1E1E", borderRadius: 8, padding: 16 }}>
                  <div style={{ fontSize: 11, color: COLOR, marginBottom: 6, fontWeight: 700 }}>
                    [{i + 1}] <a href={src.url} target="_blank" rel="noopener noreferrer">{src.label}</a>
                  </div>
                  <div style={{ fontSize: 12, color: "#666", lineHeight: 1.7 }}>{src.detail}</div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
