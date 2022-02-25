⚠️ WARNING: This is exprimental.

# Gen Z

Streaming-first SSR for Node Apps

👀 View a [Live demo](https://skiano.github.io/genz/)

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

## Why

It’s true, many websites can be and perhaps should be client-side or universal. However, some websites have pages with mostly static content and all the bells and whistles you need to get a universal site working (not to mention reasonably sized) might not be worth it.

This option aims to:

- Require no tooling or "compiling" for rendering the server HTML
- Requires no dependencies
- Chunked streaming render by default (avoids blocking and respects back pressure in response)
- Immediately start sending content, while allowing parts of the page to wait for async work

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

If you want to create a tag before you make templates you can do this:

```javascript

import { createTag } from 'genz';

const myTag = createTag('my-tag'); // myTag({ id: 'nice' }, 'hi') => <my-tag id="nice">hi</my-tag>
const myVoidTag = createTag('my-void-tag', true); // myVoidTag({ id: 'nice' }) => <my-void-tag id="nice">

```

------

## Rendering HTML

So far we have only produced a data object that can be sent to a writable stream. Things get a bit more interesting when we render these objects. First, though, let’s take a look at rendering strings.

### To a String

_NEEDS DOCUMENTATION_

### To a Writable Stream

_NEEDS DOCUMENTATION_

### Using Promises

_NEEDS DOCUMENTATION_

### Providing a Context

_NEEDS DOCUMENTATION_

### Consuming Readable Streams

_NEEDS DOCUMENTATION_

------

## Error Handling

_NEEDS DOCUMENTATION_

## Extras

### Inline CSS

_NEEDS DOCUMENTATION_

### Deduping

_NEEDS DOCUMENTATION_

[Deduping experiment](https://skiano.github.io/genz/#Ly8gZGVkdXBlIGVuc3VyZXMgdGhpcyBmcmFnbWVudCBjYW4gb25seSByZW5kZXIgb25jZQpjb25zdCBob29rID0gZGVkdXBlKAogIF8uc2NyaXB0KGBmdW5jdGlvbiB0b2dnbGUobikgeyB0aGlzLmNsYXNzTGlzdC50b2dnbGUobikgfWApLAogICd0b2dnbGUtc2NyaXB0JwopOwoKLy8gdGhlIHRvZ2dsZSBjb21wb25lbnQgcmVxdWlyZXMgdGhlIGJpdCBvZiBqcwovLyBidXQgaXQgb25seSBuZWVkcyB0byBsb2FkIG9uY2UuCi8vIGJ1dCB0aGlzIGFsc28gbWVhbnMgaXQgd291bGQgbm90IGxvYWQgYXQgYWxsCi8vIGlmIG5vIHRvZ2dsZSBpcyBwcmVzZW50CmNvbnN0IHRvZ2dsZSA9ICh0YWcsIGF0dHIsIGNoaWxkcmVuKSA9PiBbCiAgaG9vaywKICBfW3RhZ10oewogICAgLi4uYXR0ciwKICAgIG9uY2xpY2s6IGB0b2dnbGUuY2FsbCh0aGlzLCd0b2dnbGUtLWFjdGl2ZScpYAogIH0sIGNoaWxkcmVuKSwKXTsKCl8uaHRtbCgKICBfLmhlYWQoCiAgICBfLnRpdGxlKCdCYXNpYyBFeGFtcGxlJyksCiAgICBfLnN0eWxlKAogICAgICBjc3MoJ3AnLCB7CiAgICAgICAgY3Vyc29yOiAncG9pbnRlcicKICAgICAgfSksCiAgICAgIGNzcygnYm9keScsIHsKICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdnYWluc2Jvcm8nCiAgICAgIH0pLAogICAgICBjc3MoJy50b2dnbGUtLWFjdGl2ZScsIHsKICAgICAgICBjb2xvcjogJ3JlZCcsCiAgICAgICAgZm9udFNpemU6ICczMHB4JwogICAgICB9KQogICAgKSwKICApLAogIF8uYm9keSgKICAgIF8uaDEoJ0hlbGxvIFdvcmxkJyksCiAgICB0b2dnbGUoJ3AnLCB7IGNsYXNzOiAnbXktcCcgfSwgJ2hlbGxvIHdvcmxkIDEnKSwKICAgIHRvZ2dsZSgncCcsIHsgY2xhc3M6ICdteS1wJyB9LCAnaGVsbG8gd29ybGQgMicpLAogICAgdG9nZ2xlKCdwJywgeyBjbGFzczogJ215LXAnIH0sICdoZWxsbyB3b3JsZCAzJyksCiAgKQop)



