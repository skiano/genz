import http from 'http';
import { _, toStream } from '../src/genz.mjs';

const server = http.createServer((req, res) => {
  // go ahead and write the head
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Transfer-Encoding': 'chunked'
  });

  // listen for errors
  res.on('error', (e) => {
    console.log(`ERROR`, e)
  });

  // this page will throw 100ms in
  const bustedPage = () => _.html(
    _.head(
      _.title('Busted Page'),
    ),
    _.body(
      _.h1('Example of failing midstream'),
      new Promise((resolve, reject) => {
        setTimeout(reject, 100, new Error('Crap!'));
      })
    )
  );

  // the browser inspector should show that this page fails
  toStream(res, bustedPage, {});
}).listen(3000, () => {
  console.log(`serving at http://localhost:3000/`);
});
