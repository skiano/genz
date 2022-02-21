# Gen Z

Your unversal-isomorphic-supersonic-tooled-out app is so-five-minutes-ago...

⚠️ WARNING: This is VERY exprimental and may, likely, turn out to be a colossal failure.

👀 View a [Live demo.](https://skiano.github.io/genz/)

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

More examples:
- [Deduping experiment](https://skiano.github.io/genz/#Ly8gZGVkdXBlIGVuc3VyZXMgdGhpcyBmcmFnbWVudCBjYW4gb25seSByZW5kZXIgb25jZQpjb25zdCBob29rID0gZGVkdXBlKAogIF8uc2NyaXB0KGBmdW5jdGlvbiB0b2dnbGUobikgeyB0aGlzLmNsYXNzTGlzdC50b2dnbGUobikgfWApLAogICd0b2dnbGUtc2NyaXB0JwopOwoKLy8gdGhlIHRvZ2dsZSBjb21wb25lbnQgcmVxdWlyZXMgdGhlIGJpdCBvZiBqcwovLyBidXQgaXQgb25seSBuZWVkcyB0byBsb2FkIG9uY2UuCi8vIGJ1dCB0aGlzIGFsc28gbWVhbnMgaXQgd291bGQgbm90IGxvYWQgYXQgYWxsCi8vIGlmIG5vIHRvZ2dsZSBpcyBwcmVzZW50CmNvbnN0IHRvZ2dsZSA9ICh0YWcsIGF0dHIsIGNoaWxkcmVuKSA9PiBbCiAgaG9vaywKICBfW3RhZ10oewogICAgLi4uYXR0ciwKICAgIG9uY2xpY2s6IGB0b2dnbGUuY2FsbCh0aGlzLCd0b2dnbGUtLWFjdGl2ZScpYAogIH0sIGNoaWxkcmVuKSwKXTsKCl8uaHRtbCgKICBfLmhlYWQoCiAgICBfLnRpdGxlKCdCYXNpYyBFeGFtcGxlJyksCiAgICBfLnN0eWxlKAogICAgICBjc3MoJ2JvZHknLCB7CiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnZ2FpbnNib3JvJwogICAgICB9KSwKICAgICAgY3NzKCcudG9nZ2xlLS1hY3RpdmUnLCB7CiAgICAgICAgY29sb3I6ICdyZWQnLAogICAgICAgIGZvbnRTaXplOiAnMzBweCcKICAgICAgfSkKICAgICksCiAgKSwKICBfLmJvZHkoCiAgICBfLmgxKCdIZWxsbyBXb3JsZCcpLAogICAgdG9nZ2xlKCdwJywgeyBjbGFzczogJ215LXAnIH0sICdoZWxsbyB3b3JsZCcpLAogICAgdG9nZ2xlKCdwJywgeyBjbGFzczogJ215LXAnIH0sICdoZWxsbyB3b3JsZCcpLAogICAgdG9nZ2xlKCdwJywgeyBjbGFzczogJ215LXAnIH0sICdoZWxsbyB3b3JsZCcpLAogICkKKQ==)



