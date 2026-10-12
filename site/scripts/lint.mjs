import { readdir, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
async function scan(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = `${dir}/${entry.name}`;
    if (entry.isDirectory()) await scan(file);
    else if (/\.(mjs|css|json)$/.test(file)) {
      const content = await readFile(file, 'utf8');
      assert(content.endsWith('\n'), `${file}: missing final newline`);
      assert(!/[\t]| +$/m.test(content), `${file}: tabs or trailing whitespace`);
      if (file.endsWith('.json')) JSON.parse(content);
      if (file.endsWith('.mjs')) {
        const check = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
        assert.equal(check.status, 0, check.stderr);
      }
    }
  }
}
await scan('src');
await scan('scripts');
await scan('public');
console.log('Source syntax and whitespace checks passed.');
