import http from 'http';
import _, { tagStream } from './tag.mjs';

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
          [1, 2, 3].map(v => _.li(`item ${v}`))
        )
      )
    )
  )).pipe(res);
});

server.listen(3000);