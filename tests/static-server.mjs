import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname } from 'node:path';

const root = resolve(process.env.PORTFOLIO_DIST || 'dist');
const base = '/portfolio-angel-cardenas/';
const port = Number(process.env.PORTFOLIO_PORT || 4175);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.pdf': 'application/pdf' };
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname === base.slice(0, -1)) { response.writeHead(301, { Location: base }); response.end(); return; }
    if (!pathname.startsWith(base)) throw new Error('outside site');
    let file = resolve(root, pathname.slice(base.length) || 'index.html');
    if (!file.startsWith(root + '/')) throw new Error('outside root');
    if ((await stat(file)).isDirectory()) {
      if (!pathname.endsWith('/')) { response.writeHead(301, { Location: pathname + '/' }); response.end(); return; }
      file = resolve(file, 'index.html');
    }
    const body = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(body);
  } catch {
    const body = await readFile(resolve(root, '404.html')).catch(() => Buffer.from('Not found'));
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(body);
  }
}).listen(port, '127.0.0.1', () => console.log(`Static server: http://127.0.0.1:${port}${base}`));
