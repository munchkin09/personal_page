/**
 * Shared Playwright helpers and constants.
 */

export const LOCALES = ['es', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

/** Expected page titles keyed by path (relative to baseURL). */
export const PAGE_TITLES: Record<string, string> = {
  '/es': 'Carlos Ledesma · Quality Engineering Architect · Tech Lead & IA',
  '/en': 'Carlos Ledesma · Quality Engineering Architect · Tech Lead & AI',
  '/es/cv': 'CV · Carlos Ledesma',
  '/en/cv': 'CV · Carlos Ledesma',
  '/es/now': 'Ahora · Carlos Ledesma',
  '/en/now': 'Now · Carlos Ledesma',
};

/** Section IDs present on the landing page. */
export const LANDING_SECTIONS = [
  'about',
  'strengths',
  'skills',
  'projects',
  'experience',
  'blog',
  'contact',
] as const;

/** NavBar link labels for each locale. */
export const NAV_LABELS: Record<Locale, string[]> = {
  // nav.skills is 'Skills' in both locales (intentional branding choice)
  es: ['Sobre mí', 'Fortalezas', 'Skills', 'Proyectos', 'Experiencia', 'Blog', 'Contacto'],
  en: ['About', 'Strengths', 'Skills', 'Projects', 'Experience', 'Blog', 'Contact'],
};
