import assert from 'node:assert/strict';
import { config as c } from '../src/data/site-config.mjs';
const target = process.env.SMOKE_URL || c.url();
assert(target.endsWith('/'), 'SMOKE_URL needs a trailing slash');
const routes = ['', 'setup/', 'privacy/', 'faq/', 'guides/forward-android-sms-to-telegram/', 'sitemap.xml', 'robots.txt', 'assets/site.css', 'assets/og-image.png', 'assets/status.webp', 'assets/messages.webp', 'favicon.svg'];
for (const route of routes) {
  const response = await fetch(new URL(route, target), { signal: AbortSignal.timeout(20000), redirect: 'error' });
  assert.equal(response.status, 200, `${route}: HTTP ${response.status}`);
  if (routes.indexOf(route) < 5) {
    assert(response.headers.get('content-type')?.includes('text/html'), `${route}: not HTML`);
    const html = await response.text();
    assert(html.includes(`<link rel="canonical" href="${c.url(route)}">`), `${route}: deployed canonical mismatch`);
    assert(html.includes('<h1'), `${route}: missing content`);
    assert(!response.headers.get('x-robots-tag')?.includes('noindex'), `${route}: server noindex`);
  }
  console.log(`OK ${new URL(route, target)}`);
}
const missing = await fetch(new URL('missing-website-smoke-check/', target), { signal: AbortSignal.timeout(20000) });
assert.equal(missing.status, 404);
assert((await missing.text()).includes('This page did not arrive.'), 'Custom 404 not served');
// Search crawlers consult the origin root, never the project-path robots.txt.
const rootRobots = await fetch(new URL('/robots.txt', target), { signal: AbortSignal.timeout(20000) });
if (rootRobots.status === 200) {
  console.log('Origin robots.txt exists; manually review all crawler-specific rules before claiming crawl eligibility.');
} else {
  assert.equal(rootRobots.status, 404, `Origin robots status ${rootRobots.status}: manual review needed`);
  console.log('No origin robots.txt (404); no robots exclusion file found.');
}
