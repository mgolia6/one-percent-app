'use client'

// Concept tab — reimagined "morning" reading (design handoff 1a, minus the
// concept-specific Living Curve, which isn't data-driven across 120+ lessons).
// Fully data-driven from entry.morning. Inline tab content, accent-themed.

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '')
  return m ? `${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)}` : '61,232,138'
}

export default function ConceptTab({ entry, accent = '#3DE88A', onNext }) {
  const A = accent
  const rgb = hexToRgb(accent)
  const day = entry.entry ?? entry.number
  const moves = String(entry.morning?.morning_challenge || '').split(/\n\n+/).filter(Boolean)
  let d = 0
  const rise = () => ({ animation: 'ctRise .6s cubic-bezier(.2,.7,.2,1) both', animationDelay: `${(d++ * 0.06).toFixed(2)}s` })

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`@keyframes ctRise{from{opacity:0;transform:translateY(13px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={rise()}>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '0.2em' }}>
          <span style={{ color: A }}>{String(entry.categoryTag || entry.category || '').toUpperCase()}</span>
          {entry.editionId && <span style={{ color: 'rgba(232,238,245,0.4)' }}> · {entry.editionId}</span>}
        </div>
        <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05, color: '#f1f6fb', marginTop: 8 }}>{entry.concept}</div>
      </div>

      {/* THE CONCEPT lead */}
      <div style={{ ...rise(), marginTop: 26 }}>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9.5, letterSpacing: '0.24em', color: A }}>THE CONCEPT</div>
        <div style={{ fontSize: 17, fontWeight: 400, lineHeight: 1.6, color: 'rgba(241,246,251,0.88)', marginTop: 12 }}>{entry.morning?.hook}</div>
      </div>

      {/* Body */}
      <div style={{ ...rise(), marginTop: 20, display: 'flex', flexDirection: 'column', gap: 15 }}>
        {(entry.morning?.explanation_paragraphs || []).map((p, i) => (
          <p key={i} style={{ fontSize: 14.5, lineHeight: 1.78, color: 'rgba(232,238,245,0.64)' }}>{p}</p>
        ))}
      </div>

      {/* WHY TODAY */}
      {entry.morning?.why_today && (
        <div style={{ ...rise(), marginTop: 22, background: `rgba(${rgb},0.07)`, border: `1px solid rgba(${rgb},0.24)`, borderRadius: 14, padding: '16px 17px' }}>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9.5, letterSpacing: '0.2em', color: A, marginBottom: 9 }}>WHY TODAY</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.68, color: 'rgba(232,238,245,0.78)' }}>{entry.morning.why_today}</div>
        </div>
      )}

      {/* YOUR MOVE */}
      {moves.length > 0 && (
        <div style={{ ...rise(), marginTop: 22, borderLeft: `2px solid ${A}`, paddingLeft: 15 }}>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9.5, letterSpacing: '0.2em', color: A, marginBottom: 9 }}>YOUR MOVE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {moves.map((p, i) => (
              <div key={i} style={{ fontSize: 13.5, lineHeight: 1.72, color: 'rgba(232,238,245,0.78)' }}>{p}</div>
            ))}
          </div>
        </div>
      )}

      {onNext && (
        <div style={{ ...rise(), marginTop: 30, marginBottom: 8 }}>
          <button onClick={onNext} style={{
            width: '100%', appearance: 'none', cursor: 'pointer', padding: 16, borderRadius: 15, border: 'none',
            fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, letterSpacing: '0.04em', color: '#06140c',
            background: `linear-gradient(180deg, ${A}f2, ${A} 60%, ${A}cc)`,
            boxShadow: `0 12px 30px -8px rgba(${rgb},0.5), inset 0 1px 0 rgba(255,255,255,0.5)`,
          }}>IN THE WILD →</button>
        </div>
      )}
    </div>
  )
}
