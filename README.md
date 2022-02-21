
<div style="width: 40%;">
  <br/>
  <img width="140px" alt="Kids" src="https://www.payscale.com/wp-content/uploads/2021/10/GettyImages-1055085608-e1558101723252-1024x614.jpg"/>
  <img width="150px" alt="More kids" src="https://about.unimelb.edu.au/__data/assets/image/0025/223936/varieties/large.png"/>
  <img width="170px" alt="Even more Kids" src="https://www.familyeducation.com/sites/default/files/2020-10/25-gen-z-slang-terms-parents-should-know.jpg"/>
</div>

<hr/>

# Gen Z

Revisiting Server-first app development

_NOTE: this is VERY exprimental and not ready for use and may turn out, unsurprisingly, to be a colossal failure_

## Why

It’s true, many websites can be and perhaps should be client-side or universal. However, some websites have large pages with mostly static content and the kind of dependencies and tooling required to have all the bells and whistles, just so you can manage the creating and loading of the requisite javascript—well, that is getting to be a drag. This is an experiment to see what can be done by starting by assuming server-side rendering should really be separate some cases.

The hope is to:

- Avoid tooling
- Streaming by default
- Start sending content, while allowing parts of the render to be async
- Extremely minimal


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
      _.title('Basic Example')
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
``

