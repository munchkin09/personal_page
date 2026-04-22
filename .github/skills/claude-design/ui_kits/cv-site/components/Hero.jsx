function Hero({ lang }) {
  const c = window.CV_COPY[lang].hero;
  return (
    <section className="hero container" data-screen-label="01 Hero">
      <div className="reveal in">
        <div className="eyebrow">
          <span className="mono" style={{fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--fg-subtle)'}}>{c.eyebrow}</span>
        </div>
        <h1>
          {c.title_pre}<br/><span className="em">{c.title_em}</span>
        </h1>
        <p className="hero-sub">{c.sub}</p>
        <div className="hero-meta">
          <span><strong>●</strong> {c.status}</span>
          <span>◦ {c.location}</span>
          <span>◦ {c.availability}</span>
        </div>
        <div className="hero-cta">
          <a className="btn btn-primary" onClick={() => document.getElementById('projects')?.scrollIntoView({behavior:'smooth',block:'start'})}>
            {c.cta_primary} <span className="arrow">→</span>
          </a>
          <a className="btn btn-secondary">{c.cta_secondary} ↓</a>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { Hero });
