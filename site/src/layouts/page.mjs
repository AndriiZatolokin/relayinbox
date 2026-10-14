import { config as c } from '../data/site-config.mjs';
import { product as p } from '../data/product-facts.mjs';
export const escape = (value) => String(value).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
export const link = (route, text, className = '') => `<a href="${c.path(route)}"${className ? ` class="${className}"` : ''}>${text}</a>`;
const routes = [['', 'App'], ['setup/', 'Setup'], ['privacy/', 'Privacy'], ['faq/', 'FAQ'], ['guides/forward-android-sms-to-telegram/', 'Guide']];
export function render(page) {
  const canonical = c.url(page.route);
  const schema = [{
    '@context': 'https://schema.org', '@type': 'WebPage', '@id': canonical + '#page',
    url: canonical, name: page.title, description: page.description,
    inLanguage: 'en', dateModified: page.modified,
  }];
  if (!page.route) schema.push({
    '@context': 'https://schema.org', '@type': 'MobileApplication',
    name: p.name, description: p.description, operatingSystem: 'Android 7.0 or later',
    applicationCategory: 'UtilitiesApplication', url: canonical,
    publisher: { '@type': 'Person', name: p.developer },
    ...(p.playUrl && p.publicReleaseVerified ? { installUrl: p.playUrl, sameAs: p.playUrl } : {}),
  });
  if (page.route && !page.noindex) schema.push({
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: p.name, item: c.url() },
      ...(page.route.startsWith('guides/') ? [{ '@type': 'ListItem', position: 2, name: 'SMS guide', item: canonical }] : [{ '@type': 'ListItem', position: 2, name: page.label, item: canonical }]),
    ],
  });
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="google-site-verification" content="9Hyc4Jbb0pttM0RVQ7v0pcHP7t87GrtdNHul8kogtsk">
  <title>${escape(page.title)}</title>
  <meta name="description" content="${escape(page.description)}">
  <meta name="robots" content="${page.noindex ? 'noindex, follow' : 'index, follow'}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="RelayInbox">
  <meta property="og:title" content="${escape(page.title)}">
  <meta property="og:description" content="${escape(page.description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:locale" content="en_US">
  <meta property="og:image" content="${c.url('assets/og-image.png')}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="RelayInbox — Android SMS to your Telegram bot">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escape(page.title)}">
  <meta name="twitter:description" content="${escape(page.description)}">
  <meta name="twitter:image" content="${c.url('assets/og-image.png')}">
  <meta name="twitter:image:alt" content="RelayInbox — Android SMS to your Telegram bot">
  <meta name="theme-color" content="#fafaf7">
  <link rel="icon" href="${c.path('favicon.svg')}" type="image/svg+xml">
  <link rel="apple-touch-icon" href="${c.path('assets/app-icon.png')}">
  <link rel="stylesheet" href="${c.path('assets/site.css')}">
  ${page.story ? `<script src="${c.path('assets/story.mjs')}" type="module"></script>` : ''}
  <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <header class="header"><div class="wrap topbar">
    <a class="brand" href="${c.path()}"><img src="${c.path('favicon.svg')}" width="32" height="32" alt="">RelayInbox</a>
    <nav aria-label="Main">${routes.map(([route, title]) => `<a href="${c.path(route)}"${route === page.route ? ' aria-current="page"' : ''}>${title}</a>`).join('')}</nav>
  </div></header>
  <main id="main" class="wrap ${page.route ? 'article' : ''}">
    ${page.route ? `<div class="breadcrumb">${link('', 'RelayInbox')} <span aria-hidden="true">/</span> ${escape(page.label)}</div>` : ''}
    ${page.body}
  </main>
  <footer class="wrap footer"><div><a class="brand" href="${c.path()}">RelayInbox</a><p>Android SMS forwarding to Telegram.</p></div>
    <div><a href="${p.policyUrl}">Legal Privacy Policy</a><a href="mailto:${p.contact}">Contact the developer</a><p>No forms, cookies, or analytics scripts on this site.<br>GitHub processes hosting requests under its <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">privacy statement</a>.</p></div>
  </footer>
</body>
</html>
`;
}
