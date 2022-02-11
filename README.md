# edison

A server-first approach to js apps

## Motivation

Sometimes a desire to have a monolithic front-end app makes the server-side a nightmare. For apps that have fairly static pages, 
perhaps we can go the other direction. SSR in popular frameworks seems secondary. But what if it was primary?

### Example:

```js
import http from 'http';
import _, { tagStream } from '@skiano/edison';

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.statusCode = 200;

  tagStream(_.html(
    _.head(
      _.title('My First Edison Page'),
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

server.listen(3000);
```
