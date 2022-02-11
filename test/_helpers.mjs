import _, { tagStream } from '../src/tag.mjs';

export const success = (msg) => {
  console.log(`✓ ${msg}`)
};

export const stringify = (gen) => new Promise((resolve, reject) => {
  const s = tagStream(gen);
  const chunks = [];
  s.on('error', reject);
  s.on('data', (d) => { chunks.push(d.toString()); });
  s.on('end', () => { resolve(chunks.join('')); });
});
