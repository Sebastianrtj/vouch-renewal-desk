import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const task = fileURLToPath(new URL('../', import.meta.url));
const deck = new URL('../../alex-presentation/output/alex-renewal-discovery.html', import.meta.url);
const appUrl = 'http://localhost:5183/';
const deckUrl = 'http://localhost:5181/alex-renewal-discovery.html';
async function contains(url, marker) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(1500) });
    return response.ok && (await response.text()).includes(marker);
  } catch { return false; }
}
const children = [];
let server;
function stop() {
  children.forEach(child => child.kill('SIGTERM'));
  server?.close();
}
process.on('SIGINT', () => { stop(); process.exit(0); });
process.on('SIGTERM', () => { stop(); process.exit(0); });
try {
  if (!await contains(appUrl, 'Renewal Desk')) {
    const child = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '5183', '--strictPort'], { cwd: task, stdio: 'inherit' });
    children.push(child);
    child.on('exit', code => { if (code) { stop(); process.exit(code); } });
  }
  if (!await contains(deckUrl, 'Run live demo')) {
    server = createServer(async (request, response) => {
      if (!['/', '/alex-renewal-discovery.html'].includes(request.url?.split('?')[0])) {
        response.writeHead(404); response.end('Not found'); return;
      }
      try {
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
        response.end(await readFile(deck));
      } catch {
        response.writeHead(500); response.end('Build the presentation first.');
      }
    });
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(5181, '127.0.0.1', resolve);
    });
  }
  console.log(`\nPresentation: ${deckUrl}\nPlatform: ${appUrl}?present=1&scene=brief#/halcyon-labs\n\nChoose “Run demo” from any slide. “Back to slides” returns in place.\nCtrl+C stops servers started by this command.\n`);
} catch (error) {
  stop();
  console.error(`Could not start presentation: ${error.message}`);
  process.exitCode = 1;
}
