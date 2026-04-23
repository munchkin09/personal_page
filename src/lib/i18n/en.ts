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
    homeTitle: 'Carlos Ledesma · Quality Engineering Architect · Tech Lead & AI',
    homeDescription:
      'Carlos Ledesma — Tech Lead and Quality Architect who builds the frameworks, AI agents and platforms that entire teams use to ship software with confidence. 13+ years across banking, IoT, consulting and digital transformation.',
    cvTitle: 'Resume · Carlos Ledesma — Quality Engineering Architect · Tech Lead & AI',
    cvDescription:
      'Printable resume of Carlos Ledesma — Quality Engineering Architect and Tech Lead specialised in quality as a shared SDLC responsibility and AI tooling.',
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
    subtitleLine1: 'Tech Lead · Quality as architecture · AI applied to the SDLC',
    subtitleLine2:
      '+13 years building the platforms and frameworks that entire teams use to ship with confidence — because quality is not a phase, it is a shared commitment.',
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
      'Quality Engineering Architect',
      'Tech Lead · QA & AI Tooling',
      'Framework & Platform Builder',
      'Team Enablement Lead',
      'QA who understands the architecture',
    ],
  },
  about: {
    label: 'About me',
    titlePrefix: 'Quality as ',
    titleHighlight: 'shared architecture',
    tags: ['TypeScript', 'Playwright', 'AI Agents', 'Platform Building', 'SDLC', 'Team Enablement'],
    paragraphs: [
      "I'm a <strong>Tech Lead and Quality Engineering Architect</strong>: over 13 years I haven't just tested software — I've <strong>built the platforms, frameworks and AI agents</strong> that entire teams rely on to ship with confidence. My domain isn't a single discipline; it's the full software lifecycle.",
      "I believe <strong>quality is a commitment shared by every layer of the SDLC</strong>, not a phase bolted on at the end. That's why I work side by side with developers, POs and stakeholders: I read the code I validate, join code reviews and translate technical risk into business decisions.",
      "My edge: I <strong>combine a solid technical foundation</strong> (JS/TS, Python, Cloud, CI/CD) with <strong>architectural thinking and AI tooling</strong>, walking alongside teams in their growth — because I trust my teammates' intuition and aim to enable them, not replace them.",
    ],
  },
  strengths: {
    label: 'What sets me apart',
    titlePrefix: 'My core ',
    titleHighlight: 'strengths',
    subtitle: "I design the systems that help teams ship software they're proud of.",
    items: [
      { icon: '🏗️', title: 'Quality as architecture', desc: 'I understand quality problems from the system design, not from the test report. I design suites, frameworks and platforms that scale with the team.' },
      { icon: '🔗', title: 'End-to-end SDLC', desc: 'From the first commit to the production deploy: I know every link in the chain and where quality can break or shine.' },
      { icon: '🌍', title: 'Breadth of domain', desc: 'Banking, IoT, digital campaigns, consulting, video games... I have solved quality problems across very different domains. Curiosity is my competitive edge.' },
      { icon: '🤖', title: 'AI applied to the SDLC', desc: 'I use agents and LLMs to generate test cases, analyse coverage, migrate legacy and eliminate boilerplate — always keeping in mind that AI should enable, not replace, human judgement.' },
      { icon: '🌱', title: 'Enables teams', desc: "I trust my teammates' intuition and judgement. My role is to support their growth, not to be the bottleneck of quality." },
      { icon: '🗣️', title: 'Bridge between Dev and Business', desc: 'I read production code, join code reviews and translate technical risk into stakeholder language. Quality only works when everyone understands it.' },
    ],
  },
  skills: {
    label: 'Toolkit',
    titlePrefix: 'Technical ',
    titleHighlight: 'stack',
    subtitle: "A Quality Architect's stack: TypeScript and testing frameworks at the core, AI and CI/CD wrapped around them. Hover each slice for details.",
    totalLabel: 'Quality Architect',
    techNames: {
      typescript: 'TypeScript & Node.js',
      ai: 'AI / LLM',
      systemDesign: 'System Design',
      frontend: 'Frontend',
      python: 'Python',
      cloud: 'Cloud & Infra',
      data: 'Data Management',
      qaAutomation: 'QA Automation',
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
      {
        title: 'Request Mocker',
        description: 'Desktop app to instantly mock APIs from an OpenAPI/YAML specification. Serves endpoints on localhost, logs requests in real time and requires zero backend code. Electron + TypeScript with a built-in YAML parser and no external dependencies.',
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
      "Always open to new challenges, collaborations and interesting conversations. A full project, targeted consulting or just a technical chat — I'm in.",
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
      'Open to roles as Quality Engineering Architect, Tech Lead in QA + AI environments, AI-assisted quality platforms and legacy modernisation. Also strategic quality consulting in digital transformations.',
    profile: {
      name: 'Carlos Ledesma Castejón',
      title: 'Quality Engineering Architect · Tech Lead · AI applied to the SDLC',
      location: 'Madrid, Spain',
      summary: [
        "Tech Lead and Quality Engineering Architect with 13+ years across the SDLC: I don't just test software — I build the frameworks, platforms and AI agents that entire teams rely on to ship with confidence. My foundation is technical (JS/TS, Python, Cloud, CI/CD) and my perspective is systemic.",
        'I believe quality is a shared responsibility across every layer of the SDLC. I work side by side with developers, POs and stakeholders: I read the code I validate, join code reviews and translate technical risk into business decisions. A discipline I have applied across banking, IoT, consulting and large-scale digital transformation.',
        'My edge: solid technical expertise + architectural thinking + AI tooling, walking alongside teams in their growth — because I trust my teammates\' judgement and aim to enable them, not replace them.',
      ],
    },
    highlights: [
      { n: '13+', l: 'years of experience' },
      { n: '2', l: 'continents (EU & LATAM)' },
      { n: 'LLMs', l: 'applied to QA and legacy' },
      { n: 'SDLC', l: 'end-to-end perspective' },
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
