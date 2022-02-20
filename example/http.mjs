import http from 'http';
import { _, toStream } from '../genz.mjs';
import fixture from './fixture.mjs';

const server = http.createServer((req, res) => {
  if (req.url !== '/') return res.end();

  res.setHeader('Content-Type', 'text/html');
  res.statusCode = 200;

  const before = Date.now();

  toStream(fixture(), res);

  res.on('close', () => {
    console.log(`-> ${Date.now() - before}ms`);
  });

  // TODO: handle aborts and close etc
});

const PORT = process.env.PORT || 3000;
server.listen(3000, () => {
  console.log(`http://localhost:${PORT}`);
});