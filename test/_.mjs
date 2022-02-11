import fs from "fs";
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

(async function runTests() {
  const filename = fileURLToPath(import.meta.url);
  const dirname = path.dirname(filename);
  const files = await fs.promises.readdir(dirname);

  for (let f = 0; f < files.length; f++) {
    const file = files[f];
    if (file.startsWith('_') || !file.endsWith('.mjs')) continue;

    const m = await import(path.resolve(dirname, file));
    if (!Array.isArray(m.default)) throw new Error(`Suite ${file} invalid`);

    console.log(chalk.underline(`Running Suite: ${file}\n`));

    for (let t = 0; t < m.default.length; t++) {
      const test = m.default[t];
      try {
        await test();
        console.log(chalk.green(`✓ ${test.name}`));
      } catch (err) {
        console.log(chalk.redBright(`✗ ${test.name} failed!\n`));
        console.log(err.stack);
        console.log('');
      }
    }
  }
  console.log(chalk.underline('\nTests Complete!\n'));
})();