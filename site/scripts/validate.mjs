import { readFile, stat, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
import { config as c } from '../src/data/site-config.mjs';
import { product as product } from '../src/data/product-facts.mjs';

const routes = ['', 'setup/', 'privacy/', 'faq/', 'guides/forward-android-sms-to-telegram/'];
const titles = new Set();
const descriptions = new Set();
const pages = new Map();
const attributes = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
const one = (values, message) => { assert.equal(values.length, 1, message); return values[0]; };
for (const route of [...routes, '404.html']) {
  const file = route === '404.html' ? route : route + 'index.html';
  const html = await readFile(path.join('dist', file), 'utf8');
  const is404 = route === '404.html';
  assert(html.startsWith('<!doctype html>'), `${file}: doctype`);
  assert(html.includes('<html lang="en">'), `${file}: language`);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${file}: one H1`);
  assert(html.includes('<main id="main"'), `${file}: main landmark`);
  assert(html.includes('href="#main"'), `${file}: skip link`);
  assert(!/<(?:form|input|iframe)\b/i.test(html), `${file}: unexpected data collection`);
  assert(!/\b(?:onload|onclick|onerror)=/i.test(html), `${file}: inline script`);
  const title = one([...html.matchAll(/<title>([^<]+)<\/title>/g)], `${file}: title`)[1];
  assert(title.length >= 15 && title.length <= 90, `${file}: title length`);
  assert(!titles.has(title), `${file}: duplicate title`); titles.add(title);
  const tags = [...html.matchAll(/<(?:meta|link|img|a|script)\b[^>]*>/g)].map(m => ({ tag: m[0], a: attributes(m[0]) }));
  const meta = (key) => one(tags.filter(t => t.a.name === key || t.a.property === key), `${file}: ${key}`).a.content;
  const description = meta('description');
  assert(description.length >= 60 && description.length <= 190, `${file}: description length`);
  assert(!descriptions.has(description), `${file}: duplicate description`); descriptions.add(description);
  assert.equal(meta('viewport'), 'width=device-width, initial-scale=1');
  const canonical = one(tags.filter(t => t.a.rel === 'canonical'), `${file}: canonical`).a.href;
  assert.equal(canonical, c.url(route), `${file}: canonical mismatch`);
  assert.equal(meta('og:url'), canonical);
  for (const key of ['og:title', 'og:description', 'og:image', 'og:image:alt', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:alt']) assert(meta(key), `${file}: ${key}`);
  assert.equal(meta('og:image'), c.url('assets/og-image.png'));
  assert.equal(meta('twitter:image'), c.url('assets/og-image.png'));
  assert.equal(meta('robots'), is404 ? 'noindex, follow' : 'index, follow');
  assert(!/http-equiv="(?:refresh|x-robots-tag)"/i.test(html));
  for (const img of tags.filter(t => t.tag.startsWith('<img'))) {
    assert('alt' in img.a, `${file}: image without alt`);
    assert(img.a.width && img.a.height, `${file}: missing image dimensions`);
  }
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1, `${file}: unexpected scripts`);
  assert.equal(attributes(scripts[0][1]).type, 'application/ld+json');
  const schemas = JSON.parse(scripts[0][2]);
  for (const schema of schemas) {
    assert.equal(schema['@context'], 'https://schema.org');
    assert(['WebPage', 'MobileApplication', 'BreadcrumbList'].includes(schema['@type']));
    if (schema['@type'] === 'WebPage') assert.equal(schema.url, canonical);
    if (schema['@type'] === 'BreadcrumbList') {
      schema.itemListElement.forEach((item, i) => { assert.equal(item.position, i + 1); assert(item.item.startsWith(c.url())); });
    }
  }
  assert(!/"(?:aggregateRating|review|offers)"\s*:/.test(scripts[0][2]), `${file}: unsupported structured claims`);
  if (route === '') assert(schemas.some(s => s['@type'] === 'MobileApplication' && s.name === 'RelayInbox' && s.operatingSystem === 'Android 7.0 or later'));
  const visible = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]*>/g, ' ');
  assert(!/100% secure|nobody can access|guaranteed (?:delivery|recommendations)|AI-powered translation subscription|unlimited free forwarding/i.test(visible), `${file}: unverified product claim`);
  assert(!/\d{7,}:[A-Za-z0-9_-]{25,}/.test(html), `${file}: possible bot token`);
  for (const tag of tags.filter(t => t.a.href?.startsWith('https://play.google.com/store/apps/details'))) assert.equal(tag.a.href, product.playUrl, `${file}: unexpected Google Play listing`);
  if (!product.publicReleaseVerified) {
    assert(!schemas.some(s => s.installUrl), `${file}: unverified public installation claim`);
    if (tags.some(t => t.a.href === product.playUrl)) assert(/testing|tester/i.test(visible), `${file}: missing test access disclosure`);
  }
  if (!is404) {
    for (const expected of routes) assert(tags.some(t => t.a.href === c.path(expected)), `${file}: missing navigation route ${expected}`);
    const headingLevels = [...html.matchAll(/<h([1-6])\b/g)].map(m => Number(m[1]));
    headingLevels.forEach((level, i) => { if (i) assert(level <= headingLevels[i - 1] + 1, `${file}: skipped heading level`); });
  }
  pages.set(file, { html, tags });
}
for (const [file, { tags }] of pages) {
  for (const { a } of tags) {
    for (const attr of ['href', 'src']) {
      if (!a[attr] || /^(?:https?:|mailto:)/.test(a[attr])) continue;
      const url = new URL(a[attr], c.url(file));
      assert(url.pathname.startsWith(c.base), `${file}: escaped configured base ${a[attr]}`);
      let target = decodeURIComponent(url.pathname.slice(c.base.length));
      if (!target || target.endsWith('/')) target += 'index.html';
      assert(!target.includes('..'), `${file}: traversal`);
      assert((await stat(path.join('dist', target))).isFile(), `${file}: broken ${a[attr]}`);
      if (url.hash) {
        const content = await readFile(path.join('dist', target), 'utf8');
        assert(content.includes(`id="${url.hash.slice(1)}"`), `${file}: broken fragment ${a[attr]}`);
      }
    }
  }
}
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]), routes.map(r => c.url(r)));
assert.equal([...sitemap.matchAll(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g)].length, 5);
assert(!/<(?:priority|changefreq)>/.test(sitemap));
const robots = await readFile('dist/robots.txt', 'utf8');
assert(robots.includes('User-agent: *\nAllow: /'));
assert(robots.includes(`Sitemap: ${c.url('sitemap.xml')}`));
assert(!/User-agent: (?:Googlebot|Bingbot|OAI-SearchBot)/i.test(robots));
assert(robots.includes(`User-agent: GPTBot\n${c.gptBot ? 'Allow: /' : 'Disallow: ' + c.base}`));
const verificationFile = 'googlef3241b588bf40767.html';
assert.equal((await readFile(`dist/${verificationFile}`, 'utf8')).trim(), `google-site-verification: ${verificationFile}`);
const allowed = new Set(['index.html', 'setup', 'privacy', 'faq', 'guides', '404.html', 'robots.txt', 'sitemap.xml', '.nojekyll', 'assets', 'favicon.svg', verificationFile]);
for (const file of await readdir('dist')) assert(allowed.has(file), `Unexpected public file: ${file}`);
console.log(`Validated 5 indexable pages + 404: metadata, schema, links, assets, sitemap, crawler policy, and known claim guardrails (${c.base}).`);
