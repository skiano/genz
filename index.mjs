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
import {
  css,
  mediaQuery,
} from './css.mjs';

const asyncComponent = async (str) => {
  return new Promise((resolve) => setTimeout(resolve, 10, div(`slow: ${str}`)));
};

const requestListener = async (req, res) => {
  res.setHeader('Transfer-Encoding', 'chunked');

  let content;
  if (req.url === '/') {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    const components = [];
    for (let i = 0; i < 2000; i++) components.push(asyncComponent(i));
    for (let i = 0; i < 20000; i++) components.push(p({ style: 'color: red;' }, `just another paragraph....${i}`));
    
    content = html(
      head(
        title('Skiano.com'),
        link({ rel: 'stylesheet', href: 'style.css' })
        // script({ src: 'abc.js' }),
        // style('html { color: blue; background: green }')
      ),
      body(
        main(
          // img({ src: 'a.jpg' }),
          // img({ src: 'b.jpg' }),
          components
        )
      )
    );
  } else if (req.url === '/style.css') {
    res.setHeader('Content-Type', 'text/css; charset=UTF-8');
    content = [
      css('html', {
        'background-color': 'red',
        color: 'white',
      }),
      mediaQuery('(max-width: 600px)', [
        css('html', {
          'background-color': 'orange',
          color: 'green',
        }),
      ])
    ];

    console.log(content);
  }

  if (!content) {
    res.writeHead(404);
    return res.end();
  }

  res.writeHead(200);

  const next = await render(content);

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
