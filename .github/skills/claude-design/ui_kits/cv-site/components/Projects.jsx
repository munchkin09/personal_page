function Projects({ lang, onOpenProject }) {
  const c = window.CV_COPY[lang].projects;
  return (
    <section id="projects" className="container reveal" data-screen-label="04 Projects">
      <div className="section-head">
        <div>
          <div className="section-number">§ {c.number}</div>
          <h2>{c.title}</h2>
        </div>
        <p>{c.kicker}</p>
      </div>
      <div className="projects-grid">
        {c.items.map((p, i) => (
          <a className="project-card" key={i} onClick={() => onOpenProject(p.slug)}>
            <div className="eyebrow">{p.eyebrow}</div>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
            <div className="proj-tags">
              {p.tags.map(t => <span className="tag" key={t}>{t}</span>)}
            </div>
            <div className="footer">
              <span className="proj-metric">{p.metric}</span>
              <span className="proj-arrow">↗</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
Object.assign(window, { Projects });
