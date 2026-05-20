import { useState, useEffect, useRef } from "react";
import { BookOpen, Lightbulb, Award } from 'lucide-react';

const entry = {
  entry: "017", editionId: "SC.3.1", category: "Sales Craft", categoryTag: "SALES CRAFT",
  concept: "Multi-Threading", accent: "#E8FF47", accentDim: "rgba(232,255,71,0.10)",
  morning: {
    hook: "Your best champion just went quiet. If they're your only thread into the deal, it's already over.",
    explanation_paragraphs: [
      "Multi-threading is the practice of building relationships with multiple stakeholders inside a target account simultaneously — not waiting until your champion introduces you, and not relying on one person to carry your deal through an organization you can't see into.",
      "The mechanism is simple: enterprise buying decisions are no longer made by one person. Gartner research consistently shows that complex B2B deals involve 6–10 decision-makers, each with different priorities, different veto power, and different timelines. Your champion understands the problem. The economic buyer controls the budget. The technical evaluator has to sign off on risk. The end user has to actually use the thing. None of them automatically agrees with each other.",
      "Single-threading — connecting with only one contact and hoping they sell internally for you — puts the entire deal on a single point of failure. If they go dark, get promoted, leave the company, or simply don't have enough internal influence, the deal stalls or dies. And according to LinkedIn data, 78% of sales reps are still doing it this way.",
      "Multi-threading isn't about spamming an account. It's about building a coalition. The goal is that by the time you're in negotiation, multiple people inside that organization have already concluded they need what you're selling — and are advocating for it without you in the room."
    ],
    why_today: "Buying committees have grown significantly over the past decade and show no signs of shrinking. In 2026, the average enterprise deal involves more than 11 stakeholders. The reps closing at the highest rates aren't the most charming — they're the ones who've built the widest internal footprint before the final call.",
    morning_challenge: "Pull up one active deal where you have only one contact. Map the buying committee: who's the economic buyer, the technical evaluator, the end user, the executive sponsor? Name them specifically. If you don't know who they are, that's the gap. Ask your champion today: 'Who else will weigh in on this decision?'"
  },
  midday: {
    reframe: "Your champion isn't selling your deal internally. They're hoping the deal sells itself. Multi-threading is how you stop relying on hope.",
    itw_label: "IN THE WILD — TYPE B · DOCUMENTED PATTERN",
    itw_paragraphs: [
      "A mid-market AE at a SaaS company had spent four months building a strong relationship with a Director of Operations at a target account. The director was bought in. She had internal credibility, used the product in a sandbox, and kept saying the deal was on track.",
      "Then she left the company. New role, better offer, two weeks notice. The AE had no other contacts at the account. The incoming Director had no context, no relationship, no reason to prioritize an evaluation his predecessor had started. The deal reset to zero.",
      "This is the most common way enterprise deals die — not competition, not price, not product gaps. Contact attrition. According to LinkedIn Workforce data, average tenure in a B2B tech role is 2.5 to 3 years. In a six-month enterprise sales cycle, the probability of your champion changing roles before you close is not trivial. Multi-threading isn't just a win-rate strategy. It's deal insurance."
    ],
    quote: "The goal is to know more about the company than they know about themselves.",
    attribution: "Semir Jahic, CEO of Salesmotion, on the standard for multi-threaded account research, 2026",
    midday_nudge: "On your next discovery call: ask 'Who else will be involved in evaluating and approving this?' then ask your champion to make the introduction. You can use AI to map the org before the call — run the company name through LinkedIn Sales Navigator or ask an AI tool to surface likely stakeholder roles by function."
  },
  quiz: [
    { question: "According to Gartner research, approximately how many stakeholders are involved in a complex B2B buying decision?", options: ["2–3 decision-makers", "6–10 decision-makers", "1–2 economic buyers", "It depends entirely on company size"], correct: 1, explanation: "Gartner consistently cites 6–10 stakeholders in complex B2B deals, with the number growing over the past decade. Enterprise deals can involve 11 or more." },
    { question: "What is the primary risk of single-threading a deal?", options: ["It creates too many competing relationships to manage", "It makes the rep look like they don't understand the org", "The entire deal depends on one person who can go dark, leave, or lack influence", "It slows down the sales cycle by focusing on one stakeholder"], correct: 2, explanation: "Single-threading creates a single point of failure. If your champion goes silent, changes roles, or loses internal influence, the deal stalls — and you have no backup." },
    { question: "You have one active deal with a single contact. Your champion seems fully bought in. What's the most effective next move?", options: ["Wait — don't risk the relationship by pushing for more contacts", "Go around your champion and reach out to executives directly", "Ask your champion: 'Who else will be involved in this decision?' and request introductions", "Escalate through your own executive sponsor first"], correct: 2, explanation: "The champion introduction is the right path — it positions multi-threading as collaborative, not threatening. Going around them or waiting both carry higher risk than asking directly." }
  ],
  closing: "On your current pipeline: which deals survive if your champion disappears tomorrow?",
  sources: [
    { label: "Gartner — B2B Buying Behavior Research", detail: "Gartner research on buying committee size, multithreaded engagement strategies, and revenue growth projections for organizations that adopt multi-threading.", url: "https://www.gartner.com/en/articles/why-multithreaded-engagements-are-the-secret-to-accelerating-revenue-growth" },
    { label: "Aviso — Multi-Threading Win Rate Analysis", detail: "Aviso's analysis showing multi-threaded conversations increase deal win odds by 42% and reduce sales cycle length by 53–78 days depending on deal size.", url: "https://www.aviso.com/blog/4-tips-for-multi-threaded-conversations-to-boost-win-rate" },
    { label: "LinkedIn / Salesmotion — Stakeholder Data", detail: "LinkedIn data showing 78% of sales reps are single-threaded in most deals. Salesmotion analysis: single-threaded deals close at 5%, multi-threaded at 30%.", url: "https://salesmotion.io/blog/multi-threading-sales-strategy" }
  ]
};

