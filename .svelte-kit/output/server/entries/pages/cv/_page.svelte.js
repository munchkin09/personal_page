import { R as attr, a as ensure_array_like, c as stringify, o as head, z as escape_html } from "../../../chunks/dev.js";
//#region src/routes/cv/+page.svelte
function _page($$renderer) {
	const profile = {
		name: "Carlos Ledesma Castejón",
		title: "Tech Lead · Arquitecto de Soluciones de Calidad & IA · Full Stack Senior",
		location: "Madrid, España",
		phone: "+34 680 33 24 30",
		email: "developer1983@gmail.com",
		linkedin: "linkedin.com/in/carlos-ledesma",
		github: "github.com/carlos-ledesma",
		website: "carlosledesma.dev",
		summary: [
			"Tech Lead y Arquitecto de Software con +13 años de experiencia en el ciclo completo del software (SDLC), especializado en la intersección entre Ingeniería de Calidad, Automatización e Inteligencia Artificial Generativa.",
			"He liderado la modernización de ecosistemas legado —incluyendo migraciones de COBOL a tecnologías modernas— y el diseño de Agentes IA aplicados a calidad en grandes corporaciones bancarias y tecnológicas, con impacto directo en equipos de Europa y LATAM.",
			"Mi diferencial: entiendo el problema de calidad desde la arquitectura, no solo desde el testing."
		]
	};
	const experience = [
		{
			company: "NTT DATA",
			location: "Madrid (Híbrido)",
			role: "Arquitecto de Soluciones de Calidad & IA",
			period: "Jun 2024 – Actualidad",
			context: "Rol estratégico de innovación tecnológica aplicada al ciclo de vida del software en un contexto de transformación digital a gran escala.",
			bullets: [
				{
					k: "Agentes IA para Calidad",
					v: "Diseño y desarrollo de agentes autónomos con LLMs orientados a la verificación, validación y análisis de calidad del software, reduciendo la intervención manual en procesos críticos del SDLC."
				},
				{
					k: "Test Case Generation",
					v: "Desarrollé una plataforma de generación automática de casos de prueba con IA, democratizando el acceso al testing para perfiles no técnicos y acelerando el tiempo de diseño."
				},
				{
					k: "Migración COBOL",
					v: "Lidero proyectos de modernización de código legado COBOL con pipelines asistidos por IA para análisis, documentación y traducción a lenguajes mantenibles, reduciendo deuda técnica acumulada durante décadas."
				},
				{
					k: "Transferencia de conocimiento",
					v: "Imparto cursos y talleres técnicos y lidero iniciativas de adopción de IA para equipos de calidad en Europa y LATAM, asegurando una implantación efectiva y sostenible."
				},
				{
					k: "Estrategia transversal",
					v: "Defino soluciones de análisis de calidad integradas en el SDLC que garantizan mantenibilidad, trazabilidad y eficiencia en el delivery a escala corporativa."
				}
			]
		},
		{
			company: "Capitole Consulting",
			location: "Cliente: BBVA · Madrid",
			role: "QA Automation Lead / Developer",
			period: "Feb 2021 – Jun 2024",
			context: "Liderazgo técnico en la evolución y estandarización de frameworks de automatización para uno de los mayores bancos de Europa.",
			bullets: [
				{
					k: "Arquitectura de frameworks",
					v: "Diseñé e implementé soluciones de automatización con Selenium, Cucumber y WebdriverIO, aumentando la cobertura en flujos críticos de negocio."
				},
				{
					k: "Integración SDLC",
					v: "Desarrollé herramientas de control de calidad embebidas en el ciclo de vida, habilitando detección temprana de errores y reduciendo el coste del bug fixing."
				},
				{
					k: "Legibilidad y adopción",
					v: "Implementé capas de abstracción y reporting que hicieron las pruebas automatizadas comprensibles para stakeholders no técnicos, acelerando la aprobación de releases."
				}
			]
		},
		{
			company: "Centum Digital",
			location: "Madrid",
			role: "Senior Full-Stack Developer",
			period: "Sep 2018 – Jul 2021",
			context: "Desarrollo de infraestructura compleja para validación de dispositivos IoT y móviles a escala.",
			bullets: [
				{
					k: "Microservicios + AWS Device Farm",
					v: "Diseñé y mantuve una infraestructura orientada a microservicios integrada con AWS Device Farm para validación en la nube de múltiples tipologías de dispositivo."
				},
				{
					k: "Automatización multi-plataforma",
					v: "Lideré el análisis y refactorización de herramientas de testing para un ecosistema heterogéneo: Smartphones, Smart TVs, STBs y WebApps."
				},
				{
					k: "Productividad de equipos",
					v: "Creé flujos de trabajo eficientes que redujeron la carga operativa del departamento y mejoraron el soporte a usuarios de la plataforma."
				}
			]
		},
		{
			company: "Freelance / Consultoría tecnológica",
			location: "Madrid",
			role: "Consultor Full Stack & Web Developer",
			period: "2013 – 2018",
			context: "Proyectos end-to-end para clientes corporativos y PYMEs.",
			bullets: [
				{
					k: "Wunderman (Land Rover)",
					v: "Desarrollo Full Stack con CakePHP y jQuery/Bootstrap para campañas digitales de alto tráfico."
				},
				{
					k: "Anlddea",
					v: "Arquitectura y prototipado de red social para cooperación ciudadana y financiación de PYMEs (MVC, HTML5/JS)."
				},
				{
					k: "Informatiz@rte",
					v: "Integración de APIs SOAP y consumo de datos JSON para el sector agrícola."
				},
				{
					k: "Meollo",
					v: "Consultoría estratégica de eCommerce y gestión de presencia digital."
				}
			]
		},
		{
			company: "Atos – DAESA",
			location: "Cliente: BBVA · Madrid",
			role: "Ingeniero de Software",
			period: "2010 – 2013",
			context: "Diseño y desarrollo de software para monitoreo de SLAs, procesos ETL y herramientas de gestión de stock para centros del grupo BBVA.",
			bullets: []
		}
	];
	const skills = [
		{
			group: "Liderazgo & Estrategia",
			items: [
				"Arquitectura de Software",
				"Mentoring técnico",
				"Modernización de Legado",
				"Agile / Scrum",
				"Gestión de Stakeholders"
			]
		},
		{
			group: "IA & Modernización",
			items: [
				"Agentes IA",
				"GenAI aplicada a código",
				"LLMs (OpenAI, Claude)",
				"Test Case Generation",
				"Análisis estático",
				"Migración COBOL"
			]
		},
		{
			group: "Lenguajes",
			items: [
				"JavaScript / TypeScript (Experto)",
				"Python",
				"Bash",
				"PowerShell",
				"COBOL (análisis y migración)"
			]
		},
		{
			group: "QA & Testing",
			items: [
				"Selenium",
				"Cucumber",
				"WebdriverIO",
				"Cypress",
				"Jest",
				"Playwright",
				"ESLint"
			]
		},
		{
			group: "Cloud & DevOps",
			items: [
				"AWS (EC2, RDS, S3, Device Farm)",
				"Docker",
				"Jenkins",
				"GitLab CI",
				"Linux",
				"Git"
			]
		},
		{
			group: "Formación & Adopción",
			items: [
				"Diseño de cursos técnicos",
				"Talleres de IA",
				"Onboarding de equipos",
				"Evangelización tecnológica"
			]
		}
	];
	const languages = [{
		lang: "Español",
		level: "Nativo"
	}, {
		lang: "Inglés",
		level: "Competencia profesional"
	}];
	const education = [{
		title: "Bootcamp Full Stack Web & Mobile",
		org: "Keep Coding, Madrid",
		period: "2016 – 2017"
	}, {
		title: "Técnico Superior en Desarrollo de Aplicaciones Informáticas",
		org: "Cámara de Comercio de Madrid",
		period: "2007 – 2009"
	}];
	const highlights = [
		{
			n: "13+",
			l: "años de experiencia"
		},
		{
			n: "2",
			l: "continentes (EU & LATAM)"
		},
		{
			n: "BBVA",
			l: "cliente bancario Top EU"
		},
		{
			n: "LLMs",
			l: "aplicados a QA y legacy"
		}
	];
	head("14tzwpa", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>CV · Carlos Ledesma — Tech Lead QA &amp; IA</title>`);
		});
		$$renderer.push(`<meta name="description" content="Currículum imprimible de Carlos Ledesma — Tech Lead, Arquitecto de Calidad &amp; IA, Full Stack Senior." class="svelte-14tzwpa"/> <meta name="robots" content="index,follow" class="svelte-14tzwpa"/>`);
	});
	$$renderer.push(`<div class="toolbar no-print svelte-14tzwpa"><a href="/" class="tool-link svelte-14tzwpa" aria-label="Volver al portfolio"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" class="svelte-14tzwpa"><path d="M13 8H3M7 4 3 8l4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="svelte-14tzwpa"></path></svg> Volver al portfolio</a> <div class="tool-actions svelte-14tzwpa"><button type="button" class="btn ghost svelte-14tzwpa"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="svelte-14tzwpa"><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v7H6z" class="svelte-14tzwpa"></path></svg> Imprimir</button> <button type="button" class="btn primary svelte-14tzwpa"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="svelte-14tzwpa"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" class="svelte-14tzwpa"></path></svg> Descargar PDF</button></div></div> <main class="sheet svelte-14tzwpa" aria-label="Currículum Carlos Ledesma"><header class="head svelte-14tzwpa"><div class="head-main svelte-14tzwpa"><h1 class="svelte-14tzwpa">${escape_html(profile.name)}</h1> <p class="title svelte-14tzwpa">${escape_html(profile.title)}</p></div> <ul class="contact svelte-14tzwpa"><li class="svelte-14tzwpa"><span class="label svelte-14tzwpa">Ubicación</span>${escape_html(profile.location)}</li> <li class="svelte-14tzwpa"><span class="label svelte-14tzwpa">Teléfono</span><a href="tel:+34680332430" class="svelte-14tzwpa">${escape_html(profile.phone)}</a></li> <li class="svelte-14tzwpa"><span class="label svelte-14tzwpa">Email</span><a${attr("href", `mailto:${stringify(profile.email)}`)} class="svelte-14tzwpa">${escape_html(profile.email)}</a></li> <li class="svelte-14tzwpa"><span class="label svelte-14tzwpa">LinkedIn</span><a${attr("href", `https://${stringify(profile.linkedin)}`)} target="_blank" rel="noopener" class="svelte-14tzwpa">${escape_html(profile.linkedin)}</a></li> <li class="svelte-14tzwpa"><span class="label svelte-14tzwpa">GitHub</span><a${attr("href", `https://${stringify(profile.github)}`)} target="_blank" rel="noopener" class="svelte-14tzwpa">${escape_html(profile.github)}</a></li> <li class="svelte-14tzwpa"><span class="label svelte-14tzwpa">Web</span><a${attr("href", `https://${stringify(profile.website)}`)} target="_blank" rel="noopener" class="svelte-14tzwpa">${escape_html(profile.website)}</a></li></ul></header> <section class="highlights svelte-14tzwpa" aria-label="Métricas clave"><!--[-->`);
	const each_array = ensure_array_like(highlights);
	for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
		let h = each_array[$$index];
		$$renderer.push(`<div class="hl svelte-14tzwpa"><span class="hl-n svelte-14tzwpa">${escape_html(h.n)}</span><span class="hl-l svelte-14tzwpa">${escape_html(h.l)}</span></div>`);
	}
	$$renderer.push(`<!--]--></section> <div class="grid svelte-14tzwpa"><div class="col-main svelte-14tzwpa"><section class="svelte-14tzwpa"><h2 class="svelte-14tzwpa">Perfil</h2> <!--[-->`);
	const each_array_1 = ensure_array_like(profile.summary);
	for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
		let p = each_array_1[$$index_1];
		$$renderer.push(`<p class="lead svelte-14tzwpa">${escape_html(p)}</p>`);
	}
	$$renderer.push(`<!--]--></section> <section class="svelte-14tzwpa"><h2 class="svelte-14tzwpa">Experiencia</h2> <div class="timeline svelte-14tzwpa"><!--[-->`);
	const each_array_2 = ensure_array_like(experience);
	for (let $$index_3 = 0, $$length = each_array_2.length; $$index_3 < $$length; $$index_3++) {
		let job = each_array_2[$$index_3];
		$$renderer.push(`<article class="job svelte-14tzwpa"><header class="job-head svelte-14tzwpa"><div class="svelte-14tzwpa"><h3 class="svelte-14tzwpa">${escape_html(job.role)}</h3> <p class="org svelte-14tzwpa">${escape_html(job.company)} <span class="sep svelte-14tzwpa">·</span> <span class="loc svelte-14tzwpa">${escape_html(job.location)}</span></p></div> <span class="period svelte-14tzwpa">${escape_html(job.period)}</span></header> `);
		if (job.context) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="context svelte-14tzwpa">${escape_html(job.context)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (job.bullets.length) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<ul class="bullets svelte-14tzwpa"><!--[-->`);
			const each_array_3 = ensure_array_like(job.bullets);
			for (let $$index_2 = 0, $$length = each_array_3.length; $$index_2 < $$length; $$index_2++) {
				let b = each_array_3[$$index_2];
				$$renderer.push(`<li class="svelte-14tzwpa"><strong class="svelte-14tzwpa">${escape_html(b.k)}.</strong> ${escape_html(b.v)}</li>`);
			}
			$$renderer.push(`<!--]--></ul>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></article>`);
	}
	$$renderer.push(`<!--]--></div></section></div> <aside class="col-side svelte-14tzwpa"><section class="svelte-14tzwpa"><h2 class="svelte-14tzwpa">Stack técnico</h2> <div class="skills svelte-14tzwpa"><!--[-->`);
	const each_array_4 = ensure_array_like(skills);
	for (let $$index_5 = 0, $$length = each_array_4.length; $$index_5 < $$length; $$index_5++) {
		let g = each_array_4[$$index_5];
		$$renderer.push(`<div class="skill-group svelte-14tzwpa"><h4 class="svelte-14tzwpa">${escape_html(g.group)}</h4> <ul class="tags svelte-14tzwpa"><!--[-->`);
		const each_array_5 = ensure_array_like(g.items);
		for (let $$index_4 = 0, $$length = each_array_5.length; $$index_4 < $$length; $$index_4++) {
			let it = each_array_5[$$index_4];
			$$renderer.push(`<li class="svelte-14tzwpa">${escape_html(it)}</li>`);
		}
		$$renderer.push(`<!--]--></ul></div>`);
	}
	$$renderer.push(`<!--]--></div></section> <section class="svelte-14tzwpa"><h2 class="svelte-14tzwpa">Idiomas</h2> <ul class="plain svelte-14tzwpa"><!--[-->`);
	const each_array_6 = ensure_array_like(languages);
	for (let $$index_6 = 0, $$length = each_array_6.length; $$index_6 < $$length; $$index_6++) {
		let l = each_array_6[$$index_6];
		$$renderer.push(`<li class="svelte-14tzwpa"><strong class="svelte-14tzwpa">${escape_html(l.lang)}</strong> — ${escape_html(l.level)}</li>`);
	}
	$$renderer.push(`<!--]--></ul></section> <section class="svelte-14tzwpa"><h2 class="svelte-14tzwpa">Formación</h2> <ul class="plain svelte-14tzwpa"><!--[-->`);
	const each_array_7 = ensure_array_like(education);
	for (let $$index_7 = 0, $$length = each_array_7.length; $$index_7 < $$length; $$index_7++) {
		let e = each_array_7[$$index_7];
		$$renderer.push(`<li class="svelte-14tzwpa"><strong class="svelte-14tzwpa">${escape_html(e.title)}</strong> <span class="muted svelte-14tzwpa">${escape_html(e.org)}</span> <span class="muted mono svelte-14tzwpa">${escape_html(e.period)}</span></li>`);
	}
	$$renderer.push(`<!--]--></ul></section> <section class="callout svelte-14tzwpa"><h4 class="svelte-14tzwpa">Disponibilidad</h4> <p class="svelte-14tzwpa">Abierto a nuevas oportunidades como Tech Lead / Solution Architect en entornos de QA + IA, modernización de legacy y plataformas Full Stack.</p></section></aside></div> <footer class="foot svelte-14tzwpa"><span class="svelte-14tzwpa">Referencias disponibles bajo petición</span> <span class="mono svelte-14tzwpa">carlosledesma.dev · Madrid, España</span></footer></main>`);
}
//#endregion
export { _page as default };
