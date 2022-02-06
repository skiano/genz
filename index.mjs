import http from 'http';
import {
  p,
  img,
  div,
  html,
  head,
  body,
  main,
  title,
  link,
  script,
  style,
  render,
} from './html.mjs';

const asyncComponent = async (str) => {
  return new Promise((resolve) => setTimeout(resolve, 10, div(`slow: ${str}`)));
};

const requestListener = async (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.writeHead(200);

  const components = [];
  for (let i = 0; i < 2000; i++) {
    components.push(asyncComponent(i));
  }

  for (let i = 0; i < 20000; i++) {
    components.push(p({ style: 'color: red;' }, `just another paragraph....${i}`));
  }

  const next = await render(html(
    head(
      title('Skiano.com'),
      // link({ src: 'abc.css' }),
      // script({ src: 'abc.js' }),
      style('html { color: blue; background: green }')
    ),
    body(
      main(
        img({ src: 'a.jpg' }),
        img({ src: 'b.jpg' }),
        components
      )
    )
  ));

  async function write() {
    let frag;
    let didWrite;
    do {
      frag = await next();
      if (!frag) {
        return res.end();
      }
      didWrite = res.write(frag);
    } while (frag && didWrite);
    if (!didWrite) {
      res.once('drain', write);
    }
  }

  write();
};

const server = http.createServer(requestListener);
server.listen(8080, () => {
  console.log(`listening http://localhost:8080`);
});
