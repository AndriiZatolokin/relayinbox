# RelayInbox static website

Five static English pages, semantic HTML/CSS, no third-party dependencies. The overview has one small local JavaScript module for its illustrative forwarding animation; all content remains visible without JavaScript. Node 22+ is required.

```sh
npm ci --ignore-scripts
npm run check
npm run preview
```

Default preview: `http://127.0.0.1:4173/relayinbox/`.

`SITE_ORIGIN` (default `https://andriizatolokin.github.io`) and `SITE_BASE_PATH` (default `/relayinbox/`) control every public URL. Set equivalent GitHub repository Actions variables before deploying to another origin/path. `ALLOW_GPTBOT=true` allows training crawling in the generated policy template; search crawling remains allowed independently. A project-path robots file is not effective: merge its rules into the account origin’s `/robots.txt` to enforce crawler choices.

The Pages workflow validates all routes and alternative URL configurations, publishes only `site/dist`, and smoke-tests the actual public site. Enable GitHub Actions as the Pages source and deploy from main. PRs only validate. Roll back by reverting a website commit and redeploying.

`npm run smoke` checks the configured public URL. `SMOKE_URL` can point to a preview server, but canonicals are still compared against the configured production origin/base. No search-console verification or analytics is configured.

Product release status and Play-link approval are in `src/data/product-facts.mjs`; page copy must be reviewed at the same time when these change. Do not add fabricated offers/reviews, secret tokens or private screenshots. The current site explicitly describes a test release and leaves the public Play link pending verification.

Assets reuse RelayInbox branding and app-view renders with fictional data. Captions disclose that they are native UI renders rather than physical-device screenshots.

The overview gallery uses the English battery, filters, and retry captures from `store-assets/screenshots/en/` in the Android workspace. Website copies are 720 × 1280 WebP images with the complete frame preserved, exported at quality 85. Messages and Status captures are linked below the gallery. The gallery does not demonstrate live Telegram delivery or caller-number capture; the battery capture shows the older call-state setting only. No personal Telegram screenshots are published.

The hero is an explicitly labeled illustration with fictional content, not a Telegram screenshot or a live connection. It plays once when visible, completes in 3.3 seconds, and can be replayed with a keyboard-accessible button. Reduced-motion preferences show a static scene and hide replay. No timers, network calls, telemetry, external animation libraries, or persistent state are used by the module. Other pages load no runtime JavaScript.

The Android workspace maintains the full audit and owner handover under `docs/website/`. To refresh a separate public website repository from that workspace, run `node scripts/export-public.mjs`, review the export, then commit/push only its public files. Do not copy Android sources or private repository metadata.
