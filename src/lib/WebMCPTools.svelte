<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  // ── Site data exposed as MCP tools ─────────────────────────────────────────
  const profile = {
    name: 'Carlos Ledesma Castejón',
    title: 'Tech Lead · Quality & AI Solutions Architect · Senior Full-Stack Developer',
    location: 'Madrid, Spain',
    email: 'carlos.developer1983@gmail.com',
    linkedin: 'https://linkedin.com/in/carlosledesmac',
    github: 'https://github.com/munchkin09',
    website: 'https://carloslc.is-a.dev',
    summary:
      'Tech Lead and Software Architect with 13+ years of experience across the full SDLC, specialising in QA, AI Strategy, Full-Stack Engineering, and COBOL Modernisation.',
  };

  const experience = [
    {
      company: 'NTT DATA',
      role: 'Quality & AI Solutions Architect',
      period: 'Jun 2024 – Present',
      highlights: [
        'Autonomous AI agents for software quality (LLMs)',
        'AI-assisted COBOL migration pipelines',
        'Automated test-case generation platform',
        'Technical training across Europe and LATAM',
      ],
    },
    {
      company: 'Capitole Consulting (client: BBVA)',
      role: 'QA Automation Lead / Developer',
      period: 'Feb 2021 – Jun 2024',
      highlights: [
        'Selenium, Cucumber, WebdriverIO automation frameworks',
        'SDLC-embedded quality tooling',
        'Reporting layers for non-technical stakeholders',
      ],
    },
    {
      company: 'Centum Digital',
      role: 'Senior Full-Stack Developer',
      period: 'Sep 2018 – Jul 2021',
      highlights: [
        'Microservices + AWS Device Farm infrastructure',
        'Multi-platform automation: smartphones, Smart TVs, STBs',
      ],
    },
    {
      company: 'Freelance / Tech Consulting',
      role: 'Full Stack & Web Developer',
      period: '2013 – 2018',
      highlights: ['Land Rover (Wunderman)', 'Anlddea social network', 'Agricultural API integrations'],
    },
    {
      company: 'Atos – DAESA (client: BBVA)',
      role: 'Software Engineer',
      period: '2010 – 2013',
      highlights: ['SLA monitoring', 'ETL processes', 'Stock management tools'],
    },
  ];

  const skills = [
    { group: 'AI & Modernisation', items: ['Agentic AI', 'GenAI applied to code', 'LLMs (OpenAI, Claude)', 'Test Case Generation', 'COBOL migration'] },
    { group: 'Languages', items: ['TypeScript / JavaScript (Expert)', 'Python', 'Bash', 'PowerShell'] },
    { group: 'QA & Testing', items: ['Selenium', 'Cucumber', 'WebdriverIO', 'Cypress', 'Jest', 'Playwright'] },
    { group: 'Cloud & DevOps', items: ['Azure', 'GCP', 'AWS', 'Docker', 'Jenkins', 'GitLab CI'] },
    { group: 'Leadership', items: ['Architecture', 'Mentoring', 'Agile/Scrum', 'Stakeholder management'] },
  ];

  const education = [
    { title: 'Full Stack Web & Mobile Bootcamp', org: 'Keep Coding, Madrid', year: '2016–2017' },
    { title: 'Higher Technician in IT Application Development', org: 'Cámara de Comercio de Madrid', year: '2007–2009' },
  ];

  const SECTIONS = ['hero', 'skills', 'blog'] as const;
  const PAGES = ['/cv', '/blog', '/'] as const;

  // ── Tool definitions shared between both MCP implementations ───────────────
  type ToolResult = { content: { type: 'text'; text: string }[] };

  const tools: {
    name: string;
    title: string;
    description: string;
    inputSchema: Record<string, unknown>;
    readOnly?: boolean;
    fn: (args: Record<string, string>) => ToolResult;
  }[] = [
    {
      name: 'get_profile',
      title: 'Get Profile',
      description: "Returns Carlos Ledesma's professional profile: name, title, location, email, social links, and a brief summary.",
      inputSchema: { type: 'object', properties: {}, required: [] },
      readOnly: true,
      fn: () => ({ content: [{ type: 'text', text: JSON.stringify(profile, null, 2) }] }),
    },
    {
      name: 'get_experience',
      title: 'Get Work Experience',
      description: "Returns Carlos's full work experience history as a structured list.",
      inputSchema: { type: 'object', properties: {}, required: [] },
      readOnly: true,
      fn: () => ({ content: [{ type: 'text', text: JSON.stringify(experience, null, 2) }] }),
    },
    {
      name: 'get_skills',
      title: 'Get Skills',
      description: "Returns Carlos's technical and leadership skills grouped by category.",
      inputSchema: { type: 'object', properties: {}, required: [] },
      readOnly: true,
      fn: () => ({ content: [{ type: 'text', text: JSON.stringify(skills, null, 2) }] }),
    },
    {
      name: 'get_education',
      title: 'Get Education',
      description: "Returns Carlos's education history.",
      inputSchema: { type: 'object', properties: {}, required: [] },
      readOnly: true,
      fn: () => ({ content: [{ type: 'text', text: JSON.stringify(education, null, 2) }] }),
    },
    {
      name: 'navigate_to_section',
      title: 'Navigate to Section',
      description: `Scrolls the homepage to a named section. Available sections: ${SECTIONS.join(', ')}.`,
      inputSchema: {
        type: 'object',
        properties: {
          section: { type: 'string', enum: SECTIONS, description: 'The section id to scroll to.' },
        },
        required: ['section'],
      },
      readOnly: false,
      fn: ({ section }) => {
        const el = document.getElementById(section);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return { content: [{ type: 'text', text: `Scrolled to section: ${section}` }] };
        }
        return { content: [{ type: 'text', text: `Section "${section}" not found on current page.` }] };
      },
    },
    {
      name: 'navigate_to_page',
      title: 'Navigate to Page',
      description: `Navigates to a page of the site. Available routes: ${PAGES.join(', ')}.`,
      inputSchema: {
        type: 'object',
        properties: {
          route: { type: 'string', enum: PAGES, description: 'The route to navigate to.' },
        },
        required: ['route'],
      },
      readOnly: false,
      fn: ({ route }) => {
        goto(route);
        return { content: [{ type: 'text', text: `Navigating to ${route}` }] };
      },
    },
  ];

  onMount(() => {
    // ── 1. Browser-native WebMCP API (W3C CG spec – navigator.modelContext) ──
    //    Progressive enhancement: only runs in browsers that ship the API.
    if ('modelContext' in navigator) {
      const ctx = (navigator as unknown as { modelContext: {
        registerTool: (opts: {
          name: string;
          title: string;
          description: string;
          inputSchema: Record<string, unknown>;
          readOnly?: boolean;
          callback: (args: Record<string, string>) => ToolResult | Promise<ToolResult>;
        }) => void;
      } }).modelContext;

      for (const tool of tools) {
        ctx.registerTool({
          name: tool.name,
          title: tool.title,
          description: tool.description,
          inputSchema: tool.inputSchema,
          readOnly: tool.readOnly,
          callback: (args) => tool.fn(args as Record<string, string>),
        });
      }
    }

    // ── 2. webmcp.dev library (WebSocket-based MCP, works today) ─────────────
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@jason.today/webmcp@latest/build/webmcp.js';
    script.async = true;
    script.onload = () => {
      const WebMCPClass = (globalThis as unknown as { WebMCP: new (opts: Record<string, unknown>) => {
        registerTool: (
          name: string,
          description: string,
          schema: Record<string, unknown>,
          fn: (args: Record<string, string>) => ToolResult
        ) => void;
      } }).WebMCP;

      if (!WebMCPClass) return;

      const mcp = new WebMCPClass({
        color: '#6366f1',
        position: 'bottom-right',
        size: '36px',
        padding: '12px',
      });

      for (const tool of tools) {
        mcp.registerTool(
          tool.name,
          tool.description,
          tool.inputSchema,
          (args) => tool.fn(args as Record<string, string>)
        );
      }
    };
    document.head.appendChild(script);

    return () => {
      // cleanup: remove script tag when component is destroyed
      script.remove();
    };
  });
</script>
