import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { config as c } from '../src/data/site-config.mjs';
import { render, link } from '../src/layouts/page.mjs';
import home from '../src/pages/index.mjs';
import setup from '../src/pages/setup.mjs';
import privacy from '../src/pages/privacy.mjs';
import faq from '../src/pages/faq.mjs';
import guide from '../src/pages/guide.mjs';
export const pages = [home, setup, privacy, faq, guide];
const root = fileURLToPath(new URL('..', import.meta.url));
const dist = path.join(root, 'dist');
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(path.join(root, 'public'), dist, { recursive: true });
for (const page of pages) {
  const dir = path.join(dist, page.route);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), render(page));
}
await writeFile(path.join(dist, '404.html'), render({
  route: '404.html', label: 'Page not found', noindex: true,
  title: 'Page Not Found — RelayInbox', description: 'This RelayInbox page could not be found. Return to the overview or follow the setup guide.',
  body: `<p class="eyebrow">404</p><h1>This page did not arrive.</h1><p>Check the address, ${link('', 'return to RelayInbox')}, or ${link('setup/', 'open the setup guide')}.</p>`,
}));
await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(p => `  <url><loc>${c.url(p.route)}</loc><lastmod>${p.modified}</lastmod></url>`).join('\n')}\n</urlset>\n`);
// A project-site robots.txt does not control crawlers: only the origin's /robots.txt does.
await writeFile(path.join(dist, 'robots.txt'), `# Policy template: effective only if hosted at the origin root.\nUser-agent: *\nAllow: /\n\nUser-agent: GPTBot\n${c.gptBot ? 'Allow' : 'Disallow'}: ${c.gptBot ? '/' : c.base}\n\nSitemap: ${c.url('sitemap.xml')}\n`);
await writeFile(path.join(dist, '.nojekyll'), '');
console.log(`Built ${pages.length} indexable pages at ${c.url()}`);