const css = (accent) => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{background:#0A0A0A;font-family:'Inter',sans-serif;}
  @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  @keyframes popIn{0%{transform:scale(0.85);opacity:0}70%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
  @keyframes pulseBorder{0%,100%{box-shadow:0 0 0 0 ${accent}44}50%{box-shadow:0 0 0 8px ${accent}11}}
  .fade-in{animation:fadeIn 0.28s ease forwards}
  .tab-btn{background:none;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-size:11px;font-weight:500;letter-spacing:0.08em;padding:10px 14px;color:#555;transition:color 0.2s;border-bottom:2px solid transparent;display:flex;align-items:center;gap:5px}
  .tab-btn:hover{color:#aaa}.tab-btn.active{color:${accent};border-bottom-color:${accent}}
  .next-tab-btn{display:block;width:100%;margin-top:32px;padding:14px 20px;background:${accent};color:#0A0A0A;border:none;border-radius:4px;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;letter-spacing:0.08em;cursor:pointer;text-align:center;transition:opacity 0.2s}
  .next-tab-btn:hover{opacity:0.85}
  .quiz-opt{background:#111;border:1px solid #222;border-radius:4px;padding:14px 16px;cursor:pointer;font-family:'Inter',sans-serif;font-size:13px;color:#999;margin-bottom:8px;transition:all 0.18s;text-align:left;width:100%;line-height:1.6}
  .quiz-opt:hover:not(:disabled){border-color:${accent}44;color:#ddd;background:#141414}
  .quiz-opt.selected{border-color:${accent};background:${accent}22;color:#eee}
  .quiz-opt.correct{border-color:#4ade80;color:#4ade80;background:#4ade8011}
  .quiz-opt.wrong{border-color:#f87171;color:#f87171;background:#f8717111}
  .submit-btn{background:${accent};color:#0A0A0A;border:none;padding:12px 24px;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;letter-spacing:0.08em;cursor:pointer;border-radius:3px;margin-top:8px}
  .submit-btn:disabled{opacity:0.3;cursor:not-allowed}
  .score-box{border-radius:6px;padding:28px 20px;text-align:center;margin:24px 0;animation:popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards}
  .score-perfect{background:${accent}0f;animation:popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards,pulseBorder 1.8s ease-in-out 0.4s 3}
  .score-close{background:#1a1a1a}.score-low{background:#111}
  .src-toggle{background:none;border:1px solid #222;padding:7px 14px;font-family:'Inter',sans-serif;font-size:11px;font-weight:500;color:#555;cursor:pointer;border-radius:3px;letter-spacing:0.08em}
  .src-toggle:hover{color:#999;border-color:#444}
  .src-link{color:${accent};text-decoration:none;font-size:12px;display:block;margin-bottom:4px;font-family:'Inter',sans-serif;font-weight:500}
  .src-link:hover{text-decoration:underline}
`;

const S = {
  root:{background:"#0A0A0A",minHeight:"100vh",fontFamily:"'Inter',sans-serif",color:"#fff",maxWidth:720,margin:"0 auto",paddingBottom:80},
  header:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 24px 12px",borderBottom:"1px solid #141414"},
  hL:{display:"flex",alignItems:"center",gap:10},hR:{display:"flex",alignItems:"center",gap:12},
  logo:{fontSize:11,letterSpacing:"0.15em",color:"#fff",fontWeight:600},
  entryBadge:{fontSize:10,color:"#333",letterSpacing:"0.1em",fontWeight:500},
  streak:{fontSize:11,color:"#aaa",fontWeight:500},
  badge:{fontSize:9,letterSpacing:"0.12em",padding:"4px 9px",borderRadius:3,fontWeight:600},
  datebar:{fontSize:10,color:"#333",letterSpacing:"0.1em",padding:"8px 24px",borderBottom:"1px solid #0f0f0f",fontWeight:500},
  conceptBlock:{padding:"28px 24px 0"},
  conceptName:{fontSize:32,fontWeight:600,color:"#fff",letterSpacing:"-0.02em",lineHeight:1.1},
  tabRow:{display:"flex",borderBottom:"1px solid #141414",marginTop:20,padding:"0 12px",gap:4},
  content:{padding:"24px 24px 0"},
  label:{fontSize:10,letterSpacing:"0.12em",marginBottom:16,fontWeight:600,textTransform:"uppercase"},
  hook:{fontSize:20,color:"#fff",lineHeight:1.5,fontWeight:400,marginBottom:20,letterSpacing:"-0.01em"},
  srcSection:{padding:"28px 24px 48px"},srcDivider:{borderTop:"1px solid #141414",marginBottom:18},
  srcList:{marginTop:16,display:"flex",flexDirection:"column",gap:16},srcItem:{},
  srcDetail:{fontSize:12,color:"#444",lineHeight:1.6},
  srcVerified:{fontSize:10,color:"#2a2a2a",letterSpacing:"0.1em",marginTop:8,paddingTop:12,borderTop:"1px solid #141414",fontWeight:500},
};

export default function OnePercent() {
  const accent = entry.accent;
  const [tab, setTab] = useState("morning");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showSrc, setShowSrc] = useState(false);
  const scoreRef = useRef(null);
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [tab]);

  const canSubmit = Object.keys(answers).length === entry.quiz.length;
  const score = submitted ? entry.quiz.filter((q, i) => answers[i] === q.correct).length : 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
    setTimeout(() => scoreRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 150);
    if (score === 3) runStarburst();
    else if (score === 2) runArc();
  };

  const runStarburst = () => {
    const canvas = document.getElementById("celebrate-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    canvas.style.display = "block";
    const cx = canvas.width / 2, cy = canvas.height / 2;
    const particles = Array.from({ length: 60 }, () => ({
      x: cx, y: cy,
      vx: (Math.random() - 0.5) * 14, vy: (Math.random() - 0.8) * 14,
      r: Math.random() * 5 + 2,
      color: [accent, "#fff", "#ffff00", "#ff69b4"][Math.floor(Math.random() * 4)],
      alpha: 1, gravity: 0.3
    }));
    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const rays = 16, maxR = Math.min(canvas.width, canvas.height) * 0.45;
      const prog = Math.min(frame / 60, 1);
      for (let i = 0; i < rays; i++) {
        const angle = (i / rays) * Math.PI * 2;
        const len = maxR * prog;
        ctx.save(); ctx.globalAlpha = (1 - prog) * 0.6;
        ctx.beginPath(); ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
        const grad = ctx.createLinearGradient(cx, cy, cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
        grad.addColorStop(0, accent); grad.addColorStop(1, "transparent");
        ctx.strokeStyle = grad; ctx.lineWidth = 3; ctx.lineCap = "round";
        ctx.stroke(); ctx.restore();
      }
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += p.gravity; p.alpha -= 0.012;
        if (p.alpha <= 0) return;
        ctx.save(); ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color; ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      });
      if (frame === 50) {
        ctx.save(); ctx.globalAlpha = 0; ctx.font = "bold 28px Inter";
        ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        let a = 0;
        const fadeText = () => { a += 0.06; ctx.clearRect(cx - 120, cy - 30, 240, 60); ctx.globalAlpha = Math.min(a, 1); ctx.fillText("LOCKED IN 🔒", cx, cy); if (a < 1) requestAnimationFrame(fadeText); };
        ctx.restore(); fadeText();
      }
      frame++;
      if (frame < 140) requestAnimationFrame(draw);
      else setTimeout(() => { canvas.style.display = "none"; }, 300);
    };
    requestAnimationFrame(draw);
  };

  const runArc = () => {
    const canvas = document.getElementById("celebrate-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    canvas.style.display = "block";
    const cx = canvas.width / 2, cy = canvas.height / 2, r = 60;
    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const prog = Math.min(frame / 50, 1);
      ctx.save(); ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * 2 / 3) * prog);
      ctx.strokeStyle = accent; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.font = "bold 20px Inter"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("2/3", cx, cy); ctx.restore();
      frame++;
      if (frame < 80) requestAnimationFrame(draw);
      else setTimeout(() => { canvas.style.display = "none"; }, 300);
    };
    requestAnimationFrame(draw);
  };

  return (
    <>
      <style>{css(accent)}</style>
      <canvas id="celebrate-canvas" style={{ display: "none", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 9999 }} />
      <div style={S.root}>
        <div style={S.header}>
          <div style={S.hL}>
            <span style={S.logo}>ONE PERCENT</span>
            <span style={S.entryBadge}>#017</span>
          </div>
          <div style={S.hR}>
            <span style={S.streak}>🔥 —</span>
            <span style={{ ...S.badge, background: `${accent}22`, color: accent }}>{entry.categoryTag}</span>
          </div>
        </div>
        <div style={S.datebar}>{entry.editionId} · {entry.concept}</div>
        <div style={S.conceptBlock}>
          <div style={S.conceptName}>{entry.concept}</div>
        </div>
        <div style={S.tabRow}>
          {[["morning", BookOpen, "MORNING"], ["midday", Lightbulb, "MIDDAY"], ["evening", Award, "EVENING"]].map(([id, Icon, label]) => (
            <button key={id} className={`tab-btn${tab === id ? " active" : ""}`} onClick={() => setTab(id)}>
              <Icon size={13} />{label}
            </button>
          ))}
        </div>

        {tab === "morning" && (
          <div style={S.content} className="fade-in">
            <div style={S.label}>MORNING READ</div>
            <div style={S.hook}>{entry.morning.hook}</div>
            {entry.morning.explanation_paragraphs.map((p, i) => (
              <p key={i} style={{ fontSize: 15, color: "#bbb", lineHeight: 1.8, marginBottom: 16 }}>{p}</p>
            ))}
            <div style={{ background: `${accent}0d`, border: `1px solid ${accent}22`, borderRadius: 4, padding: "18px 20px", margin: "24px 0" }}>
              <div style={{ ...S.label, color: accent, marginBottom: 10 }}>WHY TODAY</div>
              <p style={{ fontSize: 14, color: "#bbb", lineHeight: 1.7 }}>{entry.morning.why_today}</p>
            </div>
            <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 4, padding: "18px 20px", marginBottom: 8 }}>
              <div style={{ ...S.label, marginBottom: 10 }}>MORNING CHALLENGE</div>
              <p style={{ fontSize: 14, color: "#999", lineHeight: 1.8 }}>{entry.morning.morning_challenge}</p>
            </div>
            <button className="next-tab-btn" onClick={() => setTab("midday")}>MIDDAY CHECK-IN →</button>
          </div>
        )}

        {tab === "midday" && (
          <div style={S.content} className="fade-in">
            <div style={S.label}>MIDDAY REFRAME</div>
            <div style={{ borderLeft: `3px solid ${accent}`, paddingLeft: 18, marginBottom: 28, fontSize: 17, color: "#fff", fontWeight: 500, lineHeight: 1.6 }}>{entry.midday.reframe}</div>
            <div style={S.label}>{entry.midday.itw_label}</div>
            {entry.midday.itw_paragraphs.map((p, i) => (
              <p key={i} style={{ fontSize: 15, color: "#bbb", lineHeight: 1.8, marginBottom: 14 }}>{p}</p>
            ))}
            <div style={{ border: `1px solid ${accent}40`, borderRadius: 4, padding: "18px 20px", margin: "24px 0" }}>
              <p style={{ fontSize: 15, color: "#ccc", lineHeight: 1.7, fontStyle: "italic", marginBottom: 10 }}>"{entry.midday.quote}"</p>
              <p style={{ fontSize: 12, color: "#555" }}>— {entry.midday.attribution}</p>
            </div>
            <p style={{ fontSize: 14, color: "#777", lineHeight: 1.8 }}>{entry.midday.midday_nudge}</p>
            <button className="next-tab-btn" onClick={() => setTab("evening")}>EVENING QUIZ →</button>
          </div>
        )}

        {tab === "evening" && (
          <div style={S.content} className="fade-in">
            <div style={S.label}>EVENING QUIZ</div>
            {entry.quiz.map((q, qi) => (
              <div key={qi} style={{ marginBottom: 28 }}>
                <p style={{ fontSize: 14, color: "#ccc", lineHeight: 1.7, fontWeight: 400, marginBottom: 12 }}>{qi + 1}. {q.question}</p>
                {q.options.map((opt, oi) => {
                  let cls = "quiz-opt";
                  if (answers[qi] === oi) cls += submitted ? (oi === q.correct ? " correct" : " wrong") : " selected";
                  else if (submitted && oi === q.correct) cls += " correct";
                  return (
                    <button key={oi} className={cls} disabled={submitted} onClick={() => !submitted && setAnswers(a => ({ ...a, [qi]: oi }))}>{opt}</button>
                  );
                })}
                {submitted && <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7, marginTop: 8 }}>{q.explanation}</p>}
              </div>
            ))}
            {!submitted && (
              <button className="submit-btn" disabled={!canSubmit} onClick={handleSubmit}>SUBMIT</button>
            )}
            {submitted && (
              <div ref={scoreRef} className={`score-box ${score === 3 ? "score-perfect" : score === 2 ? "score-close" : "score-low"}`}
                style={{ border: `1px solid ${score === 3 ? accent : score === 2 ? "#444" : "#333"}` }}>
                <div style={{ fontSize: 32, fontWeight: 600, color: score === 3 ? accent : "#fff", marginBottom: 6 }}>{score}/3</div>
                <div style={{ fontSize: 11, letterSpacing: "0.15em", color: score === 3 ? accent : "#888", marginBottom: 8 }}>
                  {score === 3 ? "PERFECT SCORE" : score === 2 ? "ALMOST THERE" : score === 1 ? "KEEP GOING" : "REVIEW & RETRY"}
                </div>
                <div style={{ fontSize: 13, color: "#555" }}>
                  {score === 3 ? "You've got this one locked in." : score === 2 ? "One away. Come back and get that third." : "The concepts will stick with more reps. Come back."}
                </div>
              </div>
            )}
            {submitted && (
              <div style={{ marginTop: 24, padding: "18px 0", borderTop: "1px solid #141414" }}>
                <p style={{ fontSize: 14, color: "#aaa", fontStyle: "italic", lineHeight: 1.8 }}>{entry.closing}</p>
              </div>
            )}
          </div>
        )}

        <div style={S.srcSection}>
          <div style={S.srcDivider} />
          <button className="src-toggle" onClick={() => setShowSrc(s => !s)}>{showSrc ? "HIDE SOURCES" : "VIEW SOURCES"}</button>
          {showSrc && (
            <div style={S.srcList}>
              {entry.sources.map((s, i) => (
                <div key={i} style={S.srcItem}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="src-link">{s.label}</a>
                  <div style={S.srcDetail}>{s.detail}</div>
                </div>
              ))}
              <div style={S.srcVerified}>SOURCES VERIFIED · ENTRY {entry.entry}</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
