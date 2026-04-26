function About({ lang }) {
  const c = window.CV_COPY[lang].about;
  const accents = ['var(--neon-cyan)', 'var(--neon-violet)', 'var(--neon-pink)'];
  return (
    <section id="about" className="container reveal" data-screen-label="02 About">
      <div className="section-head">
        <div>
          <div className="section-number">§ {c.number}</div>
          <h2>{c.title}</h2>
        </div>
        <p>{c.kicker}</p>
      </div>
      <div className="about-grid">
        <div className="about-prose">
          <p>{c.p1}</p>
          <p>{c.p2}</p>
          <p style={{color:'var(--fg-subtle)', fontSize:'var(--fs-body)'}}>{c.p3}</p>
        </div>
        <div className="about-stats">
          {c.stats.map((s, i) => (
            <div className="stat" key={i} style={{'--accent-color': accents[i % accents.length]}}>
              <div className="stat-num">{s.num}<span className="unit">{s.unit}</span></div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { About });
