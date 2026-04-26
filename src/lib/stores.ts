import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const activeSection = writable('hero');
export const cursorState = writable<'default' | 'pointer' | 'text'>('default');
export const is8Bit = writable(false);

is8Bit.subscribe((v) => {
  if (!browser) return;
  if (v) document.documentElement.setAttribute('data-theme-8bit', 'true');
  else document.documentElement.removeAttribute('data-theme-8bit');
});

// ── Theme store ─────────────────────────────────────────────────────────────
function initTheme(): 'dark' | 'light' {
  if (!browser) return 'dark';
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export const theme = writable<'dark' | 'light'>(initTheme());

theme.subscribe((t) => {
  if (!browser) return;
  document.documentElement.setAttribute('data-theme', t);
  document.documentElement.style.colorScheme = t;
  localStorage.setItem('theme', t);
});
