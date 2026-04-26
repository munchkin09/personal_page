function ProjectDetail({ lang, slug, onBack }) {
  const c = window.CV_COPY[lang].detail;
  return (
    <div data-screen-label="07 Project Detail">
      <div className="container detail-hero">
        <a className="back" onClick={onBack}>{c.back}</a>
        <div className="section-number" style={{marginTop:'var(--space-5)'}}>{c.eyebrow}</div>
        <h1>{c.title}</h1>
        <p className="detail-lead">{c.lead}</p>
        <dl className="detail-meta">
          {c.meta.map(([k, v], i) => (
            <div key={i}><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
      </div>

      <div className="container">
        <div className="detail-cover">
          <div className="floating-code">&lt;/&gt;</div>
        </div>
      </div>

      <div className="container">
        <div className="detail-body">
          <aside className="detail-toc">
            <h5>Contents</h5>
            <ol>
              {c.toc.map((t, i) => <li key={i}>{t}</li>)}
            </ol>
          </aside>
          <div>
            {c.sections.map((s, i) => (
              <React.Fragment key={i}>
                <h2>{s.h}</h2>
                <p>{s.p}</p>
                {i === 2 && (
                  <pre className="code-block">
<span className="c">// migration gate — city by city</span>{"\n"}
<span className="k">async fn</span> <span className="fn">route_event</span>(evt: Event) -&gt; Result&lt;()&gt; {"{"}
  {"  "}<span className="k">match</span> flags.is_on(<span className="s">"events.v2"</span>, &amp;evt.city) {"{"}
  {"    "}<span className="k">true</span>  =&gt; kafka.publish(evt).<span className="k">await</span>,
  {"    "}<span className="k">false</span> =&gt; legacy.poll_insert(evt).<span className="k">await</span>,
  {"  "}{"}"}
{"}"}
                  </pre>
                )}
              </React.Fragment>
            ))}

            <h2>Results</h2>
            <div className="result-grid">
              {c.results.map((r, i) => (
                <div className="result-card" key={i}>
                  <div className="result-before">{r.before}</div>
                  <div className="result-after">{r.after}</div>
                  <div className="result-label">{r.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { ProjectDetail });
