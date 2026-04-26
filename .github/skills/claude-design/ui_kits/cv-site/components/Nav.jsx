// Nav component
const { useState } = React;

function Nav({ section, lang, setLang, onNav }) {
  const c = window.CV_COPY[lang];
  return (
    <div className="nav-wrap">
      <nav className="nav">
        <div className="nav-left">
          <img src="../../assets/logo-mark.svg" alt="Carlos Ledesma"/>
          <span className="nav-name">Carlos Ledesma</span>
        </div>
        <div className="nav-links">
          <a className={section === 'work' ? 'active' : ''} onClick={() => onNav('work')}>{c.nav.work}</a>
          <a className={section === 'about' ? 'active' : ''} onClick={() => onNav('about')}>{c.nav.about}</a>
          <a className={section === 'writing' ? 'active' : ''} onClick={() => onNav('writing')}>{c.nav.writing}</a>
          <a className={section === 'contact' ? 'active' : ''} onClick={() => onNav('contact')}>{c.nav.contact}</a>
        </div>
        <button className="lang-toggle" onClick={() => setLang(lang === 'en' ? 'es' : 'en')}>
          <span className={lang === 'en' ? 'on' : ''}>EN</span> · <span className={lang === 'es' ? 'on' : ''}>ES</span>
        </button>
      </nav>
    </div>
  );
}

Object.assign(window, { Nav });
