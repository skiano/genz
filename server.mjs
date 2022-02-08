import Koa from 'koa';
import { Render } from './render.mjs';
import {
  div,
  p,
  span
} from './sizable.mjs';

const app = new Koa();

// logger

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time

// app.use(async (ctx, next) => {
//   const start = Date.now();
//   await next();
//   const ms = Date.now() - start;
//   ctx.set('X-Response-Time', `${ms}ms`);
// });

// response

app.use(async ctx => {
  const start = Date.now();
  const latent = (v, t = 100) => new Promise((resolve) => setTimeout(resolve, t, v));
  
    
  const page = await div(
    latent(p([
      latent(span('a'), 100),
      latent(span('a'), 100),
    ]), 100),
  );

  console.log(`PAGE TIME ${Date.now() - start}`);
  console.log(page);
  
  const pageStream = new Render(page);
  console.log(`PAGE SIZE`, pageStream.stats);

  ctx.set('Content-Type', 'text/html; charset=UTF-8');
  ctx.set('Content-Length', pageStream.stats.size);
  ctx.body = pageStream;
});

// error handling

app.on('error', err => {
  console.error('server error', err)
});

app.listen(3000, () => {
  console.log(`http://localhost:3000`);
});