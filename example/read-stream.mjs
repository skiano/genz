import http from 'http';
import { _, toStream } from '../src/genz.mjs';


http.createServer((req, res) => {
  console.log('recieved API request')

  res.write('<ul>')
  function write(i) {
    if (i < 1000) {
      res.write(`<li>Item ${i + 1}</li>`);
      setTimeout(write, 1, i + 1);
    } else {
      res.end('</ul>');
    }
  }
  write(0);
}).listen(8080, () => {
  console.log('API listening on :8080');
});

http.createServer((req, res) => {
  if (req.url !== '/') return res.end();

  res.on('error', (error) => {
    console.log(error);
  });

  http.request('http://localhost:8080/', (apiRes) => {
    console.log(apiRes.statusCode);

    res.writeHead(200, {
      'content-type': 'text/html',
      'transfer-encoding': 'chunked'
    });

    toStream(res, _.html(
      _.h4('Streaming!'),
      _.div({ class: 'stream-content' }, apiRes)
    ));

  }).end();

}).listen(5000, () => {
  console.log('App listening on :5000')
});