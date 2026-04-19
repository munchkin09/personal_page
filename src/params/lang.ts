import type { ParamMatcher } from '@sveltejs/kit';
import { SUPPORTED_LOCALES } from '$lib/i18n';

export const match: ParamMatcher = (param) =>
  (SUPPORTED_LOCALES as readonly string[]).includes(param);
