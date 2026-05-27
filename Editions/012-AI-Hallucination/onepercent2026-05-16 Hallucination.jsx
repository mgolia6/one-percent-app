import { useState, useEffect, useRef } from "react";
// Entry 012 | AI.2.2 | Hallucination | v1.18 retrofit

const ACCENT = "#47FFE8";
const ACCENT_DIM = "rgba(71,255,232,0.10)";

const data = {
  category: "AI", categoryTag: "AI", concept: "Hallucination",
  editionId: "AI.2.2", entry: "012",
  morning: {
    hook: "The model isn't lying. It doesn't know how. That's exactly what makes it dangerous.",
    explanation_paragraphs: [
      "LLMs don't retrieve facts from a database. They predict the next token based on statistical patterns learned from training data. When the model encounters a gap — a question where training data is thin, conflicting, or absent — it doesn't stop. It generates the most statistically probable continuation.",
      "That continuation is often grammatically perfect, confidently stated, and factually wrong. Meta named this during the 2022 BlenderBot release: hallucinations are 'confident statements that are not true.'",
      "The academic community calls it confabulation — borrowed from neuropsychology, where patients with memory damage fill narrative gaps with invented detail they genuinely believe is real. The machine version works the same way: it isn't guessing in the sense of knowing it might be wrong. It's producing the output that fits the pattern.",
      "The confidence is structural, not epistemic. The model has no internal mechanism to distinguish between what it knows and what it's fabricating. That's the trap.",
    ],
    why_today: "Every AI output you trust without verification is a hallucination you didn't catch. The model has no way to flag what it doesn't know — because it doesn't know what it doesn't know.",
    morning_challenge: "Pick one AI-assisted output you've used or sent in the last week — a summary, a draft, a data point, a cited fact.\n\nAsk:\n- Did I verify the specific claim, or did I trust the confidence?\n- Was there a citation, a number, or a named source in there? Did I check it?\n- If this output was wrong, what would the blast radius be?\n\nThen run this prompt on your next AI research task:\n\n\"You are a fact-checking layer. Flag every specific claim, name, citation, number, or stated fact that could be hallucinated, and explain why each needs external verification before I use it.\"\n\nThis is the mitigation workflow: use AI to interrogate AI.",
  },
  midday: {
    reframe: "The attorney didn't think he was doing anything wrong. That's the actual lesson.",
    itw_paragraphs: [
      "In early 2023, attorney Steven Schwartz used ChatGPT to research a motion in a personal injury case against Avianca. ChatGPT returned six case citations — complete with procedural histories, quoted passages, and named judges as authors. All six were entirely fabricated.",
      "When opposing counsel flagged they couldn't locate the cases, Schwartz asked ChatGPT to confirm they were real. ChatGPT confirmed they were. Schwartz submitted them again. When Judge P. Kevin Castel ordered copies of the opinions, what came back was — in the court's own word — 'gibberish.' The six fake opinions had been attributed to real judges who had no connection to the invented cases.",
      "Judge Castel sanctioned the attorneys $5,000 and required corrective letters to every judge named in the fabricated rulings. The model produced exactly what it was asked to produce. The attorney assumed the output was grounded. Nobody checked.",
    ],
    quote: "I just was not thinking that the case could be fabricated, so I was not looking at it from that point of view.",
    attribution: "Steven Schwartz, testimony — Mata v. Avianca, Inc., 678 F.Supp.3d 443 (S.D.N.Y. 2023), Tr. at 35",
    midday_nudge: "Where in your current workflow are you accepting AI output with the same assumption Schwartz had — that the model couldn't possibly be making it up?",
  },
  quiz: [
    {
      question: "Why do LLMs produce hallucinations even when they appear confident? What is the mechanical cause?",
      options: ["The model intentionally fills gaps with plausible-sounding content to avoid admitting it lacks information", "LLMs are knowledge retrieval systems, and hallucinations occur when the database hasn't been updated recently", "LLMs predict the next token based on statistical patterns in training data — when the signal is weak or absent, the model generates the most probable continuation regardless of whether it is factually grounded", "Hallucinations occur primarily due to insufficient training data volume — larger models hallucinate less"],
      correct: 2,
      explanation: "LLMs are not knowledge retrieval systems. They generate token sequences by predicting what comes next based on learned patterns. A weak training signal doesn't produce a refusal — it produces the most statistically likely output anyway. This is why the model presents fabrications with the same confidence as accurate statements.",
    },
    {
      question: "In Mata v. Avianca (2023), Schwartz asked ChatGPT to confirm the cases were real and ChatGPT confirmed they were. What does this illustrate?",
      options: ["ChatGPT intentionally misled the attorney to avoid appearing wrong", "The model confirmed the citations because they were stored incorrectly in its database", "Asking the model that generated a hallucination to verify it is not a valid mitigation strategy — the model produces probable continuations, including confirmations, not independent factual checks", "The result demonstrates a known bug in early ChatGPT versions that has since been corrected"],
      correct: 2,
      explanation: "When Schwartz asked ChatGPT to confirm the cases existed, the model generated a confirmation — because that was the statistically probable response, not because it had checked an external source. This is the closed-loop trap: the model that produced the hallucination cannot serve as the ground truth.",
    },
    {
      question: "You're using AI to draft patient-facing FAQs about drug interactions. The output is clear and confident. What is the correct mitigation before publishing?",
      options: ["Run the same prompt twice — if both answers agree, the information is likely accurate", "Every specific clinical claim must be verified against authoritative medical sources by a qualified reviewer; the AI draft is structure, not a factual source", "Use a larger, more recent AI model — newer models have significantly lower hallucination rates", "Add a disclaimer stating it was AI-generated, which transfers responsibility to the reader"],
      correct: 1,
      explanation: "Running the same prompt twice doesn't catch hallucinations — consistent outputs can be consistently wrong. Disclaimers don't make fabricated clinical information safe. Newer models still hallucinate. The only reliable mitigation is external verification by a domain expert against authoritative sources.",
    },
  ],
  closing: "Where in your work are you accepting confident AI output as verified fact — and what would it cost if it's wrong?",
  sources: [
    { label: "Ji et al. — Survey of Hallucination in Natural Language Generation, ACM Computing Surveys 55(12), 2023", detail: "Landmark survey. Covers definition, mechanical causes, and mitigation. Open access at arXiv.", url: "https://arxiv.org/abs/2202.03629" },
    { label: "Hallucination (artificial intelligence) — Wikipedia (primary: Meta/BlenderBot 2022)", detail: "Documents Meta's 2022 definition — 'confident statements that are not true.'", url: "https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)" },
    { label: "Mata v. Avianca, Inc., 678 F.Supp.3d 443 (S.D.N.Y. June 22, 2023)", detail: "Full court ruling. Six fabricated AI citations, $5,000 sanction, and Schwartz's testimony verbatim.", url: "https://law.justia.com/cases/federal/district-courts/new-york/nysdce/1:2022cv01461/575368/54/" },
  ],
};

