import type { es } from './es';

type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? Widen<U>[]
        : T extends object
          ? { -readonly [K in keyof T]: Widen<T[K]> }
          : T;

export const en: Widen<typeof es> = {
  meta: {
    homeTitle: 'Carlos Ledesma · STED — Software Test Engineer in Development',
    homeDescription:
      'Carlos Ledesma — STED, a QA Engineer who codes their own test frameworks, understands CI/CD pipelines end-to-end and combines testing with agentic AI tooling.',
    cvTitle: 'Resume · Carlos Ledesma — STED · QA & AI Architect',
    cvDescription:
      'Printable resume of Carlos Ledesma — Software Test Engineer in Development (STED), test framework architect and AI-assisted QA lead.',
    blogPostFallbackTitle: 'Blog · Carlos Ledesma',
  },
  nav: {
    about: 'About',
    strengths: 'Strengths',
    skills: 'Skills',
    projects: 'Projects',
    experience: 'Experience',
    blog: 'Blog',
    contact: 'Contact',
    cvTitle: 'View printable resume',
    cvLabel: 'Resume',
    ctaContact: 'Get in touch',
    langSwitchLabel: 'Switch language',
  },
  hero: {
    badge: 'Available for new projects',
    subtitleLine1: 'STED · A tester who codes their own frameworks · QA + AI',
    subtitleLine2:
      '+13 years as a QA engineer who understands CI/CD end-to-end, reads the code being tested and speaks the language of developers.',
    viewProjects: 'See projects',
    letsTalk: "Let's talk",
    printableCv: 'Printable resume',
    stats: {
      yearsLabel: 'Years of experience',
      continentsLabel: 'Continents impacted',
      projectsLabel: 'Projects delivered',
      bugsLabel: 'Bugs caught early',
      uptimeLabel: 'Production uptime',
    },
    roles: [
      'Software Test Engineer in Development (STED)',
      'Test Framework Architect (Playwright)',
      'CI/CD-fluent QA Engineer',
      'AI-Assisted Testing Lead',
      'QA who speaks the Devs language',
    ],
  },
  about: {
    label: 'About me',
    titlePrefix: 'STED — A tester who codes their own ',
    titleHighlight: 'frameworks',
    tags: ['Playwright', 'TypeScript', 'CI/CD', 'AI Testing', 'Framework Design', 'Code Review'],
    paragraphs: [
      "I'm a <strong>Software Test Engineer in Development (STED)</strong>: an <strong>engineer who codes their own test frameworks from scratch</strong>, not a consumer of someone else's tools. My natural ground is Playwright (fixtures, custom reporters, API testing), TypeScript and treating the test suite architecture like production code.",
      "I'm a <strong>tester who understands CI/CD pipelines end-to-end</strong> — from commit to production deploy — and a <strong>QA professional who speaks the language of developers</strong>: I read the code I'm testing, jump into code reviews and translate technical risk into business language for stakeholders.",
      "My edge: I <strong>combine testing expertise with AI tooling</strong>. I use agents to generate test cases, surface coverage gaps and kill boilerplate, after +13 years bringing that same discipline to clients like BBVA and NTT DATA across Europe and LATAM.",
    ],
  },
  strengths: {
    label: 'What sets me apart',
    titlePrefix: 'My core ',
    titleHighlight: 'strengths',
    subtitle: "I don't just write tests. I code my own frameworks, read the code I'm testing and speak the developers' language.",
    items: [
      { icon: '🧠', title: 'Systems thinking', desc: 'The ability to see the full picture and design test suites that scale and stand the test of time.' },
      { icon: '⚡', title: 'Execution speed', desc: 'From idea to test in CI with judgment, without sacrificing quality for speed.' },
      { icon: '📖', title: 'Reading production code', desc: "Understanding the codebase you're testing makes you 5x more effective. I don't test black boxes — I navigate the repo and design tests with real context." },
      { icon: '🤖', title: 'AI-assisted testing', desc: 'I use agentic AI to generate test cases, analyze coverage gaps and write boilerplate in minutes, not hours.' },
      { icon: '🗣️', title: 'Speaks Dev & Business', desc: 'I jump into code reviews like any other dev and translate technical risk into stakeholder-friendly business language.' },
      { icon: '🛡️', title: 'Defensive code', desc: 'I write robust, deterministic and maintainable frameworks. Flaky tests keep me up at night.' },
    ],
  },
  skills: {
    label: 'Toolkit',
    titlePrefix: 'Technical ',
    titleHighlight: 'stack',
    subtitle: "A STED's stack: Playwright and TypeScript at the core, AI and CI/CD wrapped around them. Hover each slice for details.",
    totalLabel: 'Test Engineer',
    techNames: {
      typescript: 'TypeScript & Node.js',
      ai: 'AI / LLM',
      systemDesign: 'System Design',
      frontend: 'Frontend',
      python: 'Python',
      cloud: 'Cloud & Infra',
      data: 'Data Management',
      qaAutomation: 'QA Automation · Playwright',
    },
    categories: {
      Frontend: 'Frontend',
      AI: 'AI',
      Architecture: 'Architecture',
      Backend: 'Backend',
      DevOps: 'DevOps',
      Data: 'Data',
      Testing: 'Testing',
    },
  },
  projects: {
    label: 'Open Source',
    titlePrefix: 'Personal ',
    titleHighlight: 'projects',
    seeOnGitHub: 'See on GitHub',
    items: [
      {
        title: 'YACS — Yet Another Claude Skills Repo',
        description: 'A collection of Skills and Agents for Claude Code: OWASP audits, architecture design, gamification, tech debt, data storytelling and more. Installable via npx.',
      },
      {
        title: 'Mammals',
        description: 'Unified ticket and document management platform powered by AI. Blends Linear-style task management with Obsidian-style knowledge management, designed for humans and autonomous agents via MCP.',
      },
      {
        title: 'Personal Page',
        description: 'This very site. Portfolio built with Svelte 5, advanced CSS animations and a custom blog CMS: I publish from Telegram to Cloudflare KV via a Worker and webhook.',
      },
      {
        title: 'CS Analyzer Backend',
        description: 'AI-powered video analysis system for Counter-Strike matches. Gemini LLM analyzes gameplay, FFmpeg compresses videos and everything runs in Docker with CI/CD to Azure Container Registry.',
      },
      {
        title: 'Gordots',
        description: 'A video game project built with the Godot Engine. External assets, sprites via ZzSprite and logging with LogDuck.',
      },
      {
        title: 'Asciicrappers (turbo-invention)',
        description: 'Generates ASCII skylines from the tabs and spaces of any remote source file. Give it a URL with code and get a unique skyline right in your terminal.',
      },
    ],
  },
  experience: {
    label: 'Career path',
    titlePrefix: '+13 years in the ',
    titleHighlight: 'industry',
    subtitle: 'From classic engineering to AI agents, through banking, IoT and consulting.',
    current: 'Present',
    items: [
      {
        year: 'Jun 2024 – Present',
        role: 'QA & AI Solutions Architect',
        company: 'NTT DATA · Madrid (Hybrid)',
        desc: 'Strategic innovation role within large-scale digital transformation. Designing autonomous AI agents with LLMs for software verification and validation. Platform for automatic AI-driven test case generation. Leading COBOL migrations to modern stacks. Training teams across Europe and LATAM.',
        highlights: ['AI Agents for QA', 'Test Case Generation', 'COBOL Migration', 'Europe & LATAM'],
      },
      {
        year: 'Feb 2021 – Jun 2024',
        role: 'QA Automation Lead / Developer',
        company: 'Capitole Consulting · Client: BBVA · Madrid',
        desc: 'Technical leadership on test automation for one of the largest banks in Europe. Framework architecture with Selenium, Cucumber and WebdriverIO. Integration of quality tools into the SDLC for early bug detection. Abstraction layers for non-technical stakeholders.',
        highlights: ['Selenium', 'Cucumber', 'WebdriverIO', 'BBVA'],
      },
      {
        year: 'Sep 2018 – Jul 2021',
        role: 'Senior Full-Stack Developer',
        company: 'Centum Digital · Madrid',
        desc: 'Microservices infrastructure integrated with AWS Device Farm for IoT and mobile device validation at scale. Multi-platform automation: Smartphones, Smart TVs, STBs and WebApps.',
        highlights: ['Microservices', 'AWS Device Farm', 'IoT', 'Multi-platform'],
      },
      {
        year: '2013 – 2018',
        role: 'Full Stack Consultant & Web Developer',
        company: 'Freelance · Madrid',
        desc: 'Projects for clients such as Wunderman (Land Rover), Anlddea, Informatiz@rte and Meollo. Full Stack with CakePHP, jQuery, SOAP/JSON APIs and MVC architecture for the automotive, civic cooperation and agricultural sectors.',
        highlights: ['Land Rover', 'CakePHP', 'SOAP APIs', 'eCommerce'],
      },
      {
        year: '2010 – 2013',
        role: 'Software Engineer',
        company: 'ATOS – DAESA · Client: BBVA · Madrid',
        desc: 'Design and development of software for SLA monitoring, ETL processes and stock management tools for BBVA group branches.',
        highlights: ['SLA Monitoring', 'ETL', 'BBVA', 'Java'],
      },
    ],
  },
  blog: {
    label: 'Latest entries',
    titlePrefix: 'Blog ',
    titleHighlight: '& notes',
    subtitle: 'Ideas, reflections and everyday lessons. Published straight from Telegram.',
    loading: 'Loading posts…',
    emptyIcon: '✏️',
    empty: "No posts yet. There'll be something here soon!",
    readMore: 'Read more →',
  },
  contact: {
    label: 'Shall we work together?',
    titlePrefix: "Let's talk about your ",
    titleHighlight: 'next project',
    subtitle:
      'Always open to new challenges, collaborations and interesting conversations. A full project, targeted consulting or just a technical chat — I’m in.',
    sendEmail: 'Send me an email',
  },
  footer: {
    copyright: '© 2026 Carlos Ledesma · Made with',
    tech: 'and',
  },
  blogDetail: {
    back: 'Back to the blog',
    loading: 'Loading…',
    notFoundTitle: 'Post not found',
    notFoundBody: "The post you're looking for doesn't exist or has been removed.",
    notFoundBack: '← Back to the blog',
  },
  cv: {
    headerLabels: {
      location: 'Location',
      phone: 'Phone',
      email: 'Email',
      linkedin: 'LinkedIn',
      github: 'GitHub',
      web: 'Website',
    },
    toolbar: {
      back: 'Back to portfolio',
      print: 'Print',
      downloadPdf: 'Download PDF',
    },
    sections: {
      profile: 'Profile',
      experience: 'Experience',
      stack: 'Technical stack',
      languages: 'Languages',
      education: 'Education',
      availability: 'Availability',
    },
    metricsLabel: 'Key metrics',
    docAriaLabel: 'Carlos Ledesma — Resume',
    footer: {
      references: 'References available on request',
      website: 'carlosledesma.dev · Madrid, Spain',
    },
    availabilityBody:
      'Open to roles as STED, QA Architect, Test Framework Lead and AI-assisted QA platforms. Also Tech Lead in QA + AI environments and legacy modernization.',
    profile: {
      name: 'Carlos Ledesma Castejón',
      title: 'Software Test Engineer in Development (STED) · QA & AI Architect · Tech Lead',
      location: 'Madrid, Spain',
      summary: [
        'Software Test Engineer in Development (STED) with 13+ years across the SDLC: an engineer who codes their own test frameworks from scratch (Playwright, fixtures, custom reporters, API testing) and understands CI/CD pipelines end-to-end.',
        "A QA who speaks the developers' language: I read the code I'm testing, jump into code reviews and translate technical risk into stakeholder language. I've brought this discipline to clients like BBVA and NTT DATA across Europe and LATAM.",
        'My edge: I combine testing expertise with AI tooling — agents for test case generation, coverage gap analysis and boilerplate — without losing sight of the quality architecture.',
      ],
    },
    highlights: [
      { n: '13+', l: 'years of experience' },
      { n: '2', l: 'continents (EU & LATAM)' },
      { n: 'BBVA', l: 'top-EU banking client' },
      { n: 'LLMs', l: 'applied to QA and legacy' },
    ],
    experience: [
      {
        company: 'NTT DATA',
        location: 'Madrid (Hybrid)',
        role: 'QA & AI Solutions Architect',
        period: 'Jun 2024 – Present',
        context: 'Strategic role driving tech innovation across the software lifecycle in a large-scale digital transformation context.',
        bullets: [
          { k: 'AI Agents for Quality', v: 'Design and development of autonomous LLM-powered agents for software verification, validation and quality analysis, combining testing expertise with AI tooling to reduce manual intervention in critical SDLC processes.' },
          { k: 'Test Case Generation', v: 'Built an AI platform for automatic test case generation, democratizing access to testing for non-technical profiles and killing the boilerplate in the design process.' },
          { k: 'COBOL Migration', v: 'Leading legacy COBOL modernization projects with AI-assisted pipelines for analysis, documentation and translation to maintainable languages, reducing tech debt accumulated over decades.' },
          { k: 'Knowledge transfer', v: 'Delivering technical courses and workshops and leading AI adoption initiatives for quality teams across Europe and LATAM, ensuring effective and sustainable rollout.' },
          { k: 'Cross-cutting strategy', v: 'Defining quality analysis solutions embedded in end-to-end CI/CD pipelines that guarantee maintainability, traceability and delivery efficiency at corporate scale.' },
        ],
      },
      {
        company: 'Capitole Consulting',
        location: 'Client: BBVA · Madrid',
        role: 'QA Automation Lead / Developer',
        period: 'Feb 2021 – Jun 2024',
        context: 'Technical leadership on the evolution and standardization of automation frameworks for one of the largest banks in Europe.',
        bullets: [
          { k: 'Frameworks from scratch', v: 'Designed and implemented automation solutions with Selenium, Cucumber and WebdriverIO by coding the frameworks from scratch — fixtures, custom reporters, API testing helpers — and increasing coverage on critical business flows.' },
          { k: 'End-to-end CI/CD pipelines', v: 'Integrated the suites into end-to-end CI/CD pipelines (GitLab CI, Jenkins), enabling early bug detection and reducing the cost of fixing defects.' },
          { k: 'QA who speaks Dev', v: 'Joined code reviews reading the very code I was testing, and added abstraction and reporting layers that made the tests understandable to non-technical stakeholders.' },
        ],
      },
      {
        company: 'Centum Digital',
        location: 'Madrid',
        role: 'Senior Full-Stack Developer',
        period: 'Sep 2018 – Jul 2021',
        context: 'Complex infrastructure development for IoT and mobile device validation at scale.',
        bullets: [
          { k: 'Microservices + AWS Device Farm', v: 'Designed and maintained a microservices-oriented infrastructure integrated with AWS Device Farm for cloud-based validation of multiple device types.' },
          { k: 'Multi-platform automation', v: 'Led the analysis and refactoring of testing tooling for a heterogeneous ecosystem: Smartphones, Smart TVs, STBs and WebApps.' },
          { k: 'Team productivity', v: 'Created efficient workflows that reduced the department operational load and improved support for platform users.' },
        ],
      },
      {
        company: 'Freelance / Technology Consulting',
        location: 'Madrid',
        role: 'Full Stack Consultant & Web Developer',
        period: '2013 – 2018',
        context: 'End-to-end projects for corporate clients and SMEs.',
        bullets: [
          { k: 'Wunderman (Land Rover)', v: 'Full Stack development with CakePHP and jQuery/Bootstrap for high-traffic digital campaigns.' },
          { k: 'Anlddea', v: 'Architecture and prototyping of a social network for civic cooperation and SME funding (MVC, HTML5/JS).' },
          { k: 'Informatiz@rte', v: 'SOAP API integration and JSON data consumption for the agricultural sector.' },
          { k: 'Meollo', v: 'Strategic eCommerce consulting and digital presence management.' },
        ],
      },
      {
        company: 'Atos – DAESA',
        location: 'Client: BBVA · Madrid',
        role: 'Software Engineer',
        period: '2010 – 2013',
        context: 'Design and development of software for SLA monitoring, ETL processes and stock management tools for BBVA group branches.',
        bullets: [],
      },
    ],
    skills: [
      { group: 'Leadership & Strategy', items: ['Software Architecture', 'Technical mentoring', 'Legacy Modernization', 'Agile / Scrum', 'Stakeholder Management'] },
      { group: 'AI & Modernization', items: ['AI Agents', 'GenAI applied to code', 'LLMs (OpenAI, Claude)', 'Test Case Generation', 'Static analysis', 'COBOL Migration'] },
      { group: 'Languages', items: ['JavaScript / TypeScript (Expert)', 'Python', 'Bash', 'PowerShell', 'COBOL (analysis & migration)'] },
      { group: 'QA & Testing', items: ['Playwright (fixtures, custom reporters, API testing)', 'Selenium', 'Cucumber', 'WebdriverIO', 'Cypress', 'Jest', 'AI-assisted test generation', 'ESLint'] },
      { group: 'Cloud & DevOps', items: ['Azure (WebApps, Functions, LLM Foundry)', 'GCP', 'AWS (EC2, RDS, S3, Device Farm)', 'Docker', 'Jenkins', 'GitLab CI', 'Linux', 'Git'] },
      { group: 'Training & Adoption', items: ['Technical course design', 'AI workshops', 'Team onboarding', 'Tech evangelism'] },
    ],
    languages: [
      { lang: 'Spanish', level: 'Native' },
      { lang: 'English', level: 'Professional working proficiency' },
    ],
    education: [
      { title: 'Full Stack Web & Mobile Bootcamp', org: 'Keep Coding, Madrid', period: '2016 – 2017' },
      { title: 'Higher Technician in Computer Application Development', org: 'Madrid Chamber of Commerce', period: '2007 – 2009' },
    ],
  },
};
