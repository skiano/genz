# edison

A server-first approach to js apps

## Motivation

Sometimes a desire to have a monolithic front-end app makes the server-side a nightmare. For apps that have fairly static pages, 
perhaps we can go the other direction. SSR in popular frameworks seems secondary. But what if it was primary?

### Examples:

Here is an app that responds with a 20,000 item list...

```js
import http from 'http';
import _, { tagStream } from '@skiano/edison';

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.statusCode = 200;

  tagStream(_.html(
    _.head(
      _.title('My First Edison Page')
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

And an example how html attributes work...

```js
import _ from '@skiano/edison';

_.img({ src: '/abc.jpg' });

_.p({ class: 'my-class' }, 'paragraph text...');
```

Children can be arrats (and nested deeply)...

```js
import _ from '@skiano/edison';

_.section(
  _.p(
    'Text child',
    _.span('Node Child')
  ),
  [
    ['and', 'some', ['silly', _.strong('nested'), _.em('thing')]]
  ]
);
```

And for above the fold inlined css...

```
import _, { css, mediaQuery } from '@skiano/edison';


_.style(
  css('.my-class', {
    'background-color': 'red'
  }),
  mediaQuery('only screen and (max-width: 600px)', [
    css(['.my-class', '.other-class'], {
      'background-color': 'yellow',
    })
  ])
)

```

You can incorporate a file stream to inline something from disk...

```
import _, { inlineFile } from '@skiano/edison';

_.head(
  _.script({ type: 'module' }, inlineFile('dist/gpt-snippet.js')) 
);
```
