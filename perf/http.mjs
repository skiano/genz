import http from 'http';
import { _, toStream } from '../src/genz.mjs';
import fixture from './fixture.mjs';

const server = http.createServer((req, res) => {
  if (req.url !== '/') return res.end();

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.statusCode = 200;

  const before = Date.now();

  toStream(res, fixture());

  res.on('close', () => {
    console.log(`-> ${Date.now() - before}ms`);
  });

  // TODO: handle aborts and close etc
});

const PORT = process.env.PORT || 3000;
server.listen(3000, () => {
  console.log(`http://localhost:${PORT}`);
});