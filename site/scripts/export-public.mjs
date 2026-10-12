// Export an explicit allowlist. Never copy the Android checkout or its Git metadata.
import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('..', import.meta.url));
const target = path.join(root, 'output', 'public-repository');
await mkdir(path.join(target, 'site'), { recursive: true });
for (const entry of ['src', 'public', 'scripts', 'package.json', 'package-lock.json', '.gitignore', 'README.md']) {
  await cp(path.join(root, entry), path.join(target, 'site', entry), { recursive: true });
}
await mkdir(path.join(target, '.github', 'workflows'), { recursive: true });
await cp(path.join(root, '..', '.github', 'workflows', 'deploy-pages.yml'), path.join(target, '.github', 'workflows', 'deploy-pages.yml'));
await writeFile(path.join(target, 'README.md'), '# RelayInbox website\n\nPublic static website source for RelayInbox. Android application source is maintained separately.\n\nLive site: https://andriizatolokin.github.io/relayinbox/\n\nSee [site/README.md](site/README.md) for build and deployment instructions.\n');
await writeFile(path.join(target, '.gitignore'), 'site/dist/\nsite/node_modules/\nsite/output/\nsite/.playwright-cli/\n');
async function audit(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await audit(file);
    else {
      if (/\.(?:jks|keystore|pem|p12|properties|mp4|apk|aab)$/.test(entry.name)) throw new Error(`Unexpected private/runtime file: ${file}`);
      if (/\.(?:mjs|md|json|yml|css|svg)$/.test(entry.name)) {
        const text = await readFile(file, 'utf8');
        if (/gh[pousr]_[A-Za-z0-9]{20,}|\d{7,}:[A-Za-z0-9_-]{25,}|BEGIN (?:RSA )?PRIVATE KEY/.test(text)) throw new Error(`Possible secret in ${file}`);
      }
    }
  }
}
await audit(target);
console.log(`Reviewed public-only export: ${target}`);
