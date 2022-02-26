# Gen Z

Streaming-first SSR for Node Apps.

⚠️ WARNING: This is exprimental.

## Contents

- [Quick Example](#quick-example)
- [Creating HTML](#creating-html)
- [Rendering HTML](#rendering-html)
  - [To a string](#to-a-string)
  - [To a writeable stream](#to-a-writable-stream)
  - [Using promises in templates](#using-promises)
  - [Providing a “context” object to templates](#providing-a-context)
  - [Consuming readable streams in templates](#consuming-readable-streams)
- [Error Handling](#error-handling)
- [Extras](#rendering-html)
  - [Inline CSS](#inline-css)
  - [Deduping](#deduping)
  - [Creating your own tag](#creating-a-custom-tag)

## Why

Many websites can—and perhaps should—be “client-side” or “universal” JavaScript applications. However, some website are composed primarily of _pages_ with slight interaction, a few drop-downs here, some hover effects there, and _within_ such pages the occasional highly interactive experience. In these cases, starting with a monolithic client application and working backwards to render it on the server can become a terrible trap. It is fruitful, I think, to take a fresh look at what working the other way round could look like today. This if only to balance out the super-abundance of client-side frameworks that have popped up over the last several years.

`genz` aims to:

- Require no tooling or template compilation for rendering the server HTML
- Require no dependencies
- Support chunked streaming render out of the box
- Avoid blocking the event-loop as much as possible
- Serve content immediately, while allowing parts of the page to wait for async work
- Be open-ended when it comes to what a “component” might be on the server

## Installation

```bash
$ npm install genz
```

## Quick Example

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
  
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Transfer-Encoding': 'chunked'
  });
  
  toStream(res, content);

}).listen(3000, () => {
  console.log('http://localhost:3000');
});
```

For a more complex example checkout [this example](example/app.mjs).


To explore this example, clone this repo and run:

```bash
$ cd path/to/cloned/repo
$ npm i
$ npm run dev
```

-----

## Creating HTML

Genz uses conventions familiar to people familiar with the `h` function beneath jsx, but with some slight ergonomic changes. so to create content you can do the following:

```javascript
import { _ } from 'genz';

_.div({ class: 'my-class' },
  _.p('Hello there!')
);
```

...translates to:

```html
<div class="my-class">
  <p>
    Hello there!
  </p>
</div>
```

> _Note:_ Unlike most `h` functions, genz attaches every tag to the `_` object (since on the server we don't have to be as precious about package size). This avoids importing tags one by one, which is a pain, and it makes reading the templates a bit easier.

You can pass children as an array, a nested array, as further arguments, or any mixture. So the following all work:

```javascript
_.div('This is a sentance');
_.div('This ', 'is ', 'a ', 'sentance');
_.div([ 'This ', 'is ', 'a ', 'sentance.' ]);
_.div(['This ', ['is ', 'a ']], 'sentance.');
```

If you want attributes on a tag you must pass them as the first argument:

```javascript
_.section({ id: 'my-id', class: 'my-class' }, /* any children... */)
```

👀 Play with templating in the [playground](https://skiano.github.io/genz/)

------

## Rendering HTML

So far we have only produced a data object that can be sent to a writable stream. Things get a bit more interesting when we render these objects. First, though, let’s take a look at rendering strings.

### To a String

_Needs documentation..._

### To a Writable Stream

_Needs documentation..._

### Using Promises

_Needs documentation..._

### Providing a Context

_Needs documentation..._

### Consuming Readable Streams

_Needs documentation..._

------

## Error Handling

_Needs documentation..._

## Extras

### Inline CSS

_Needs documentation..._

### Deduping

_Needs documentation..._

[Deduping experiment](https://bit.ly/genz-example-1)

### Creating a Custom Tag

If you want to create a tag before you make templates you can do this:

```javascript

import { createTag } from 'genz';

const myTag = createTag('my-tag'); // myTag({ id: 'nice' }, 'hi') => <my-tag id="nice">hi</my-tag>
const myVoidTag = createTag('my-void-tag', true); // myVoidTag({ id: 'nice' }) => <my-void-tag id="nice">

```



