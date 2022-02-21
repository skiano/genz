import fs from 'fs';
import path from 'path';
import { compile } from '@vue/compiler-ssr';
import { createSSRApp } from 'vue'
import { fileURLToPath } from 'url';
import { renderToNodeStream } from 'vue/server-renderer'

(async () => {
  const out = compile(`
    <html>
    <head>
      <title>{{ v2 }}</title>
    </head>
    <body>
      <p :class="v3">{{ v1 }}</p>
      <svg>holla!</svg>
    </body>
    </html>
  `, {
    mode: 'module',
  });

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const FIXTURE_FILE = path.resolve(__dirname, 'fixture.mjs');

  await fs.promises.writeFile(FIXTURE_FILE, out.code);
  const { ssrRender } = await import(FIXTURE_FILE);

  const App = {
    ssrRender,
    data: () => ({
      v1: 'v 1',
      v2: 'v 2',
      v3: 'v 3',
    }),
  };

  const app = createSSRApp(App);
  const stream = renderToNodeStream(app);
  stream.pipe(process.stdout);
})();