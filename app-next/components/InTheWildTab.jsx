'use client'

// In the Wild tab — reimagined "midday" (design handoff 2a "The Reframe Lands").
// Data-driven from entry.midday. Inline tab content, accent-themed.

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '')
  return m ? `${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)}` : '61,232,138'
}

export default function InTheWildTab({ entry, accent = '#3DE88A', onNext }) {
  const A = accent
  const rgb = hexToRgb(accent)
  const md = entry.midday || {}
  const nudges = String(md.midday_nudge || '').split(/\n\n+/).filter(Boolean)

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`@keyframes iwRise{from{opacity:0;transform:translateY(13px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Reframe hero */}
      <div style={{ minHeight: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center', animation: 'iwRise .6s cubic-bezier(.2,.7,.2,1) both' }}>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '0.24em', color: A }}>IN THE WILD</div>
        <div style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.34, letterSpacing: '-0.02em', color: '#f1f6fb', marginTop: 16 }}>{md.reframe}</div>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9.5, letterSpacing: '0.18em', color: 'rgba(232,238,245,0.4)', marginTop: 26 }}>SEE IT IN THE REAL WORLD ↓</div>
      </div>

      {/* Source line */}
      {md.itw_label && (
        <div style={{ marginTop: 8, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)', animation: 'iwRise .6s cubic-bezier(.2,.7,.2,1) both' }}>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '0.14em', color: 'rgba(232,238,245,0.4)' }}>{md.itw_label}</div>
        </div>
      )}

      {/* Body */}
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 15, animation: 'iwRise .6s cubic-bezier(.2,.7,.2,1) both' }}>
        {(md.itw_paragraphs || []).map((p, i) => (
          <p key={i} style={{ fontSize: 15, lineHeight: 1.82, color: 'rgba(232,238,245,0.68)' }}>{p}</p>
        ))}
      </div>

      {/* Quote centerpiece */}
      {md.quote && (
        <div style={{ marginTop: 24, background: `linear-gradient(165deg, rgba(${rgb},0.09), rgba(${rgb},0.02))`, border: `1px solid rgba(${rgb},0.26)`, borderRadius: 18, padding: '26px 22px', animation: 'iwRise .6s cubic-bezier(.2,.7,.2,1) both' }}>
          <div style={{ fontSize: 40, lineHeight: 0.4, color: A, fontWeight: 700, fontFamily: 'Georgia, serif' }}>“</div>
          <div style={{ fontSize: 19, fontWeight: 500, lineHeight: 1.5, color: '#f1f6fb', marginTop: 10 }}>{md.quote}</div>
          {md.attribution && <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '0.06em', color: 'rgba(232,238,245,0.4)', marginTop: 14 }}>{md.attribution}</div>}
        </div>
      )}

      {/* TRY IT TODAY */}
      {nudges.length > 0 && (
        <div style={{ marginTop: 24, borderLeft: `2px solid ${A}`, paddingLeft: 15, animation: 'iwRise .6s cubic-bezier(.2,.7,.2,1) both' }}>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9.5, letterSpacing: '0.2em', color: A, marginBottom: 9 }}>TRY IT TODAY</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {nudges.map((p, i) => (
              <div key={i} style={{ fontSize: 13.5, lineHeight: 1.72, color: 'rgba(232,238,245,0.78)' }}>{p}</div>
            ))}
          </div>
        </div>
      )}

      {onNext && (
        <div style={{ marginTop: 30, marginBottom: 8 }}>
          <button onClick={onNext} style={{
            width: '100%', appearance: 'none', cursor: 'pointer', padding: 16, borderRadius: 15, border: 'none',
            fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, letterSpacing: '0.04em', color: '#06140c',
            background: `linear-gradient(180deg, ${A}f2, ${A} 60%, ${A}cc)`,
            boxShadow: `0 12px 30px -8px rgba(${rgb},0.5), inset 0 1px 0 rgba(255,255,255,0.5)`,
          }}>LOCK IT IN →</button>
        </div>
      )}
    </div>
  )
}
