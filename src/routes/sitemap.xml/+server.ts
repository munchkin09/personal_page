import type { RequestHandler } from './$types';

const SITE_URL = 'https://carloslc.is-a.dev';
const pages = ['', '/now', '/cv'];
const locales = ['es', 'en'];

export const GET: RequestHandler = async () => {
  const urls = locales.flatMap(loc =>
    pages.map(page => `${SITE_URL}/${loc}${page}`)
  );

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url.endsWith('/now') || url.endsWith('/cv') ? '0.8' : '1.0'}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap.trim(), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=0, s-maxage=3600'
    }
  });
};
