function Footer({ lang }) {
  const c = window.CV_COPY[lang].footer;
  return (
    <footer data-screen-label="06 Footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-cta reveal">
            <h3>{c.cta} <span className="em">{c.cta_em}</span></h3>
            <a className="btn btn-accent" href={`mailto:${c.email}`}>
              {c.email} <span className="arrow">→</span>
            </a>
          </div>
          <div className="footer-col">
            <h5>{c.contact}</h5>
            <a href={`mailto:${c.email}`}>{c.email}</a>
            <a>{c.calendar} ↗</a>
          </div>
          <div className="footer-col">
            <h5>{c.elsewhere}</h5>
            <a>GitHub ↗</a>
            <a>LinkedIn ↗</a>
            <a>RSS ↗</a>
          </div>
        </div>
        <div className="colophon">
          <span>{c.colophon_l}</span>
          <span>{c.colophon_r}</span>
        </div>
      </div>
    </footer>
  );
}
Object.assign(window, { Footer });
