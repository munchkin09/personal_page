import "../../chunks/index-server.js";
import { R as attr, a as ensure_array_like, c as stringify, i as derived, n as attr_class, r as attr_style, z as escape_html } from "../../chunks/dev.js";
//#region src/routes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let navScrolled = false;
		let activeSection = "hero";
		let cursorX = 0;
		let cursorY = 0;
		let typewriterText = "";
		let hoveredSlice = null;
		const techStack = [
			{
				name: "TypeScript",
				pct: 22,
				color: "#6366f1",
				glow: "rgba(99,102,241,0.5)",
				icon: "⚡",
				category: "Frontend"
			},
			{
				name: "Node.js",
				pct: 20,
				color: "#10b981",
				glow: "rgba(16,185,129,0.5)",
				icon: "🚀",
				category: "Backend"
			},
			{
				name: "AI / LLM",
				pct: 17,
				color: "#8b5cf6",
				glow: "rgba(139,92,246,0.5)",
				icon: "🤖",
				category: "AI"
			},
			{
				name: "System Design",
				pct: 15,
				color: "#f59e0b",
				glow: "rgba(245,158,11,0.5)",
				icon: "🏗️",
				category: "Architecture"
			},
			{
				name: "React/Svelte",
				pct: 10,
				color: "#06b6d4",
				glow: "rgba(6,182,212,0.5)",
				icon: "🎨",
				category: "Frontend"
			},
			{
				name: "Python",
				pct: 8,
				color: "#3b82f6",
				glow: "rgba(59,130,246,0.5)",
				icon: "🐍",
				category: "Backend"
			},
			{
				name: "Docker/K8s",
				pct: 5,
				color: "#ec4899",
				glow: "rgba(236,72,153,0.5)",
				icon: "🐳",
				category: "DevOps"
			},
			{
				name: "PostgreSQL",
				pct: 3,
				color: "#64748b",
				glow: "rgba(100,116,139,0.5)",
				icon: "🗄️",
				category: "Data"
			}
		];
		const CX = 160;
		const CY = 160;
		const R_OUT = 140;
		const R_IN = 72;
		const GAP = 2;
		function polar(r, deg) {
			const rad = (deg - 90) * Math.PI / 180;
			return {
				x: CX + r * Math.cos(rad),
				y: CY + r * Math.sin(rad)
			};
		}
		function slicePath(startDeg, endDeg, expand = 0) {
			const span = endDeg - startDeg;
			if (span >= 359.999) return "";
			const mid = startDeg + span / 2;
			const ox = expand ? Math.cos((mid - 90) * Math.PI / 180) * expand : 0;
			const oy = expand ? Math.sin((mid - 90) * Math.PI / 180) * expand : 0;
			const os = polar(R_OUT, startDeg + GAP / 2);
			const oe = polar(R_OUT, endDeg - GAP / 2);
			const ie = polar(R_IN, endDeg - GAP / 2);
			const is_ = polar(R_IN, startDeg + GAP / 2);
			const large = span > 180 ? 1 : 0;
			return `M ${os.x + ox} ${os.y + oy} A ${R_OUT} ${R_OUT} 0 ${large} 1 ${oe.x + ox} ${oe.y + oy} L ${ie.x + ox} ${ie.y + oy} A ${R_IN} ${R_IN} 0 ${large} 0 ${is_.x + ox} ${is_.y + oy} Z`;
		}
		const slices = derived(() => {
			let cum = 0;
			return techStack.map((item, i) => {
				const start = cum * 3.6;
				cum += item.pct;
				const end = cum * 3.6;
				const mid = start + (end - start) / 2;
				const lp = polar(R_OUT + 22, mid);
				return {
					...item,
					i,
					start,
					end,
					mid,
					path: slicePath(start, end),
					labelPos: lp
				};
			});
		});
		const projects = [
			{
				title: "Personal Page",
				description: "Este mismo sitio — construido con Svelte 5, efectos CSS avanzados y animaciones fluidas.",
				tags: [
					"Svelte 5",
					"TypeScript",
					"CSS",
					"Vite"
				],
				icon: "🌐",
				year: "2026"
			},
			{
				title: "AI-Powered Dashboard",
				description: "Panel analítico que integra modelos LLM para análisis de datos en tiempo real.",
				tags: [
					"React",
					"Python",
					"Claude API",
					"PostgreSQL"
				],
				icon: "📊",
				year: "2025"
			},
			{
				title: "Microservices Platform",
				description: "Arquitectura distribuida con alta disponibilidad, observabilidad y deploys automáticos.",
				tags: [
					"Node.js",
					"Docker",
					"K8s",
					"Redis"
				],
				icon: "⚙️",
				year: "2025"
			},
			{
				title: "Real-Time Collaboration",
				description: "Herramienta de colaboración en tiempo real con WebSockets, OT y conflict resolution.",
				tags: [
					"Svelte",
					"WebSocket",
					"TypeScript",
					"Rust"
				],
				icon: "👥",
				year: "2024"
			}
		];
		const strengths = [
			{
				icon: "🧠",
				title: "Pensamiento sistémico",
				desc: "Capacidad para ver el panorama completo y diseñar soluciones escalables que resisten el paso del tiempo."
			},
			{
				icon: "⚡",
				title: "Velocidad de ejecución",
				desc: "De la idea al código en producción con criterio, sin sacrificar calidad por velocidad."
			},
			{
				icon: "🤝",
				title: "Comunicación técnica",
				desc: "Traduzco conceptos complejos a lenguaje claro, tanto para equipos técnicos como para stakeholders."
			},
			{
				icon: "🔁",
				title: "Aprendizaje continuo",
				desc: "Más de 20 años en la industria con mentalidad de principiante. Siempre actualizándome."
			},
			{
				icon: "🎯",
				title: "Orientación a resultados",
				desc: "Foco en el impacto real del producto, no solo en el código perfectamente elegante."
			},
			{
				icon: "🛡️",
				title: "Código defensivo",
				desc: "Escribo software robusto, seguro y mantenible. La deuda técnica me quita el sueño."
			}
		];
		const timeline = [
			{
				year: "Jun 2024 – Actualidad",
				role: "Arquitecto de Soluciones de Calidad & IA",
				company: "NTT DATA · Madrid (Híbrido)",
				desc: "Rol estratégico de innovación en transformación digital a gran escala. Diseño de agentes IA autónomos con LLMs para verificación y validación del software. Plataforma de generación automática de casos de prueba con IA. Liderazgo de migraciones COBOL a tecnologías modernas. Formación a equipos de Europa y LATAM.",
				highlights: [
					"Agentes IA para QA",
					"Test Case Generation",
					"Migración COBOL",
					"Europa & LATAM"
				]
			},
			{
				year: "Feb 2021 – Jun 2024",
				role: "QA Automation Lead / Developer",
				company: "Capitole Consulting · Cliente: BBVA · Madrid",
				desc: "Liderazgo técnico en automatización de pruebas para uno de los mayores bancos de Europa. Arquitectura de frameworks con Selenium, Cucumber y WebdriverIO. Integración de herramientas de calidad en el SDLC para detección temprana de errores. Capas de abstracción para stakeholders no técnicos.",
				highlights: [
					"Selenium",
					"Cucumber",
					"WebdriverIO",
					"BBVA"
				]
			},
			{
				year: "Sep 2018 – Jul 2021",
				role: "Senior Full-Stack Developer",
				company: "Centum Digital · Madrid",
				desc: "Infraestructura de microservicios integrada con AWS Device Farm para validación de dispositivos IoT y móviles a escala. Automatización multi-plataforma: Smartphones, Smart TVs, STBs y WebApps.",
				highlights: [
					"Microservicios",
					"AWS Device Farm",
					"IoT",
					"Multi-plataforma"
				]
			},
			{
				year: "2013 – 2018",
				role: "Consultor Full Stack & Web Developer",
				company: "Freelance · Madrid",
				desc: "Proyectos para clientes como Wunderman (Land Rover), Anlddea, Informatiz@rte y Meollo. Full Stack con CakePHP, jQuery, APIs SOAP/JSON y arquitectura MVC para sectores automoción, cooperación ciudadana y agrícola.",
				highlights: [
					"Land Rover",
					"CakePHP",
					"APIs SOAP",
					"eCommerce"
				]
			},
			{
				year: "2010 – 2013",
				role: "Ingeniero de Software",
				company: "ATOS – DAESA · Cliente: BBVA · Madrid",
				desc: "Diseño y desarrollo de software para monitoreo de SLAs, procesos ETL y herramientas de gestión de stock para centros del grupo BBVA.",
				highlights: [
					"SLA Monitoring",
					"ETL",
					"BBVA",
					"Java"
				]
			}
		];
		const navLinks = [
			{
				id: "about",
				label: "Sobre mí"
			},
			{
				id: "strengths",
				label: "Fortalezas"
			},
			{
				id: "skills",
				label: "Skills"
			},
			{
				id: "projects",
				label: "Proyectos"
			},
			{
				id: "experience",
				label: "Experiencia"
			},
			{
				id: "contact",
				label: "Contacto"
			}
		];
		$$renderer.push(`<div class="cursor svelte-1uha8ag"${attr_style(`left:${stringify(cursorX)}px; top:${stringify(cursorY)}px; opacity:${stringify(0)}`)}></div> <div class="cursor-dot svelte-1uha8ag"${attr_style(`left:${stringify(cursorX)}px; top:${stringify(cursorY)}px; opacity:${stringify(0)}`)}></div> <nav${attr_class("svelte-1uha8ag", void 0, { "scrolled": navScrolled })}><a href="#hero" class="logo svelte-1uha8ag">CL<span class="svelte-1uha8ag">.</span></a> <ul class="svelte-1uha8ag"><!--[-->`);
		const each_array = ensure_array_like(navLinks);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let link = each_array[$$index];
			$$renderer.push(`<li class="svelte-1uha8ag"><a${attr("href", `#${stringify(link.id)}`)}${attr_class("svelte-1uha8ag", void 0, { "active": activeSection === link.id })}>${escape_html(link.label)}</a></li>`);
		}
		$$renderer.push(`<!--]--></ul> <div class="nav-actions svelte-1uha8ag"><a href="/cv" class="nav-cv svelte-1uha8ag" title="Ver CV imprimible"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-1uha8ag"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" class="svelte-1uha8ag"></path><path d="M14 2v6h6" class="svelte-1uha8ag"></path><path d="M8 13h8M8 17h5" class="svelte-1uha8ag"></path></svg> CV</a> <a href="mailto:developer1983@gmail.com" class="nav-cta magnetic svelte-1uha8ag">Contáctame</a></div></nav> <section id="hero" class="hero svelte-1uha8ag"><canvas class="particle-canvas svelte-1uha8ag"></canvas> <div class="aurora svelte-1uha8ag"><div class="aurora-1 svelte-1uha8ag"></div> <div class="aurora-2 svelte-1uha8ag"></div> <div class="aurora-3 svelte-1uha8ag"></div></div> <div class="hero-content svelte-1uha8ag"><div class="hero-badge fade-in svelte-1uha8ag"><span class="pulse-dot svelte-1uha8ag"></span> Disponible para proyectos</div> <h1 class="hero-name fade-in svelte-1uha8ag"><span class="name-line svelte-1uha8ag">Carlos</span> <span class="name-line gradient-text svelte-1uha8ag">Ledesma</span></h1> <p class="hero-role fade-in svelte-1uha8ag"><span class="role-prefix svelte-1uha8ag">//</span> <span class="typewriter svelte-1uha8ag">${escape_html(typewriterText)}</span> <span class="cursor-blink svelte-1uha8ag">|</span></p> <p class="hero-subtitle fade-in svelte-1uha8ag">Tech Lead · Arquitecto de Calidad &amp; IA · Full Stack Senior<br class="svelte-1uha8ag"/> +13 años transformando ingeniería en impacto real — desde la banca hasta la IA generativa.</p> <div class="hero-actions fade-in svelte-1uha8ag"><a href="#projects" class="btn-primary magnetic svelte-1uha8ag"><span class="svelte-1uha8ag">Ver proyectos</span> <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="svelte-1uha8ag"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="svelte-1uha8ag"></path></svg></a> <a href="mailto:developer1983@gmail.com" class="btn-secondary magnetic svelte-1uha8ag">Hablemos</a> <a href="/cv" class="btn-secondary magnetic svelte-1uha8ag"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-1uha8ag"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" class="svelte-1uha8ag"></path><path d="M14 2v6h6" class="svelte-1uha8ag"></path></svg> CV imprimible</a></div> <div class="hero-stats fade-in svelte-1uha8ag"><div class="stat svelte-1uha8ag"><span class="stat-number svelte-1uha8ag">13+</span><span class="stat-label svelte-1uha8ag">Años de experiencia</span></div> <div class="stat-divider svelte-1uha8ag"></div> <div class="stat svelte-1uha8ag"><span class="stat-number svelte-1uha8ag">2</span><span class="stat-label svelte-1uha8ag">Continentes impactados</span></div> <div class="stat-divider svelte-1uha8ag"></div> <div class="stat svelte-1uha8ag"><span class="stat-number svelte-1uha8ag">∞</span><span class="stat-label svelte-1uha8ag">Bugs detectados antes</span></div></div></div> <div class="scroll-hint svelte-1uha8ag"><span class="svelte-1uha8ag">scroll</span><div class="scroll-line svelte-1uha8ag"></div></div></section> <section id="about" class="about svelte-1uha8ag"><div class="container svelte-1uha8ag"><div class="about-grid svelte-1uha8ag"><div class="about-visual fade-in svelte-1uha8ag"><div class="avatar-wrapper svelte-1uha8ag"><div class="avatar-ring svelte-1uha8ag"></div> <div class="avatar-ring ring-2 svelte-1uha8ag"></div> <div class="avatar svelte-1uha8ag"><span class="avatar-initials svelte-1uha8ag">CL</span></div> <div class="avatar-badge svelte-1uha8ag">Senior</div></div> <div class="about-tags svelte-1uha8ag"><!--[-->`);
		const each_array_1 = ensure_array_like([
			"TypeScript",
			"Python",
			"Agentes IA",
			"QA Architecture",
			"AWS",
			"COBOL Migration"
		]);
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let tag = each_array_1[$$index_1];
			$$renderer.push(`<span class="tech-tag svelte-1uha8ag">${escape_html(tag)}</span>`);
		}
		$$renderer.push(`<!--]--></div></div> <div class="about-text fade-in svelte-1uha8ag"><p class="section-label svelte-1uha8ag">Sobre mí</p> <h2 class="svelte-1uha8ag">Tech Lead en la intersección de <span class="gradient-text svelte-1uha8ag">Calidad e IA</span></h2> <p class="svelte-1uha8ag">Soy Tech Lead y Arquitecto de Software con +13 años de experiencia en el ciclo completo del software (SDLC), especializado en la intersección entre <strong class="svelte-1uha8ag">Ingeniería de Calidad</strong>, <strong class="svelte-1uha8ag">Automatización</strong> e <strong class="svelte-1uha8ag">Inteligencia Artificial Generativa</strong>.</p> <p class="svelte-1uha8ag">He liderado modernizaciones de ecosistemas legado —incluyendo migraciones de <strong class="svelte-1uha8ag">COBOL a tecnologías modernas</strong>— y el diseño de <strong class="svelte-1uha8ag">Agentes IA aplicados a calidad</strong> en grandes corporaciones bancarias como BBVA, con impacto directo en equipos de Europa y LATAM.</p> <p class="svelte-1uha8ag">Mi diferencial: entiendo el problema de calidad <strong class="svelte-1uha8ag">desde la arquitectura</strong>, no solo desde el testing. Combino base técnica sólida con capacidad real de liderazgo, mentoring y traducción de necesidades de negocio en soluciones accionables.</p> <div class="about-links svelte-1uha8ag"><a href="mailto:developer1983@gmail.com" class="about-link svelte-1uha8ag"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-1uha8ag"><rect x="2" y="4" width="20" height="16" rx="2" class="svelte-1uha8ag"></rect><path d="m2 7 10 7 10-7" class="svelte-1uha8ag"></path></svg> developer1983@gmail.com</a> <a href="https://github.com" target="_blank" rel="noopener" class="about-link svelte-1uha8ag"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="svelte-1uha8ag"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" class="svelte-1uha8ag"></path></svg> GitHub</a> <a href="https://linkedin.com" target="_blank" rel="noopener" class="about-link svelte-1uha8ag"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="svelte-1uha8ag"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" class="svelte-1uha8ag"></path></svg> LinkedIn</a></div></div></div></div></section> <section id="strengths" class="strengths svelte-1uha8ag"><div class="container svelte-1uha8ag"><div class="section-header fade-in svelte-1uha8ag"><p class="section-label svelte-1uha8ag">Qué me diferencia</p> <h2 class="svelte-1uha8ag">Mis puntos <span class="gradient-text svelte-1uha8ag">fuertes</span></h2> <p class="section-sub svelte-1uha8ag">No solo escribo código. Construyo sistemas, lidero equipos y genero impacto.</p></div> <div class="strengths-grid svelte-1uha8ag"><!--[-->`);
		const each_array_2 = ensure_array_like(strengths);
		for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
			let s = each_array_2[i];
			$$renderer.push(`<div class="strength-card fade-in svelte-1uha8ag"${attr_style(`transition-delay: ${stringify(i * 80)}ms`)}><div class="strength-icon svelte-1uha8ag">${escape_html(s.icon)}</div> <h3 class="svelte-1uha8ag">${escape_html(s.title)}</h3> <p class="svelte-1uha8ag">${escape_html(s.desc)}</p> <div class="card-glow svelte-1uha8ag"></div></div>`);
		}
		$$renderer.push(`<!--]--></div></div></section> <section id="skills" class="skills-section svelte-1uha8ag"><div class="container svelte-1uha8ag"><div class="section-header fade-in svelte-1uha8ag"><p class="section-label svelte-1uha8ag">Toolkit</p> <h2 class="svelte-1uha8ag">Stack <span class="gradient-text svelte-1uha8ag">técnico</span></h2> <p class="section-sub svelte-1uha8ag">Hover cada porción para ver el detalle de cada tecnología.</p></div> <div class="chart-layout fade-in svelte-1uha8ag"><div class="chart-wrap svelte-1uha8ag"><svg viewBox="0 0 320 320" class="pie-svg svelte-1uha8ag" role="img" aria-label="Tech stack pie chart"><defs class="svelte-1uha8ag"><!--[-->`);
		const each_array_3 = ensure_array_like(slices());
		for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
			let s = each_array_3[$$index_3];
			$$renderer.push(`<radialGradient${attr("id", `grad-${stringify(s.i)}`)} cx="50%" cy="50%" r="50%" class="svelte-1uha8ag"><stop offset="0%"${attr("stop-color", s.color)} stop-opacity="1" class="svelte-1uha8ag"></stop><stop offset="100%"${attr("stop-color", s.color)} stop-opacity="0.7" class="svelte-1uha8ag"></stop></radialGradient>`);
		}
		$$renderer.push(`<!--]--></defs><!--[-->`);
		const each_array_4 = ensure_array_like(slices());
		for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
			let s = each_array_4[$$index_4];
			$$renderer.push(`<path${attr("d", hoveredSlice === s.i ? slicePath(s.start, s.end, 10) : s.path)}${attr("fill", `url(#grad-${stringify(s.i)})`)} class="pie-slice svelte-1uha8ag"${attr_style(`--delay:${stringify(s.i * 55)}ms; opacity:${stringify(hoveredSlice === null || hoveredSlice === s.i ? 1 : .3)}; filter:${stringify(hoveredSlice === s.i ? `drop-shadow(0 0 12px ${s.glow})` : "none")}`)} role="presentation"></path>`);
		}
		$$renderer.push(`<!--]-->`);
		if (hoveredSlice !== null) {
			$$renderer.push("<!--[0-->");
			const s = slices()[hoveredSlice];
			$$renderer.push(`<text${attr("x", CX)}${attr("y", CY - 18)} text-anchor="middle" class="c-icon svelte-1uha8ag">${escape_html(s.icon)}</text><text${attr("x", CX)}${attr("y", CY + 10)} text-anchor="middle" class="c-name svelte-1uha8ag">${escape_html(s.name)}</text><text${attr("x", CX)}${attr("y", CY + 32)} text-anchor="middle" class="c-pct svelte-1uha8ag"${attr_style(`fill:${stringify(s.color)}`)}>${escape_html(s.pct)}%</text>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<text${attr("x", CX)}${attr("y", CY + 6)} text-anchor="middle" class="c-total svelte-1uha8ag">100%</text><text${attr("x", CX)}${attr("y", CY + 26)} text-anchor="middle" class="c-sub svelte-1uha8ag">Stack</text>`);
		}
		$$renderer.push(`<!--]--></svg></div> <div class="legend-grid svelte-1uha8ag"><!--[-->`);
		const each_array_5 = ensure_array_like(slices());
		for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
			let s = each_array_5[$$index_5];
			$$renderer.push(`<div${attr_class("legend-item svelte-1uha8ag", void 0, {
				"is-hovered": hoveredSlice === s.i,
				"is-dimmed": hoveredSlice !== null && hoveredSlice !== s.i
			})} role="presentation"><span class="ldot svelte-1uha8ag"${attr_style(`background:${stringify(s.color)}; box-shadow:0 0 8px ${stringify(s.glow)}`)}></span> <span class="licon svelte-1uha8ag">${escape_html(s.icon)}</span> <div class="linfo svelte-1uha8ag"><span class="lname svelte-1uha8ag">${escape_html(s.name)}</span> <span class="lcat svelte-1uha8ag">${escape_html(s.category)}</span></div> <span class="lpct svelte-1uha8ag"${attr_style(`color:${stringify(s.color)}`)}>${escape_html(s.pct)}%</span></div>`);
		}
		$$renderer.push(`<!--]--></div></div> <div class="extra-skills fade-in svelte-1uha8ag"><!--[-->`);
		const each_array_6 = ensure_array_like([
			"Git",
			"CI/CD",
			"WebSockets",
			"REST",
			"GraphQL",
			"gRPC",
			"Rust",
			"Go",
			"Linux",
			"AWS",
			"Vercel",
			"Cloudflare",
			"Vitest",
			"Playwright",
			"Figma",
			"Agile/Scrum"
		]);
		for (let $$index_6 = 0, $$length = each_array_6.length; $$index_6 < $$length; $$index_6++) {
			let tag = each_array_6[$$index_6];
			$$renderer.push(`<span class="extra-tag svelte-1uha8ag">${escape_html(tag)}</span>`);
		}
		$$renderer.push(`<!--]--></div></div></section> <section id="projects" class="projects-section svelte-1uha8ag"><div class="container svelte-1uha8ag"><div class="section-header fade-in svelte-1uha8ag"><p class="section-label svelte-1uha8ag">Trabajo reciente</p> <h2 class="svelte-1uha8ag">Proyectos <span class="gradient-text svelte-1uha8ag">destacados</span></h2></div> <div class="projects-grid svelte-1uha8ag"><!--[-->`);
		const each_array_7 = ensure_array_like(projects);
		for (let i = 0, $$length = each_array_7.length; i < $$length; i++) {
			let project = each_array_7[i];
			$$renderer.push(`<div class="project-card fade-in svelte-1uha8ag"${attr_style(`transition-delay: ${stringify(i * 100)}ms`)}><div class="project-header svelte-1uha8ag"><span class="project-icon svelte-1uha8ag">${escape_html(project.icon)}</span> <span class="project-year svelte-1uha8ag">${escape_html(project.year)}</span></div> <h3 class="svelte-1uha8ag">${escape_html(project.title)}</h3> <p class="svelte-1uha8ag">${escape_html(project.description)}</p> <div class="project-tags svelte-1uha8ag"><!--[-->`);
			const each_array_8 = ensure_array_like(project.tags);
			for (let $$index_7 = 0, $$length = each_array_8.length; $$index_7 < $$length; $$index_7++) {
				let tag = each_array_8[$$index_7];
				$$renderer.push(`<span class="project-tag svelte-1uha8ag">${escape_html(tag)}</span>`);
			}
			$$renderer.push(`<!--]--></div> <div class="project-sheen svelte-1uha8ag"></div></div>`);
		}
		$$renderer.push(`<!--]--></div></div></section> <section id="experience" class="experience-section svelte-1uha8ag"><div class="container svelte-1uha8ag"><div class="section-header fade-in svelte-1uha8ag"><p class="section-label svelte-1uha8ag">Trayectoria</p> <h2 class="svelte-1uha8ag">+13 años en la <span class="gradient-text svelte-1uha8ag">industria</span></h2> <p class="section-sub svelte-1uha8ag">De la ingeniería clásica a los agentes IA, pasando por banca, IoT y consultoría.</p></div> <div class="timeline svelte-1uha8ag"><!--[-->`);
		const each_array_9 = ensure_array_like(timeline);
		for (let i = 0, $$length = each_array_9.length; i < $$length; i++) {
			let item = each_array_9[i];
			$$renderer.push(`<div class="timeline-item fade-in svelte-1uha8ag"${attr_style(`transition-delay: ${stringify(i * 120)}ms`)}><div class="timeline-dot svelte-1uha8ag"></div> <div class="timeline-content svelte-1uha8ag"><span class="timeline-year svelte-1uha8ag">${escape_html(item.year)}</span> <h3 class="svelte-1uha8ag">${escape_html(item.role)}</h3> <span class="timeline-company svelte-1uha8ag">${escape_html(item.company)}</span> <p class="svelte-1uha8ag">${escape_html(item.desc)}</p> <div class="timeline-tags svelte-1uha8ag"><!--[-->`);
			const each_array_10 = ensure_array_like(item.highlights);
			for (let $$index_9 = 0, $$length = each_array_10.length; $$index_9 < $$length; $$index_9++) {
				let h = each_array_10[$$index_9];
				$$renderer.push(`<span class="tl-tag svelte-1uha8ag">${escape_html(h)}</span>`);
			}
			$$renderer.push(`<!--]--></div></div></div>`);
		}
		$$renderer.push(`<!--]--></div></div></section> <section id="contact" class="contact-section svelte-1uha8ag"><div class="container svelte-1uha8ag"><div class="contact-inner fade-in svelte-1uha8ag"><div class="contact-glow-bg svelte-1uha8ag"></div> <p class="section-label svelte-1uha8ag">¿Trabajamos juntos?</p> <h2 class="svelte-1uha8ag">Hablemos de tu <span class="gradient-text svelte-1uha8ag">próximo proyecto</span></h2> <p class="contact-sub svelte-1uha8ag">Siempre abierto a nuevos retos, colaboraciones y conversaciones interesantes. Ya sea un proyecto completo, una consultoría puntual o simplemente una charla técnica.</p> <a href="mailto:developer1983@gmail.com" class="btn-primary magnetic contact-btn svelte-1uha8ag"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-1uha8ag"><rect x="2" y="4" width="20" height="16" rx="2" class="svelte-1uha8ag"></rect><path d="m2 7 10 7 10-7" class="svelte-1uha8ag"></path></svg> Envíame un email</a> <div class="contact-socials svelte-1uha8ag"><a href="https://github.com" target="_blank" rel="noopener" class="social-link magnetic svelte-1uha8ag">GitHub</a> <span class="social-sep svelte-1uha8ag">·</span> <a href="https://linkedin.com" target="_blank" rel="noopener" class="social-link magnetic svelte-1uha8ag">LinkedIn</a> <span class="social-sep svelte-1uha8ag">·</span> <a href="https://twitter.com" target="_blank" rel="noopener" class="social-link magnetic svelte-1uha8ag">Twitter / X</a></div></div></div></section> <footer class="svelte-1uha8ag"><p class="svelte-1uha8ag">© 2026 Carlos Ledesma · Hecho con <span class="heart svelte-1uha8ag">♥</span> y <strong class="svelte-1uha8ag">Svelte 5</strong></p></footer>`);
	});
}
//#endregion
export { _page as default };
