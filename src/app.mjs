import Koa from 'koa';
import send from 'koa-send';
import route from 'koa-route';
import { TagStream } from './tagen.mjs';
import { Home, Article } from './components.mjs';

const app = new Koa();

app.use(async function logger (ctx, next) {
  const start = Date.now();
  await next();
  ctx.res.once('finish', () => {
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - Stream: ${ms}ms Render: ${ctx.response.get('X-Render-Time')}ms`);
  });
});

const page = (component) => {
  return async function handlePage(ctx, ...args) {
    const start = Date.now();
    const tree = await component(args.slice(0, -1));
    ctx.set('X-render-time', Date.now() - start);

    ctx.set('Content-Type', 'text/html; charset=UTF-8');
    ctx.set('Transfer-Encoding', 'chunked');
    ctx.body = new TagStream(tree);

    // ctx.res.on('drain', () => {
    //   console.log('drain...')
    // })
  }
}

app.use(route.get('/', page(Home)));
app.use(route.get('/article/:articleId', page(Article)));

// serve some client js...
app.use(route.get('/client.js', async (ctx) => {
  await send(ctx, 'src/client.js');
}))

app.on('error', (error) => {
  if (error.code === 'EPIPE' || error.code === 'ECONNRESET') {
    // console.log('Koa app-level EPIPE error.', { error })
    // these errors pop up when the page refreshes before the stream is finished...
    return;
  } else {
    console.log('Koa app-level error', { error });
  }
})

app.listen(3000, () => {
  console.log(`http://localhost:3000`);
});