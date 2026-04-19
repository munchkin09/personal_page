import { browser } from '$app/environment';
import { es } from './es';
import { en } from './en';

export const SUPPORTED_LOCALES = ['es', 'en'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'es';

export const dictionaries = { es, en } as const;
export type Dict = typeof es;

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function detectLocale(): Locale {
  if (!browser) return DEFAULT_LOCALE;
  const stored = localStorage.getItem('locale');
  if (isLocale(stored)) return stored;
  const nav = (navigator.language || '').slice(0, 2).toLowerCase();
  return isLocale(nav) ? nav : DEFAULT_LOCALE;
}

export function rememberLocale(locale: Locale) {
  if (browser) localStorage.setItem('locale', locale);
}

export function localeDateFormat(locale: Locale): string {
  return locale === 'es' ? 'es-ES' : 'en-US';
}

export function swapLocaleInPath(pathname: string, next: Locale): string {
  const match = pathname.match(/^\/(es|en)(\/.*)?$/);
  if (match) return `/${next}${match[2] ?? ''}`;
  return `/${next}${pathname === '/' ? '' : pathname}`;
}
