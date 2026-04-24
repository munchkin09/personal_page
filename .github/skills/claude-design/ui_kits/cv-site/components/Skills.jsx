function Skills({ lang }) {
  const c = window.CV_COPY[lang].skills;
  return (
    <section id="skills" className="container reveal" data-screen-label="05 Skills">
      <div className="section-head">
        <div>
          <div className="section-number">§ {c.number}</div>
          <h2>{c.title}</h2>
        </div>
        <p>{c.kicker}</p>
      </div>
      <div className="skills-grid">
        {c.groups.map((g, i) => (
          <div className="skill-group" key={i}>
            <h4>{g.title}</h4>
            <ul>
              {g.items.map(([name, freq], j) => (
                <li key={j}><span>{name}</span><span>{freq}</span></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
Object.assign(window, { Skills });
