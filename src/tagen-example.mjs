import * as _ from './tagen.mjs';

const d = _.div(
  _.strong('hello'),
  'hello',
  ['world'],
  [_.span('!')],
  _.img({ src: 'abc.jog' })
);

const chunks = [];
for (let s of d) {
  chunks.push(s);
}
console.log(chunks.join(''));