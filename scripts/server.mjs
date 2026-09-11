import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, extname, sep } from 'node:path';

// O servidor fica em scripts/, mas os arquivos públicos estão na raiz do projeto.
// Para iniciar, execute npm start na pasta que contém package.json.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT || 8765);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp'};
const server = http.createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, {Allow:'GET, HEAD'}).end(); return;
  }
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const name = path === '/' ? 'index.html' : path.slice(1);
    const file = resolve(root, name);
    if (!file.startsWith(root + sep) || !/^(index\.html|(?:css|js|assets)\/)/.test(name) || name.split(/[\\/]/).some(part=>part.startsWith('.')) || !types[extname(file)]) {
      res.writeHead(404).end('Não encontrado'); return;
    }
    const body = await readFile(file);
    res.writeHead(200, {'Content-Type':types[extname(file)],'X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'});
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch (error) {
    res.writeHead(error.code === 'ENOENT' ? 404 : 400).end('Recurso indisponível');
  }
});
server.on('error', error => {
  console.error(error.code === 'EADDRINUSE' ? `A porta ${port} já está em uso. Feche o servidor anterior ou defina PORT.` : error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => console.log(`Iguana+ disponível em http://127.0.0.1:${port}`));
