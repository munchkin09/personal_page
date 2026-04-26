/* Copy dictionary — EN & ES. Spanish canonical; English matches tone/length.
   Source: Carlos Ledesma Castejón — real CV data. */
window.CV_COPY = {
  es: {
    nav: { work: "Trabajo", about: "Sobre mí", writing: "Experiencia", contact: "Contacto" },
    hero: {
      eyebrow: "Tech Lead · Madrid",
      title_pre: "Software,",
      title_em: "con oficio.",
      sub: "Soy Carlos Ledesma Castejón — +13 años en el ciclo completo de software, en la intersección entre ingeniería de calidad, automatización e IA generativa. Entiendo el problema de calidad desde la arquitectura, no solo desde el testing.",
      status: "Disponible · 2026",
      location: "Madrid, ES",
      availability: "Híbrido o remoto",
      cta_primary: "Ver experiencia",
      cta_secondary: "Descargar CV"
    },
    about: {
      number: "01",
      title: "Sobre mí",
      kicker: "Arquitecto de soluciones de calidad & IA — Full Stack Senior.",
      p1: "Tech Lead y Arquitecto de Software con más de trece años liderando la modernización de ecosistemas legado — incluyendo migraciones de COBOL a tecnologías modernas — y el diseño de agentes IA aplicados a calidad en grandes corporaciones bancarias y tecnológicas.",
      p2: "Combino una base técnica sólida en entornos Full Stack (JS/TS, Python) y Cloud (AWS) con capacidad real de liderazgo: mentorizo equipos, imparto formación técnica y traduzco necesidades de negocio en soluciones accionables. Impacto directo en equipos de Europa y LATAM.",
      p3: "Mi diferencial: entender el problema de calidad desde la arquitectura, no solo desde el testing.",
      stats: [
        { num: "13", unit: "años", label: "Ciclo completo de software" },
        { num: "2", unit: "continentes", label: "Europa · LATAM" },
        { num: "5", unit: "", label: "Empresas · clientes bancarios" }
      ]
    },
    experience: {
      number: "02",
      title: "Experiencia",
      kicker: "Dónde aterrizó el trabajo.",
      items: [
        { year: "2024 — hoy", role: "Arquitecto de Soluciones de Calidad & IA", co: "@ntt-data", desc: "Agentes IA para calidad, plataforma de test case generation, modernización COBOL → lenguajes mantenibles. Formación a equipos en Europa y LATAM." },
        { year: "2021 — 2024", role: "QA Automation Lead / Developer", co: "@bbva · capitole", desc: "Arquitectura de frameworks de automatización con Selenium, Cucumber y WebdriverIO. Detección temprana integrada en el SDLC." },
        { year: "2018 — 2021", role: "Senior Full-Stack Developer", co: "@centum-digital", desc: "Microservicios integrados con AWS Device Farm para validación de smartphones, Smart TVs, STBs y WebApps." },
        { year: "2013 — 2018", role: "Consultor Full Stack & Web", co: "@freelance", desc: "Wunderman (Land Rover), Anlddea, Informatiz@rte, Meollo. CakePHP, jQuery, APIs SOAP, eCommerce." },
        { year: "2010 — 2013", role: "Ingeniero de Software", co: "@bbva · atos-daesa", desc: "Monitoreo de SLAs, procesos ETL y herramientas de gestión de stock para el grupo BBVA." }
      ]
    },
    projects: {
      number: "03",
      title: "Trabajos seleccionados",
      kicker: "Tres proyectos que merecen estar escritos.",
      items: [
        { slug: "ai-agents", eyebrow: "CASO DE ESTUDIO · 2024 · NTT DATA", title: "Agentes IA para calidad del software", desc: "Agentes autónomos con LLMs orientados a verificación, validación y análisis de calidad. Reducción de intervención manual en procesos críticos del SDLC.", metric: "LLMs · SDLC", tags: ["OpenAI", "Claude", "Python"] },
        { slug: "test-gen", eyebrow: "CASO DE ESTUDIO · 2024 · NTT DATA", title: "Plataforma de test case generation", desc: "Generación automática de casos de prueba con IA. Democratiza el testing para perfiles no técnicos y acelera el diseño de casos.", metric: "GenAI · acceso", tags: ["GenAI", "TypeScript", "LLMs"] },
        { slug: "cobol", eyebrow: "CASO DE ESTUDIO · 2024 · NTT DATA", title: "Migración de COBOL a tecnologías modernas", desc: "Pipelines asistidos por IA para análisis, documentación y traducción de código legado. Reducción de deuda técnica acumulada durante décadas.", metric: "legado · deuda ↓", tags: ["COBOL", "GenAI", "Análisis estático"] },
        { slug: "bbva-qa", eyebrow: "CASO DE ESTUDIO · 2021–2024 · BBVA", title: "Frameworks de automatización a escala bancaria", desc: "Selenium, Cucumber y WebdriverIO con capas de abstracción legibles para stakeholders no técnicos. Cobertura en flujos críticos.", metric: "SDLC · cobertura", tags: ["Selenium", "Cucumber", "WebdriverIO"] }
      ]
    },
    skills: {
      number: "04",
      title: "Stack tecnológico",
      kicker: "A lo que recurro, y por qué.",
      groups: [
        { title: "IA & Modernización", items: [["Agentes IA", "a diario"], ["LLMs (OpenAI, Claude)", "a diario"], ["Test Case Generation", "producto"], ["Migración COBOL", "proyectos"]] },
        { title: "Lenguajes & QA", items: [["JavaScript / TypeScript", "experto"], ["Python", "a diario"], ["Selenium · Cucumber", "estándar"], ["WebdriverIO · Cypress", "estándar"]] },
        { title: "Cloud & Liderazgo", items: [["AWS (EC2, RDS, S3)", "a diario"], ["Docker · Jenkins · GitLab CI", "siempre"], ["Mentoring técnico", "activo"], ["Formación & adopción", "Europa · LATAM"]] }
      ]
    },
    footer: {
      cta: "Construyamos algo",
      cta_em: "silenciosamente excelente.",
      contact: "Contacto",
      elsewhere: "En otros sitios",
      email: "developer1983@gmail.com",
      calendar: "+34 680 33 24 30",
      colophon_l: "Diseñado y construido en Madrid · © 2026",
      colophon_r: "Space Grotesk · Inter · JetBrains Mono"
    },
    detail: {
      back: "← Volver",
      eyebrow: "CASO DE ESTUDIO · 2024 · NTT DATA",
      title: "Agentes IA para calidad del software",
      lead: "La calidad del software se ha tratado durante décadas como una fase: un equipo, unos tests, un gate. En NTT DATA lideré una apuesta distinta — agentes autónomos con LLMs que verifican, validan y analizan calidad dentro del SDLC, no después de él.",
      meta: [
        ["Cliente", "@ntt-data"],
        ["Año", "2024"],
        ["Rol", "Arquitecto"],
        ["Stack", "LLMs · Python"]
      ],
      toc: ["El problema", "Las restricciones", "El enfoque", "Resultados"],
      sections: [
        { h: "El problema", p: "Procesos críticos del SDLC — diseño de casos, verificación, análisis estático — exigían intervención manual constante y escalaban mal entre geografías. Los equipos de calidad en Europa y LATAM necesitaban la misma capacidad sin multiplicar cabezas." },
        { h: "Las restricciones", p: "Entornos corporativos con datos sensibles. Equipos con niveles técnicos heterogéneos. Adopción voluntaria — no sirve imponer herramientas que nadie usa. Integración con pipelines ya productivos, sin parar trenes en marcha." },
        { h: "El enfoque", p: "Agentes especializados con LLMs, orquestados alrededor del SDLC. Una plataforma de test case generation que democratiza el testing para perfiles no técnicos. Pipelines asistidos por IA para análisis y documentación de COBOL legado. Formación transversal para asegurar implantación sostenible." }
      ],
      results: [
        { before: "manual", after: "asistido", label: "Verificación" },
        { before: "técnicos", after: "todos", label: "Diseño de casos" },
        { before: "décadas", after: "meses", label: "Deuda de legado" }
      ]
    }
  },
  en: {
    nav: { work: "Work", about: "About", writing: "Experience", contact: "Contact" },
    hero: {
      eyebrow: "Tech Lead · Madrid",
      title_pre: "Software,",
      title_em: "with care.",
      sub: "I'm Carlos Ledesma Castejón — 13+ years across the full software lifecycle, at the intersection of quality engineering, automation and generative AI. I see quality as an architectural problem, not just a testing one.",
      status: "Available · 2026",
      location: "Madrid, ES",
      availability: "Hybrid or remote",
      cta_primary: "See experience",
      cta_secondary: "Download CV"
    },
    about: {
      number: "01",
      title: "About",
      kicker: "Quality & AI solutions architect — Full-Stack Senior.",
      p1: "Tech Lead and Software Architect with 13+ years leading the modernisation of legacy ecosystems — including COBOL migrations to modern stacks — and the design of AI agents applied to quality in major banking and technology corporations.",
      p2: "I combine a solid technical base in Full-Stack (JS/TS, Python) and Cloud (AWS) with real leadership: I mentor teams, deliver technical training, and translate business needs into actionable solutions. Direct impact on teams across Europe and LATAM.",
      p3: "My edge: understanding the quality problem from the architecture, not only from the testing.",
      stats: [
        { num: "13", unit: "yrs", label: "Full software lifecycle" },
        { num: "2", unit: "continents", label: "Europe · LATAM" },
        { num: "5", unit: "", label: "Companies · banking clients" }
      ]
    },
    experience: {
      number: "02",
      title: "Experience",
      kicker: "Where the work landed.",
      items: [
        { year: "2024 — now", role: "Quality & AI Solutions Architect", co: "@ntt-data", desc: "AI agents for quality, test case generation platform, COBOL → modern stack modernisation. Training for teams in Europe and LATAM." },
        { year: "2021 — 2024", role: "QA Automation Lead / Developer", co: "@bbva · capitole", desc: "Framework architecture with Selenium, Cucumber and WebdriverIO. Early detection embedded in the SDLC." },
        { year: "2018 — 2021", role: "Senior Full-Stack Developer", co: "@centum-digital", desc: "Microservices integrated with AWS Device Farm to validate smartphones, Smart TVs, STBs and WebApps." },
        { year: "2013 — 2018", role: "Full-Stack & Web Consultant", co: "@freelance", desc: "Wunderman (Land Rover), Anlddea, Informatiz@rte, Meollo. CakePHP, jQuery, SOAP APIs, eCommerce." },
        { year: "2010 — 2013", role: "Software Engineer", co: "@bbva · atos-daesa", desc: "SLA monitoring, ETL processes and stock management tools for the BBVA group." }
      ]
    },
    projects: {
      number: "03",
      title: "Selected work",
      kicker: "Three projects that are worth writing down.",
      items: [
        { slug: "ai-agents", eyebrow: "CASE STUDY · 2024 · NTT DATA", title: "AI agents for software quality", desc: "Autonomous LLM agents focused on verification, validation and quality analysis. Reduced manual intervention in critical SDLC processes.", metric: "LLMs · SDLC", tags: ["OpenAI", "Claude", "Python"] },
        { slug: "test-gen", eyebrow: "CASE STUDY · 2024 · NTT DATA", title: "Test case generation platform", desc: "AI-powered automatic test case generation. Democratises testing for non-technical profiles and accelerates case design.", metric: "GenAI · access", tags: ["GenAI", "TypeScript", "LLMs"] },
        { slug: "cobol", eyebrow: "CASE STUDY · 2024 · NTT DATA", title: "COBOL → modern stack migration", desc: "AI-assisted pipelines for analysis, documentation and translation of legacy code. Decades of accumulated technical debt, reduced.", metric: "legacy · debt ↓", tags: ["COBOL", "GenAI", "Static analysis"] },
        { slug: "bbva-qa", eyebrow: "CASE STUDY · 2021–2024 · BBVA", title: "Automation frameworks at bank scale", desc: "Selenium, Cucumber and WebdriverIO with abstraction layers readable by non-technical stakeholders. Coverage on critical flows.", metric: "SDLC · coverage", tags: ["Selenium", "Cucumber", "WebdriverIO"] }
      ]
    },
    skills: {
      number: "04",
      title: "Tech stack",
      kicker: "What I reach for, and why.",
      groups: [
        { title: "AI & Modernisation", items: [["AI Agents", "daily"], ["LLMs (OpenAI, Claude)", "daily"], ["Test Case Generation", "product"], ["COBOL migration", "projects"]] },
        { title: "Languages & QA", items: [["JavaScript / TypeScript", "expert"], ["Python", "daily"], ["Selenium · Cucumber", "standard"], ["WebdriverIO · Cypress", "standard"]] },
        { title: "Cloud & Leadership", items: [["AWS (EC2, RDS, S3)", "daily"], ["Docker · Jenkins · GitLab CI", "always"], ["Technical mentoring", "active"], ["Training & adoption", "EU · LATAM"]] }
      ]
    },
    footer: {
      cta: "Let's build something",
      cta_em: "quietly excellent.",
      contact: "Contact",
      elsewhere: "Elsewhere",
      email: "developer1983@gmail.com",
      calendar: "+34 680 33 24 30",
      colophon_l: "Designed & built in Madrid · © 2026",
      colophon_r: "Space Grotesk · Inter · JetBrains Mono"
    },
    detail: {
      back: "← Back to work",
      eyebrow: "CASE STUDY · 2024 · NTT DATA",
      title: "AI agents for software quality",
      lead: "For decades software quality has been treated as a phase — a team, some tests, a gate. At NTT DATA I led a different bet: autonomous LLM agents that verify, validate and analyse quality inside the SDLC, not after it.",
      meta: [
        ["Client", "@ntt-data"],
        ["Year", "2024"],
        ["Role", "Architect"],
        ["Stack", "LLMs · Python"]
      ],
      toc: ["The problem", "The constraints", "The approach", "Results"],
      sections: [
        { h: "The problem", p: "Critical SDLC steps — case design, verification, static analysis — required constant manual intervention and scaled poorly across geographies. Quality teams in Europe and LATAM needed the same capability without multiplying headcount." },
        { h: "The constraints", p: "Corporate environments with sensitive data. Teams with heterogeneous technical backgrounds. Adoption had to be voluntary — imposing tools nobody uses doesn't work. Integration with pipelines already in production, no stopping trains mid-route." },
        { h: "The approach", p: "Specialised LLM agents orchestrated around the SDLC. A test case generation platform that democratises testing for non-technical profiles. AI-assisted pipelines for legacy COBOL analysis and documentation. Transversal training to ensure sustainable adoption." }
      ],
      results: [
        { before: "manual", after: "assisted", label: "Verification" },
        { before: "technical", after: "everyone", label: "Case design" },
        { before: "decades", after: "months", label: "Legacy debt" }
      ]
    }
  }
};
