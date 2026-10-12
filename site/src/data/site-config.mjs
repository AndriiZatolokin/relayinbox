export function configure(env = process.env) {
  const origin = env.SITE_ORIGIN || 'https://andriizatolokin.github.io';
  const parsed = new URL(origin);
  if (parsed.protocol !== 'https:' || parsed.pathname !== '/' || parsed.search || parsed.hash || parsed.username || parsed.password) {
    throw new Error('SITE_ORIGIN must be a bare HTTPS origin');
  }
  const raw = env.SITE_BASE_PATH ?? '/relayinbox/';
  if (!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(raw)) {
    throw new Error('SITE_BASE_PATH must be / or /path/ with safe segments and a trailing slash');
  }
  return Object.freeze({
    origin: parsed.origin,
    base: raw,
    gptBot: env.ALLOW_GPTBOT === 'true',
    path: (route = '') => raw + route,
    url: (route = '') => parsed.origin + raw + route,
  });
}
export const config = configure();
