import http from 'http';
import { _, css, toStream } from '../src/genz.mjs';

http.createServer((req, res) => {
  if (req.url !== '/') return res.end();

  const content = _.html(
    _.head(
      _.title('Basic Example'),
      _.style(css('body', {
        color: 'red'
      }))
    ),
    _.body(
      _.h1('Hello World'),
      _.p('This is a basic example.')
    )
  );

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Transfer-Encoding', 'chunked');
  toStream(res, content);

}).listen(3000, () => {
  console.log('http://localhost:3000');
});
