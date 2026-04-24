function Experience({ lang }) {
  const c = window.CV_COPY[lang].experience;
  return (
    <section id="experience" className="container reveal" data-screen-label="03 Experience">
      <div className="section-head">
        <div>
          <div className="section-number">§ {c.number}</div>
          <h2>{c.title}</h2>
        </div>
        <p>{c.kicker}</p>
      </div>
      <div className="exp-list">
        {c.items.map((it, i) => (
          <div className="exp-row" key={i}>
            <span className="exp-year">{it.year}</span>
            <div>
              <h4 className="exp-role">{it.role}</h4>
              <p className="exp-desc">{it.desc}</p>
            </div>
            <span className="exp-co">{it.co}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
Object.assign(window, { Experience });
