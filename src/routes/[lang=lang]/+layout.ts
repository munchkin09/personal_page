import { error } from '@sveltejs/kit';
import { isLocale } from '$lib/i18n';

export const prerender = true;

export function load({ params }: { params: { lang: string } }) {
  if (!isLocale(params.lang)) throw error(404, 'Unsupported locale');
  return { lang: params.lang };
}
