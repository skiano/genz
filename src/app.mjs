import Koa from 'koa';
import route from 'koa-route';
import { NodeStream } from './linked.mjs';
import { Home, Article } from './components.mjs';

const app = new Koa();

app.use(async function logger (ctx, next) {
  const start = Date.now();
  await next();
  ctx.res.once('finish', () => {
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  });
});

const page = (component) => {
  return async function handlePage(ctx, ...args) {
    args.pop();
    
    const start = Date.now();
    const fragments = await component(...args);
    console.log(`render ${Date.now() - start}ms`);

    const renderStream = new NodeStream(fragments);
    ctx.set('Content-Length', fragments.length());
    ctx.set('Content-Type', 'text/html; charset=UTF-8');
    ctx.body = renderStream;

    // checkout the way it pauses!!!!
    // ctx.body.on('pause', () => { console.log('pagestream: pause') });
    // ctx.res.on('drain', () => { console.log('response: drain') });
  }
}

app.use(route.get('/', page(Home)));
app.use(route.get('/article/:articleId', page(Article)));

app.on('error', err => {
  console.error('server error', err)
});

app.listen(3000, () => {
  console.log(`http://localhost:3000`);
});