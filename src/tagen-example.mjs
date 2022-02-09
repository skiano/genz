import _, { TagStream, css, mediaQuery } from './tagen.mjs';

const d = mediaQuery('max-width=600', [
  css(['.class', '.other'], {
    color: 'red',
    background: 'blue',
  }),
], css('p', {
  color: 'red',
  background: 'blue',
}))

new TagStream(d).pipe(process.stdout);
