import Koa from 'koa';
import route from 'koa-route';
import { Render } from './render.mjs';
import { Home, Article } from './components.mjs';

const app = new Koa();

const page = (component) => {
  return async function handlePage(ctx, ...args) {
    args.pop();
    const fragments = await component(...args);
    const renderStream = new Render(fragments);
    ctx.set('Content-Length', renderStream.stats.size);
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