import { SUPPORTED_LOCALES } from '$lib/i18n';

export const prerender = true;

export function entries() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export function load({ params }: { params: { lang: string } }) {
  return { lang: params.lang };
}
