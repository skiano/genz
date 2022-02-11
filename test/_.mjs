import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';

(async function runTests() {
  const filename = fileURLToPath(import.meta.url);
  const dirname = path.dirname(filename);
  const files = await fs.promises.readdir(dirname);

  files.forEach(async function runSuite (f) {
    if (f.startsWith('_') || !f.endsWith('.mjs')) return;

    const m = await import(path.resolve(dirname, f));
    if (!Array.isArray(m.default)) throw new Error(`Suite ${p} invalid`);

    m.default.forEach(async function runTest(t) {
      try {
        await t();
      } catch (e) {
        console.log('');
        console.log(e.stack);
        console.log('');
      }
    });

  });
})();