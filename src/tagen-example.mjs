import * as _ from './tagen.mjs';

const d = _.div(
  'hello',
  ['world'],
  [_.span('!')]
);

const chunks = [];
for (let s of d) {
  chunks.push(s);
}

console.log(chunks.join(''));