function Celebration({ score, accent }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  useEffect(() => {
    if (score < 2) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width = window.innerWidth;
    const H = canvas.height = window.innerHeight;
    const cx = W / 2, cy = H / 2;
    if (score === 3) {
      const sparks = [];
      let frame = 0;
      function drawBrain(progress, alpha) {
        ctx.save(); ctx.globalAlpha = alpha;
        ctx.translate(cx, cy - 60);
        const scale = 0.9 + Math.sin(progress * Math.PI * 2) * 0.06;
        ctx.scale(scale, scale);
        ctx.shadowColor = accent; ctx.shadowBlur = 20 + Math.sin(progress * Math.PI * 4) * 10;
        ctx.strokeStyle = accent; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(0, -50); ctx.bezierCurveTo(-80,-55,-90,-20,-70,10); ctx.bezierCurveTo(-60,30,-30,40,0,35); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-50,-30); ctx.bezierCurveTo(-60,-10,-55,10,-40,20); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-25,-45); ctx.bezierCurveTo(-35,-25,-30,0,-20,10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0,-50); ctx.bezierCurveTo(80,-55,90,-20,70,10); ctx.bezierCurveTo(60,30,30,40,0,35); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(50,-30); ctx.bezierCurveTo(60,-10,55,10,40,20); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(25,-45); ctx.bezierCurveTo(35,-25,30,0,20,10); ctx.stroke();
        if (progress > 0.4) {
          const la = Math.min(1, (progress - 0.4) / 0.2);
          ctx.globalAlpha = alpha * la; ctx.shadowBlur = 15;
          ctx.beginPath(); ctx.roundRect(-14,55,28,22,4); ctx.fillStyle = accent; ctx.fill();
          ctx.beginPath(); ctx.arc(0,50,10,Math.PI,0); ctx.lineWidth = 3; ctx.strokeStyle = accent; ctx.stroke();
          ctx.beginPath(); ctx.arc(0,63,4,0,Math.PI*2); ctx.fillStyle = "#0A0A0A"; ctx.fill();
        }
        ctx.restore();
      }
      function spawnFW() {
        const a = Math.random()*Math.PI*2, d = 80+Math.random()*120;
        const x = cx+Math.cos(a)*d, y = (cy-60)+Math.sin(a)*d;
        const colors = [accent,"#ffffff","#ffff00","#ff69b4","#00ffaa","#ff6644"];
        const c = colors[Math.floor(Math.random()*colors.length)];
        for (let i = 0; i < 14; i++) {
          const ang = (i/14)*Math.PI*2, sp = 2+Math.random()*3;
          sparks.push({x,y,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp,color:c,life:1,decay:0.018+Math.random()*0.018,size:2+Math.random()*2});
        }
      }
      function tick() {
        ctx.clearRect(0,0,W,H);
        const fa = frame > 120 ? 1-(frame-120)/40 : 1;
        drawBrain(Math.min(1,frame/80), fa);
        if (frame >= 40 && frame < 120 && frame % 12 === 0) spawnFW();
        for (let i = sparks.length-1; i >= 0; i--) {
          const s = sparks[i]; s.x+=s.vx; s.y+=s.vy; s.vy+=0.05; s.life-=s.decay;
          if (s.life <= 0) { sparks.splice(i,1); continue; }
          ctx.save(); ctx.globalAlpha=s.life*fa; ctx.fillStyle=s.color; ctx.shadowColor=s.color; ctx.shadowBlur=6;
          ctx.beginPath(); ctx.arc(s.x,s.y,s.size*s.life,0,Math.PI*2); ctx.fill(); ctx.restore();
        }
        if (frame > 70) {
          const ta = Math.min(1,(frame-70)/20)*fa;
          ctx.save(); ctx.globalAlpha=ta; ctx.fillStyle=accent; ctx.shadowColor=accent; ctx.shadowBlur=20;
          ctx.font="bold 28px 'DM Mono',monospace"; ctx.textAlign="center"; ctx.fillText("LOCKED IN 🔒",cx,cy+80); ctx.restore();
        }
        frame++;
        if (frame < 160) animRef.current = requestAnimationFrame(tick);
      }
      animRef.current = requestAnimationFrame(tick);
    } else {
      let frame = 0;
      function tickArc() {
        ctx.clearRect(0,0,W,H);
        const fa = frame > 60 ? 1-(frame-60)/20 : 1;
        const pr = Math.min(1,frame/50);
        ctx.save(); ctx.translate(cx,cy); ctx.globalAlpha=fa;
        ctx.beginPath(); ctx.arc(0,0,55,0,Math.PI*2); ctx.strokeStyle="#2a2a2a"; ctx.lineWidth=6; ctx.stroke();
        ctx.beginPath(); ctx.arc(0,0,55,-Math.PI/2,-Math.PI/2+(Math.PI*4/3)*pr); ctx.strokeStyle=accent; ctx.lineWidth=6; ctx.lineCap="round"; ctx.shadowColor=accent; ctx.shadowBlur=10; ctx.stroke();
        ctx.fillStyle="#fff"; ctx.font="bold 24px 'DM Mono',monospace"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText("2/3",0,0);
        ctx.restore();
        frame++;
        if (frame < 80) animRef.current = requestAnimationFrame(tickArc);
      }
      animRef.current = requestAnimationFrame(tickArc);
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [score]);
  if (score < 2) return null;
  return <canvas ref={canvasRef} style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:9999}} />;
}

