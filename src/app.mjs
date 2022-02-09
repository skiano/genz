import Koa from 'koa';
import route from 'koa-route';
import { TagStream } from './tagen.mjs';
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
    const start = Date.now();
    const tree = await component(args.slice(0, -1));
    console.log(`render ${Date.now() - start}ms`);

    ctx.set('Content-Type', 'text/html; charset=UTF-8');
    ctx.set('Transfer-Encoding', 'chunked');
    ctx.body = new TagStream(tree);

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