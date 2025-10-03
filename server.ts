import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import AppServerModule from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  // When behind a proxy (nginx, docker port mapping, cloud load balancer)
  // trust the X-Forwarded-* headers so we can reconstruct the original
  // request URL (including port) for server-side rendering.
  server.set('trust proxy', true);
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('**', express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
  }));

  // All regular routes use the Angular engine
  server.get('**', (req, res, next) => {
    const { originalUrl, baseUrl } = req;
    // Prefer X-Forwarded headers when present (set by reverse proxies) so the
    // generated URL includes the original host and scheme (and port) the
    // client used.
    const forwardedProto = (req.headers['x-forwarded-proto'] as string) || req.protocol;
    const forwardedHost = (req.headers['x-forwarded-host'] as string) || (req.headers.host as string) || req.get('host');
    const absoluteUrl = `${forwardedProto}://${forwardedHost}${originalUrl}`;

    commonEngine
      .render({
        bootstrap: AppServerModule,
        documentFilePath: indexHtml,
        url: absoluteUrl,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
