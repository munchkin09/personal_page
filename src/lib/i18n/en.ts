import type { es } from './es';

type Deep<T> = T extends readonly (infer U)[]
  ? Deep<U>[]
  : T extends object
    ? { -readonly [K in keyof T]: Deep<T[K]> }
    : T;

export const en: Deep<typeof es> = {
  meta: {
    homeTitle: 'Carlos Ledesma · Software Engineer',
    homeDescription:
      'Carlos Ledesma — Tech Lead and QA & AI Solutions Architect. Building elegant solutions with modern web technologies.',
    cvTitle: 'Resume · Carlos Ledesma — QA & AI Tech Lead',
    cvDescription:
      'Printable resume of Carlos Ledesma — Tech Lead, QA & AI Solutions Architect, Senior Full Stack.',
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
    subtitleLine1: 'Tech Lead · QA & AI Architect · Senior Full Stack',
    subtitleLine2:
      '+13 years turning engineering into real impact — from banking to generative AI.',
    viewProjects: 'See projects',
    letsTalk: "Let's talk",
    printableCv: 'Printable resume',
    stats: {
      yearsLabel: 'Years of experience',
      continentsLabel: 'Continents impacted',
      bugsLabel: 'Bugs caught early',
    },
    roles: [
      'Tech Lead & Solution Architect',
      'QA & AI Strategy Expert',
      'Full Stack Senior Developer',
      'GenAI Applied to Software',
      'COBOL Modernization Lead',
    ],
  },
  about: {
    label: 'About me',
    titlePrefix: 'Tech Lead at the intersection of ',
    titleHighlight: 'Quality and AI',
    tags: ['TypeScript', 'Python', 'AI Agents', 'QA Architecture', 'Cloud', 'COBOL Migration'],
    paragraphs: [
      "I'm a Tech Lead and Software Architect with 13+ years across the full software lifecycle (SDLC), specialized at the intersection of <strong>Quality Engineering</strong>, <strong>Automation</strong> and <strong>Generative AI</strong>.",
      "I've led modernizations of legacy ecosystems — including <strong>COBOL migrations to modern stacks</strong> — and the design of <strong>AI Agents applied to quality</strong> at major banking corporations like BBVA, with direct impact on teams across Europe and LATAM.",
      'My edge: I understand the quality problem <strong>from the architecture</strong>, not just from testing. I combine solid technical foundations with real leadership, mentoring and the ability to translate business needs into actionable solutions.',
    ],
  },
  strengths: {
    label: 'What sets me apart',
    titlePrefix: 'My core ',
    titleHighlight: 'strengths',
    subtitle: "I don't just write code. I build systems, lead teams and generate impact.",
    items: [
      { icon: '🧠', title: 'Systems thinking', desc: 'The ability to see the full picture and design scalable solutions that stand the test of time.' },
      { icon: '⚡', title: 'Execution speed', desc: 'From idea to production with judgment, without sacrificing quality for speed.' },
      { icon: '🤝', title: 'Technical communication', desc: 'I translate complex concepts into clear language, both for technical teams and stakeholders.' },
      { icon: '🔁', title: 'Continuous learning', desc: 'More than 20 years in the industry with a beginner mindset. Always leveling up.' },
      { icon: '🎯', title: 'Results oriented', desc: "Focused on the product's real impact, not just on elegantly perfect code." },
      { icon: '🛡️', title: 'Defensive code', desc: 'I write robust, secure and maintainable software. Tech debt keeps me up at night.' },
    ],
  },
  skills: {
    label: 'Toolkit',
    titlePrefix: 'Technical ',
    titleHighlight: 'stack',
    subtitle: 'Hover each slice to see the details of every technology.',
    totalLabel: 'Stack',
    techNames: {
      typescript: 'TypeScript & Node.js',
      ai: 'AI / LLM',
      systemDesign: 'System Design',
      frontend: 'Frontend',
      python: 'Python',
      cloud: 'Cloud & Infra',
      data: 'Data Management',
    },
    categories: {
      Frontend: 'Frontend',
      AI: 'AI',
      Architecture: 'Architecture',
      Backend: 'Backend',
      DevOps: 'DevOps',
      Data: 'Data',
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
      'Open to new opportunities as Tech Lead / Solution Architect in QA + AI environments, legacy modernization and Full Stack platforms.',
    profile: {
      name: 'Carlos Ledesma Castejón',
      title: 'Tech Lead · QA & AI Solutions Architect · Senior Full Stack',
      location: 'Madrid, Spain',
      summary: [
        'Tech Lead and Software Architect with 13+ years across the full software lifecycle (SDLC), specialized at the intersection of Quality Engineering, Automation and Generative AI.',
        "I've led modernizations of legacy ecosystems — including COBOL migrations to modern stacks — and the design of AI Agents applied to quality at major banking and tech corporations, with direct impact on teams across Europe and LATAM.",
        'My edge: I understand the quality problem from the architecture, not just from testing.',
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
          { k: 'AI Agents for Quality', v: 'Design and development of autonomous LLM-powered agents for software verification, validation and quality analysis, reducing manual intervention in critical SDLC processes.' },
          { k: 'Test Case Generation', v: 'Built an AI platform for automatic test case generation, democratizing access to testing for non-technical profiles and speeding up design time.' },
          { k: 'COBOL Migration', v: 'Leading legacy COBOL modernization projects with AI-assisted pipelines for analysis, documentation and translation to maintainable languages, reducing tech debt accumulated over decades.' },
          { k: 'Knowledge transfer', v: 'Delivering technical courses and workshops and leading AI adoption initiatives for quality teams across Europe and LATAM, ensuring effective and sustainable rollout.' },
          { k: 'Cross-cutting strategy', v: 'Defining quality analysis solutions embedded in the SDLC that guarantee maintainability, traceability and delivery efficiency at corporate scale.' },
        ],
      },
      {
        company: 'Capitole Consulting',
        location: 'Client: BBVA · Madrid',
        role: 'QA Automation Lead / Developer',
        period: 'Feb 2021 – Jun 2024',
        context: 'Technical leadership on the evolution and standardization of automation frameworks for one of the largest banks in Europe.',
        bullets: [
          { k: 'Framework architecture', v: 'Designed and implemented automation solutions with Selenium, Cucumber and WebdriverIO, increasing coverage on critical business flows.' },
          { k: 'SDLC integration', v: 'Built quality control tools embedded in the lifecycle, enabling early bug detection and reducing the cost of fixing defects.' },
          { k: 'Readability and adoption', v: 'Added abstraction and reporting layers that made automated tests understandable to non-technical stakeholders, speeding up release approval.' },
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
      { group: 'QA & Testing', items: ['Selenium', 'Cucumber', 'WebdriverIO', 'Cypress', 'Jest', 'Playwright', 'ESLint'] },
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
