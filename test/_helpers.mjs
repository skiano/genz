import _, { tagStream } from '../src/tag.mjs';

export const syncStringify = (it) => {
  const a = [];
  for (let c of it) a.push(c);
  return a.join('');
}

export const stringify = (gen) => new Promise((resolve, reject) => {
  const s = tagStream(gen);
  const chunks = [];
  s.on('error', reject);
  s.on('data', (d) => { chunks.push(d.toString()); });
  s.on('end', () => { resolve(chunks.join('')); });
});
