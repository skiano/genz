import $, { tagStream } from '../src/tag.mjs';

const superSlow = () => new Promise(r => setTimeout(r, 800, $.em('slow it down')))

tagStream(
  $.div(
    1,
    2,
    Promise.resolve($.p(
      'yes',
      Promise.resolve($.strong('and pause...')),
      superSlow()
    )),
    3
  )
).pipe(process.stdout).on('end', () => {
  console.log('finished')
});
