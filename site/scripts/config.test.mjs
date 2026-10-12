import { test } from 'node:test';
import assert from 'node:assert/strict';
import { configure } from '../src/data/site-config.mjs';
test('URLs support project sites, a nested domain path, and a domain root', () => {
  for (const base of ['/', '/relayinbox/', '/products/relayinbox/']) {
    const c = configure({ SITE_ORIGIN: 'https://example.org', SITE_BASE_PATH: base });
    assert.equal(c.url('setup/'), `https://example.org${base}setup/`);
    assert.equal(c.path('assets/site.css'), `${base}assets/site.css`);
  }
});
test('unsafe or ambiguous origins and bases fail before publishing', () => {
  for (const origin of ['http://example.org', 'https://example.org/path', 'https://user:pass@example.org', 'https://example.org?q=1']) {
    assert.throws(() => configure({ SITE_ORIGIN: origin }));
  }
  for (const base of ['relayinbox', '/relayinbox', '//evil/', '/../', '/a b/', '/a?x/']) {
    assert.throws(() => configure({ SITE_BASE_PATH: base }));
  }
});
test('training crawler policy is independent from search', () => {
  assert.equal(configure({}).gptBot, false);
  assert.equal(configure({ ALLOW_GPTBOT: 'true' }).gptBot, true);
});