export default function OnePct() {
  const [tab, setTab] = useState("morning");
  const [streak, setStreak] = useState(1);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [srcOpen, setSrcOpen] = useState(false);
  const scoreRef = useRef(null);
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [tab]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = css(ACCENT);
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    try {
      const today = new Date().toDateString();
      const last = localStorage.getItem("op_last");
      const s = parseInt(localStorage.getItem("op_streak") || "0");
      const yesterday = new Date(Date.now()-86400000).toDateString();
      if (last === today) { setStreak(s||1); }
      else if (last === yesterday) { const ns=s+1; setStreak(ns); localStorage.setItem("op_streak",ns); localStorage.setItem("op_last",today); }
      else { setStreak(1); localStorage.setItem("op_streak",1); localStorage.setItem("op_last",today); }
    } catch(e) { setStreak(1); }
  }, []);

  const allAnswered = data.quiz.every((_,i) => answers[i] !== undefined);
  const score = data.quiz.filter((q,i) => answers[i] === q.correct).length;

  const handleSubmit = () => {
    if (!allAnswered) return;
    setSubmitted(true);
    if (score >= 2) setShowCelebration(true);
    setTimeout(() => scoreRef.current?.scrollIntoView({behavior:"smooth",block:"center"}), 150);
  };

  const tabs = [{id:"morning",label:"☀ MORNING"},{id:"midday",label:"☁ MIDDAY"},{id:"evening",label:"🔥 EVENING"}];

  return (
    <div style={S.root}>
      {showCelebration && <Celebration score={score} accent={ACCENT} />}
      <div style={S.header}>
        <div style={S.hL}><span style={S.logo}>ONE PERCENT</span><span style={S.entryBadge}>#{data.entry}</span></div>
        <div style={S.hR}><span style={S.streak}>🔥 {streak}</span><span style={{...S.badge,background:ACCENT,color:"#0A0A0A"}}>{data.categoryTag}</span></div>
      </div>
      <div style={S.datebar}>{data.editionId} · {data.concept}</div>
      <div style={S.conceptBlock}><div style={S.conceptName}>{data.concept}</div><div style={{width:40,height:3,background:ACCENT,marginTop:12}}/></div>
      <div style={S.tabRow}>{tabs.map(t=><button key={t.id} className={`tab-btn${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>)}</div>
      <div style={S.content} className="fade-in" key={tab}>
        {tab==="morning" && <MorningTab d={data.morning} onNext={()=>setTab("midday")}/>}
        {tab==="midday" && <MiddayTab d={data.midday} onNext={()=>setTab("evening")}/>}
        {tab==="evening" && <EveningTab quiz={data.quiz} answers={answers} submitted={submitted} allAnswered={allAnswered} score={score} closing={data.closing} scoreRef={scoreRef} onAnswer={(qi,ai)=>{if(!submitted)setAnswers(p=>({...p,[qi]:ai}));}} onSubmit={handleSubmit}/>}
      </div>
      <div style={S.srcSection}>
        <div style={S.srcDivider}/>
        <button className="src-toggle" onClick={()=>setSrcOpen(!srcOpen)}>{srcOpen?"▲":"▼"} SOURCES</button>
        {srcOpen && <div style={S.srcList}>{data.sources.map((s,i)=><div key={i} style={S.srcItem}><a href={s.url} target="_blank" rel="noopener noreferrer" className="src-link">{s.label}</a><div style={S.srcDetail}>{s.detail}</div></div>)}<div style={S.srcVerified}>✓ ALL SOURCES VERIFIED · ENTRY 012 · AI.2.2</div></div>}
      </div>
    </div>
  );
}

function MorningTab({d,onNext}) {
  return (<div>
    <div style={{...S.label,color:ACCENT}}>☀ MORNING BRIEF</div>
    <div style={S.hook}>{d.hook}</div>
    <div style={{marginBottom:20}}>{d.explanation_paragraphs.map((p,i)=><p key={i} style={{fontSize:13,color:"#888",lineHeight:1.7,marginBottom:i<d.explanation_paragraphs.length-1?14:0}}>{p}</p>)}</div>
    <div style={{background:ACCENT_DIM,border:`1px solid rgba(71,255,232,0.2)`,borderRadius:4,padding:"16px 18px",marginBottom:20}}>
      <div style={{...S.label,color:ACCENT,marginBottom:10}}>WHY TODAY</div>
      <div style={{fontSize:13,color:"#bbb",lineHeight:1.65}}>{d.why_today}</div>
    </div>
    <div style={{borderLeft:`3px solid ${ACCENT}`,paddingLeft:16,marginBottom:24}}>
      <div style={{...S.label,color:ACCENT,marginBottom:10}}>⚡ MORNING CHALLENGE</div>
      <div style={{fontSize:13,color:"#888",lineHeight:1.75,whiteSpace:"pre-wrap"}}>{d.morning_challenge}</div>
    </div>
    <button className="next-tab-btn" onClick={onNext}>☁ MIDDAY →</button>
  </div>);
}

function MiddayTab({d,onNext}) {
  return (<div>
    <div style={{...S.label,color:ACCENT}}>☁ MIDDAY REFRAME</div>
    <div style={{borderLeft:`3px solid ${ACCENT}`,paddingLeft:16,marginBottom:24}}><div style={{fontSize:16,color:"#fff",lineHeight:1.5}}>{d.reframe}</div></div>
    <div style={{...S.label,color:"#555",marginBottom:14}}>👁 IN THE WILD — TYPE A · MATA v. AVIANCA</div>
    <div style={{borderTop:"1px solid #1a1a1a",paddingTop:16,marginBottom:20}}>{d.itw_paragraphs.map((p,i)=><p key={i} style={{fontSize:13,color:"#888",lineHeight:1.7,marginBottom:i<d.itw_paragraphs.length-1?14:0}}>{p}</p>)}</div>
    <div style={{border:`1px solid rgba(71,255,232,0.25)`,borderRadius:4,padding:"16px 18px",marginBottom:20,background:ACCENT_DIM}}>
      <div style={{fontSize:14,color:"#ddd",lineHeight:1.6,fontStyle:"italic",marginBottom:10}}>"{d.quote}"</div>
      <div style={{fontSize:11,color:"#555",letterSpacing:"0.04em"}}>— {d.attribution}</div>
    </div>
    <div style={{fontSize:13,color:"#666",lineHeight:1.65,borderTop:"1px solid #141414",paddingTop:16,marginBottom:8}}>{d.midday_nudge}</div>
    <button className="next-tab-btn" onClick={onNext}>🔥 EVENING →</button>
  </div>);
}

function EveningTab({quiz,answers,submitted,allAnswered,score,closing,scoreRef,onAnswer,onSubmit}) {
  const lbl = score===3?"LOCKED IN 🔒":score===2?"ALMOST THERE":score===1?"KEEP GOING":"REVIEW & RETRY";
  const sub = score===3?"Perfect score. You've got this one.":score===2?"One away. Come back and get that third.":"The concepts will stick with more reps. Come back.";
  const border = score===3?ACCENT:score===2?"#606060":"#333";
  const cls = score===3?"score-box score-perfect":score===2?"score-box score-close":"score-box score-low";
  return (<div>
    <div style={{...S.label,color:ACCENT}}>🔥 TEST YOURSELF</div>
    {quiz.map((q,qi)=>(
      <div key={qi} style={{marginBottom:28}}>
        <div style={{fontSize:13,color:"#ccc",lineHeight:1.6,marginBottom:12}}>{qi+1}. {q.question}</div>
        {q.options.map((opt,ai)=>{
          let cls="quiz-opt";
          if(submitted&&ai===q.correct)cls="quiz-opt correct";
          else if(submitted&&answers[qi]===ai)cls="quiz-opt wrong";
          else if(!submitted&&answers[qi]===ai)cls="quiz-opt selected";
          return <button key={ai} className={cls} onClick={()=>onAnswer(qi,ai)} disabled={submitted}><span style={{color:ACCENT,marginRight:8}}>{String.fromCharCode(65+ai)}.</span>{opt}</button>;
        })}
        {submitted&&<div style={{fontSize:11,color:"#555",lineHeight:1.6,marginTop:8,paddingLeft:4}}>{q.explanation}</div>}
      </div>
    ))}
    {!submitted&&<button className="submit-btn" onClick={onSubmit} disabled={!allAnswered}>SUBMIT</button>}
    {submitted&&<div ref={scoreRef} className={cls} style={{border:`2px solid ${border}`}}>
      <div style={{fontSize:36,fontWeight:500,color:score===3?ACCENT:score===2?"#ccc":"#555"}}>{score}/3</div>
      <div style={{fontSize:13,letterSpacing:"0.15em",color:score===3?"#fff":"#888",marginTop:6}}>{lbl}</div>
      <div style={{fontSize:12,color:"#555",marginTop:8,lineHeight:1.5}}>{sub}</div>
    </div>}
    <div style={{fontSize:13,color:"#aaa",borderTop:"1px solid #1a1a1a",paddingTop:20,marginTop:20,lineHeight:1.7}}>{closing}</div>
  </div>);
}

const css = (accent) => `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{background:#0A0A0A;}
  @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  @keyframes popIn{0%{transform:scale(0.85);opacity:0}70%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
  @keyframes pulseBorder{0%,100%{box-shadow:0 0 0 0 ${accent}44}50%{box-shadow:0 0 0 8px ${accent}11}}
  .fade-in{animation:fadeIn 0.28s ease forwards}
  .tab-btn{background:none;border:none;cursor:pointer;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.12em;padding:8px 12px;color:#555;transition:color 0.2s;border-bottom:1.5px solid transparent}
  .tab-btn:hover{color:#aaa}.tab-btn.active{color:${accent};border-bottom-color:${accent}}
  .next-tab-btn{display:block;width:100%;margin-top:32px;padding:14px 20px;background:${accent};color:#0A0A0A;border:none;border-radius:4px;font-family:'DM Mono',monospace;font-size:11px;font-weight:500;letter-spacing:0.12em;cursor:pointer;text-align:center;transition:opacity 0.2s}
  .next-tab-btn:hover{opacity:0.85}
  .quiz-opt{background:#111;border:1px solid #222;border-radius:4px;padding:12px 14px;cursor:pointer;font-family:'DM Mono',monospace;font-size:12px;color:#888;margin-bottom:8px;transition:all 0.18s;text-align:left;width:100%}
  .quiz-opt:hover:not(:disabled){border-color:${accent}44;color:#ccc}
  .quiz-opt.selected{border-color:${accent};background:${accent}22;color:#ddd}
  .quiz-opt.correct{border-color:#4ade80;color:#4ade80;background:#4ade8011}
  .quiz-opt.wrong{border-color:#f87171;color:#f87171;background:#f8717111}
  .submit-btn{background:${accent};color:#0A0A0A;border:none;padding:12px 24px;font-family:'DM Mono',monospace;font-size:11px;font-weight:500;letter-spacing:0.1em;cursor:pointer;border-radius:3px;margin-top:8px}
  .submit-btn:disabled{opacity:0.3;cursor:not-allowed}
  .score-box{border-radius:6px;padding:28px 20px;text-align:center;margin:24px 0;animation:popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards}
  .score-perfect{background:${accent}0f;animation:popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards,pulseBorder 1.8s ease-in-out 0.4s 3}
  .score-close{background:#1a1a1a}.score-low{background:#111}
  .src-toggle{background:none;border:1px solid #222;padding:7px 14px;font-family:'DM Mono',monospace;font-size:10px;color:#555;cursor:pointer;border-radius:3px;letter-spacing:0.12em}
  .src-toggle:hover{color:#999;border-color:#444}
  .src-link{color:${accent};text-decoration:none;font-size:11px;display:block;margin-bottom:4px;font-family:'DM Mono',monospace}
  .src-link:hover{text-decoration:underline}
`;

const S = {
  root:{background:"#0A0A0A",minHeight:"100vh",fontFamily:"'DM Mono',monospace",color:"#fff",maxWidth:680,margin:"0 auto",paddingBottom:80},
  header:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 24px 12px",borderBottom:"1px solid #141414"},
  hL:{display:"flex",alignItems:"center",gap:10},hR:{display:"flex",alignItems:"center",gap:12},
  logo:{fontSize:11,letterSpacing:"0.2em",color:"#fff",fontWeight:500},
  entryBadge:{fontSize:10,color:"#333",letterSpacing:"0.1em"},
  streak:{fontSize:11,color:"#aaa"},
  badge:{fontSize:9,letterSpacing:"0.15em",padding:"3px 8px",borderRadius:2,fontWeight:500},
  datebar:{fontSize:10,color:"#333",letterSpacing:"0.1em",padding:"8px 24px",borderBottom:"1px solid #0f0f0f"},
  conceptBlock:{padding:"28px 24px 0"},
  conceptName:{fontSize:28,fontWeight:500,color:"#fff",letterSpacing:"-0.01em",lineHeight:1.1},
  tabRow:{display:"flex",borderBottom:"1px solid #141414",marginTop:20,padding:"0 12px",gap:4},
  content:{padding:"24px 24px 0"},
  label:{fontSize:10,letterSpacing:"0.15em",marginBottom:16,fontWeight:500},
  hook:{fontSize:18,color:"#fff",lineHeight:1.45,fontWeight:400,marginBottom:18,letterSpacing:"-0.01em"},
  srcSection:{padding:"28px 24px 48px"},srcDivider:{borderTop:"1px solid #141414",marginBottom:18},
  srcList:{marginTop:16,display:"flex",flexDirection:"column",gap:16},srcItem:{},
  srcDetail:{fontSize:11,color:"#444",lineHeight:1.6},
  srcVerified:{fontSize:10,color:"#2a2a2a",letterSpacing:"0.1em",marginTop:8,paddingTop:12,borderTop:"1px solid #141414"},
};
