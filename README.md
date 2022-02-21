# Gen Z

Your unversal-isomorphic-supersonic-tooled-out app is so-five-minutes-ago...

⚠️ WARNING: This is VERY exprimental and may, likely, turn out to be a colossal failure.

👀 [LIVE DEMO](https://skiano.github.io/genz/)

## Why

It’s true, many websites can be and perhaps should be client-side or universal. However, some websites have large pages with mostly static content and the kind of dependencies and tooling required to have all the bells and whistles, just so you can manage the creating and loading of the requisite javascript—well, that is getting to be a drag. This is an experiment to see what can be done by starting by assuming server-side rendering should really be separate some cases.

My thinking so far:

- Avoid tooling (and not just for little examples)
- Avoid dependencies (0 would be ideal)
- Streaming by default (avoid blocking as much as possible)
- Start sending content, while allowing parts of the render to be async
- Extremely minimal (prioritize simplicity over safety)
- Demonstrate a clear path for embedding complex client apps within pages

## Installation

```bash
$ npm install genz
```

## Hello world example

```javascript
import http from 'http';
import { _, toStream } from 'genz';

http.createServer((req, res) => {
  if (req.url !== '/') return res.end();

  const content = _.html(
    _.head(
      _.title('Basic Example'),
      _.style(css('body', {
        backgroundColor: 'yellow'
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
```

For a more complex example checkout [this example](example/app.mjs).

To view the example, clone this repo and run:

```bash
$ cd path/to/cloned/repo
$ npm i
$ npm run dev
```

