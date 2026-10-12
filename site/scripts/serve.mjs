import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { config as c } from '../src/data/site-config.mjs';
const root = path.resolve('dist');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.txt': 'text/plain', '.xml': 'application/xml' };
createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (!url.pathname.startsWith(c.base)) throw new Error('Outside base');
    const relative = decodeURIComponent(url.pathname.slice(c.base.length));
    let file = path.resolve(root, relative || 'index.html');
    if (!file.startsWith(root + path.sep) && file !== root) throw new Error('Outside dist');
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(await readFile(path.join(root, '404.html')));
  }
}).listen(4173, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:4173${c.base}`));
