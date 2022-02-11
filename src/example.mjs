import http from 'http';
import _, { css, mediaQuery, tagStream } from './tag.mjs';

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.statusCode = 200;
  tagStream(_.html(
    _.head(
      _.title('My First Edison Page'),
      _.meta({ name: 'viewport', content: 'width=device-width, initial-scale=1.0' }),
      _.style([
        css('html', {
          color: 'red',
        }),
        mediaQuery('(max-width: 800px)', [
          css('html', {
            color: 'blue',
          }),
        ])
      ])
    ),
    _.body(
      _.main(
        _.h1('Hello Edison'),
        _.ul(
          [...new Array(20 * 1000)].map((v, i) => _.li(`item ${i}`))
        )
      )
    )
  )).pipe(res);
});

const PORT = process.env.PORT || 3000;
server.listen(3000, () => {
  console.log(`http://localhost:${PORT}`);
});