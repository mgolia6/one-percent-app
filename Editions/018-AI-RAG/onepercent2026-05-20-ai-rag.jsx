import { useState } from "react";

const accent = "#47FFE8";
const accentDim = "rgba(71,255,232,0.10)";
const bg = "#0a0f0e";
const surface = "#111918";
const border = "rgba(71,255,232,0.15)";

const styles = {
  shell: {
    fontFamily: "'DM Mono', 'Fira Mono', 'Courier New', monospace",
    background: bg,
    minHeight: "100vh",
    color: "#c8d8d6",
    padding: "0 0 60px 0",
    letterSpacing: "0.01em",
  },
  header: {
    borderBottom: `1px solid ${border}`,
    padding: "28px 28px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  tag: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.18em",
    color: accent,
    textTransform: "uppercase",
  },
  entryNum: {
    fontSize: 11,
    color: "rgba(71,255,232,0.45)",
    letterSpacing: "0.12em",
  },
  headline: {
    fontSize: 26,
    fontWeight: 700,
    color: "#e8f7f5",
    lineHeight: 1.2,
    marginTop: 6,
    fontFamily: "'DM Sans', 'DM Mono', sans-serif",
  },
  editionId: {
    fontSize: 10,
    color: "rgba(71,255,232,0.35)",
    letterSpacing: "0.14em",
    marginTop: 4,
  },
  tabBar: {
    display: "flex",
    borderBottom: `1px solid ${border}`,
    padding: "0 28px",
    gap: 0,
  },
  tab: (active) => ({
    padding: "12px 16px",
    fontSize: 11,
    fontWeight: active ? 700 : 400,
    color: active ? accent : "rgba(71,255,232,0.35)",
    borderBottom: active ? `2px solid ${accent}` : "2px solid transparent",
    cursor: "pointer",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    background: "none",
    border: "none",
    outline: "none",
    transition: "color 0.15s",
  }),
  body: {
    padding: "28px 28px 0",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  hook: {
    background: accentDim,
    border: `1px solid ${border}`,
    borderLeft: `3px solid ${accent}`,
    padding: "14px 16px",
    fontSize: 15,
    color: "#e8f7f5",
    fontStyle: "italic",
    lineHeight: 1.55,
    fontFamily: "'DM Sans', sans-serif",
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.2em",
    color: "rgba(71,255,232,0.4)",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  para: {
    fontSize: 13.5,
    lineHeight: 1.75,
    color: "#b0cac7",
    fontFamily: "'DM Sans', sans-serif",
    marginBottom: 12,
  },
  card: {
    background: surface,
    border: `1px solid ${border}`,
    padding: "16px 18px",
    borderRadius: 2,
  },
  reframe: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#e8f7f5",
    lineHeight: 1.6,
    fontFamily: "'DM Sans', sans-serif",
    borderLeft: `3px solid ${accent}`,
    paddingLeft: 14,
  },
  itwLabel: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.18em",
    color: "rgba(71,255,232,0.45)",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  quoteBlock: {
    background: accentDim,
    border: `1px solid ${border}`,
    padding: "14px 18px",
    borderRadius: 2,
  },
  quoteText: {
    fontSize: 14,
    color: "#e8f7f5",
    fontStyle: "italic",
    lineHeight: 1.6,
    fontFamily: "'DM Sans', sans-serif",
    marginBottom: 8,
  },
  attribution: {
    fontSize: 11,
    color: "rgba(71,255,232,0.5)",
    letterSpacing: "0.06em",
  },
  nudge: {
    background: "#0e1614",
    border: `1px solid rgba(71,255,232,0.1)`,
    padding: "14px 16px",
    borderRadius: 2,
    fontSize: 13,
    color: "#8ab8b3",
    lineHeight: 1.65,
    fontFamily: "'DM Sans', sans-serif",
  },
  nudgeLabel: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.18em",
    color: "rgba(71,255,232,0.4)",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  quizQ: {
    fontSize: 14,
    color: "#e8f7f5",
    lineHeight: 1.55,
    fontFamily: "'DM Sans', sans-serif",
    marginBottom: 14,
    fontWeight: 600,
  },
  option: (state) => ({
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "10px 14px",
    marginBottom: 8,
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: 1.5,
    background:
      state === "correct" ? "rgba(71,255,232,0.12)" :
      state === "wrong" ? "rgba(255,71,120,0.12)" :
      state === "selected" ? "rgba(71,255,232,0.06)" :
      "#0e1614",
    border:
      state === "correct" ? `1px solid ${accent}` :
      state === "wrong" ? "1px solid rgba(255,71,120,0.5)" :
      state === "selected" ? `1px solid rgba(71,255,232,0.3)` :
      "1px solid rgba(71,255,232,0.1)",
    color:
      state === "correct" ? accent :
      state === "wrong" ? "#ff4778" :
      "#b0cac7",
    cursor: state ? "default" : "pointer",
    borderRadius: 2,
    transition: "all 0.15s",
  }),
  explanation: {
    background: accentDim,
    border: `1px solid ${border}`,
    padding: "12px 14px",
    fontSize: 13,
    color: "#8ab8b3",
    lineHeight: 1.65,
    fontFamily: "'DM Sans', sans-serif",
    borderRadius: 2,
    marginTop: 4,
  },
  nextBtn: {
    background: "none",
    border: `1px solid ${border}`,
    color: accent,
    padding: "8px 18px",
    fontSize: 11,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    cursor: "pointer",
    marginTop: 10,
    fontFamily: "'DM Mono', monospace",
  },
  closing: {
    background: accentDim,
    border: `1px solid ${border}`,
    borderLeft: `3px solid ${accent}`,
    padding: "14px 16px",
    fontSize: 14,
    color: "#e8f7f5",
    fontStyle: "italic",
    lineHeight: 1.55,
    fontFamily: "'DM Sans', sans-serif",
  },
  challengeBox: {
    background: surface,
    border: `1px solid ${border}`,
    padding: "16px 18px",
    borderRadius: 2,
  },
  challengeText: {
    fontSize: 13.5,
    color: "#b0cac7",
    lineHeight: 1.7,
    fontFamily: "'DM Sans', sans-serif",
  },
  footer: {
    marginTop: 32,
    paddingTop: 16,
    borderTop: `1px solid ${border}`,
    fontSize: 10,
    color: "rgba(71,255,232,0.25)",
    letterSpacing: "0.1em",
    textAlign: "center",
  },
};

const QUIZ = [
  {
    question: "What fundamental limitation of large language models does RAG directly solve?",
    options: [
      "Models are too slow to respond in real time",
      "Models rely on static training data with a knowledge cutoff, unable to access current or proprietary information",
      "Models can only process text, not documents",
      "Models require too much computing power for enterprise use",
    ],
    correct: 1,
    explanation: "LLMs are trained on a fixed dataset and frozen at a cutoff date. RAG solves this by retrieving relevant, up-to-date documents at inference time — before the model generates its response.",
  },
  {
    question: "In a RAG system, what happens between the user's question and the model's response?",
    options: [
      "The model searches the internet directly",
      "The question is stored and the model is retrained on it",
      "The question is converted to an embedding, matched against a document index, and relevant chunks are retrieved and fed to the model",
      "The model generates multiple answers and picks the most confident one",
    ],
    correct: 2,
    explanation: "RAG works by: (1) converting the query to a vector embedding, (2) searching a knowledge base for the most semantically relevant documents, (3) feeding those documents alongside the original query to the model. The model generates its answer from that grounded context.",
  },
  {
    question: "You're evaluating an AI tool that gives confident, well-structured answers about your company's products. What's the most important question to ask?",
    options: [
      "How many parameters does the model have?",
      "Does it have access to your actual company documents and data, or is it working only from its training?",
      "Which AI company built the underlying model?",
      "Can it generate images as well as text?",
    ],
    correct: 1,
    explanation: "Confident, articulate answers don't indicate grounded answers. A model working from training data alone may hallucinate product details, policies, or pricing. Knowing whether RAG is in play tells you whether the answers come from your actual data or the model's imperfect memory.",
  },
];

export default function OnePercentEntry018() {
  const [tab, setTab] = useState("morning");
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUIZ[qIdx];

  function handleOption(i) {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correct) setScore((s) => s + 1);
  }

  function handleNext() {
    if (qIdx < QUIZ.length - 1) {
      setQIdx((n) => n + 1);
      setSelected(null);
    } else {
      setDone(true);
    }
  }

  function optionState(i) {
    if (selected === null) return null;
    if (i === q.correct) return "correct";
    if (i === selected) return "wrong";
    return null;
  }

  return (
    <div style={styles.shell}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,400;0,700;1,400&family=DM+Sans:ital,wght@0,400;0,600;0,700;1,400&display=swap"
        rel="stylesheet"
      />
      <div style={styles.header}>
        <div style={styles.entryNum}>ENTRY 018 · AI.3.1</div>
        <div style={styles.tag}>AI</div>
        <div style={styles.headline}>RAG (Retrieval-Augmented Generation)</div>
      </div>

      <div style={styles.tabBar}>
        {["morning", "midday", "quiz", "evening"].map((t) => (
          <button key={t} style={styles.tab(tab === t)} onClick={() => setTab(t)}>
            {t === "morning" ? "Morning" : t === "midday" ? "Midday" : t === "quiz" ? "Quiz" : "Evening"}
          </button>
        ))}
      </div>

      <div style={styles.body}>
        {tab === "morning" && (
          <>
            <div style={styles.hook}>
              "Your AI tool is only as current as its training data. RAG is how it reads the room."
            </div>

            <div>
              <div style={styles.sectionLabel}>The Concept</div>
              <p style={styles.para}>
                Retrieval-Augmented Generation — RAG — is a technique that gives AI language models access to external knowledge at the moment they generate a response. Instead of relying only on what was baked into the model during training, a RAG system retrieves relevant documents, files, or data from an outside source first, then uses that retrieved content to inform and ground the answer.
              </p>
              <p style={styles.para}>
                Here's the core problem RAG solves: large language models have a knowledge cutoff. They know what they were trained on, nothing more. Ask one about your company's internal policies, last quarter's financials, a contract signed three weeks ago, or a news event from this morning — and it either guesses or admits it doesn't know. Neither is useful when real decisions are on the line.
              </p>
              <p style={styles.para}>
                The mechanics: when a user submits a question, the system converts it into a mathematical representation (an embedding), searches a vector database of your actual documents for the most relevant chunks, and feeds those chunks into the model alongside the original question. The model then generates a response grounded in what was retrieved — not what it vaguely remembers from training.
              </p>
              <p style={styles.para}>
                The term RAG was coined in a 2020 paper by Patrick Lewis and colleagues at Meta AI, published at NeurIPS. The paper showed that models using retrieval produced responses that were more specific, more diverse, and more factual than models relying on parameters alone. In 2026, that research has scaled from a lab result to enterprise infrastructure.
              </p>
            </div>

            <div style={styles.card}>
              <div style={styles.sectionLabel}>Why It Matters Now</div>
              <p style={{ ...styles.para, marginBottom: 0 }}>
                By 2026, Gartner projects that over 70% of enterprise generative AI initiatives will require structured retrieval pipelines to address hallucination and compliance risk. RAG is no longer a feature — it's the architecture that makes AI safe to deploy at work. If your company is evaluating or building any AI tool, RAG is the mechanism that determines whether it gets facts from your actual data or confabulates them.
              </p>
            </div>

            <div style={styles.challengeBox}>
              <div style={styles.sectionLabel}>Morning Challenge</div>
              <div style={styles.challengeText}>
                Think of an AI tool you use at work or use for work research. Does it have access to your internal documents, your company's systems, or real-time information — or is it working only from its training data? If you're not sure, that's the gap. Ask the vendor or check the docs: is this RAG-powered, or is it a closed model with a cutoff date?
              </div>
            </div>
          </>
        )}

        {tab === "midday" && (
          <>
            <div style={styles.reframe}>
              A language model without retrieval is a very well-read colleague who's been offline for a year. RAG is how you bring them back up to speed before every conversation.
            </div>

            <div>
              <div style={styles.itwLabel}>In the Wild — Type B · Documented Pattern</div>
              <p style={styles.para}>
                A legal team at a mid-size enterprise deployed an AI assistant to help attorneys search case history and surface relevant precedents. Initial results were impressive in demos — the model was articulate, structured, and fast. But in production, the attorneys started catching errors: citations to cases that didn't exist, slightly wrong holdings, statutes described with confident inaccuracy.
              </p>
              <p style={styles.para}>
                The root cause was the model's training cutoff combined with no access to the firm's actual case database. It was generating answers from memory, not retrieval. When a jurisdiction updated its rules or a recent ruling changed the standard, the model didn't know. And crucially, it didn't know what it didn't know.
              </p>
              <p style={styles.para}>
                The firm rebuilt the system with a RAG pipeline: documents indexed, embeddings generated, retrieval grounded to actual case files. Hallucinations dropped significantly. More importantly, every answer now cited a retrievable source — attorneys could verify rather than trust. This is the pattern playing out across professional services in 2026: RAG isn't a performance upgrade, it's a trust architecture.
              </p>
            </div>

            <div style={styles.quoteBlock}>
              <div style={styles.quoteText}>
                "RAG is a way of improving LLM performance — in essence by blending the LLM process with a web search or other document look-up process to help LLMs stick to the facts."
              </div>
              <div style={styles.attribution}>— Ars Technica, on how RAG grounds AI responses in verifiable sources</div>
            </div>

            <div style={styles.nudge}>
              <div style={styles.nudgeLabel}>Midday Nudge</div>
              If you're evaluating an AI vendor or building a use case internally: ask one question before anything else — "Where does the answer come from?" A model that answers from its weights only is a different product than one with a RAG pipeline. The answer to that question tells you everything about reliability, data recency, and hallucination risk.
            </div>
          </>
        )}

        {tab === "quiz" && (
          <>
            {!done ? (
              <>
                <div style={{ ...styles.card, gap: 0 }}>
                  <div style={styles.sectionLabel}>
                    Question {qIdx + 1} of {QUIZ.length}
                  </div>
                  <div style={styles.quizQ}>{q.question}</div>
                  {q.options.map((opt, i) => (
                    <button
                      key={i}
                      style={styles.option(optionState(i))}
                      onClick={() => handleOption(i)}
                    >
                      {opt}
                    </button>
                  ))}
                  {selected !== null && (
                    <>
                      <div style={styles.explanation}>{q.explanation}</div>
                      <button style={styles.nextBtn} onClick={handleNext}>
                        {qIdx < QUIZ.length - 1 ? "Next →" : "See Results →"}
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div style={styles.card}>
                <div style={styles.sectionLabel}>Results</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: accent, marginBottom: 8 }}>
                  {score}/{QUIZ.length}
                </div>
                <div style={{ ...styles.para, marginBottom: 16 }}>
                  {score === 3
                    ? "Clean sweep. You've got a working model of RAG."
                    : score === 2
                    ? "Solid. One concept to revisit — check the explanations."
                    : "Good start. The mechanics of RAG are subtle — re-read the morning tab."}
                </div>
                <button
                  style={styles.nextBtn}
                  onClick={() => { setQIdx(0); setSelected(null); setScore(0); setDone(false); }}
                >
                  Retry
                </button>
              </div>
            )}
          </>
        )}

        {tab === "evening" && (
          <>
            <div style={styles.closing}>
              The AI tools your company trusts with real decisions — do they know your actual data, or are they working from memory?
            </div>

            <div style={styles.card}>
              <div style={styles.sectionLabel}>Sources</div>
              {[
                {
                  label: "Lewis et al. — RAG for Knowledge-Intensive NLP Tasks (NeurIPS 2020)",
                  url: "https://arxiv.org/abs/2005.11401",
                },
                {
                  label: "Gartner — Enterprise RAG and Hallucination Risk (2026)",
                  url: "https://www.techment.com/blogs/rag-architectures-enterprise-use-cases-2026/",
                },
                {
                  label: "Wikipedia / Ars Technica — Retrieval-Augmented Generation",
                  url: "https://en.wikipedia.org/wiki/Retrieval-augmented_generation",
                },
              ].map((s) => (
                <div key={s.label} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: accent, marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: "rgba(71,255,232,0.35)", wordBreak: "break-all" }}>{s.url}</div>
                </div>
              ))}
            </div>

            <div style={styles.footer}>
              ONE PERCENT · ENTRY 018 · AI.3.1 · mpgink.com
            </div>
          </>
        )}
      </div>
    </div>
  );
}
