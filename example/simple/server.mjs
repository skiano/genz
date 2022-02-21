import express from 'express';
import { parse as parseRoute } from 'regexparam';
import { _, toStream } from '../../genz.mjs';

//////////////
// SERVICES //
//////////////

const ARTICLES = {
  'hello-world': {
    title: 'Hello World',
    body: [
      { elm: 'p', value: 'Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam id dolor id nibh ultricies vehicula.' },
      { elm: 'p', value: 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec ullamcorper nulla non metus auctor fringilla. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Donec ullamcorper nulla non metus auctor fringilla.' },
    ]
  },
  'a-very-great-article': {
    title: 'A Very Great Article',
    body: [
      { elm: 'p', value: 'Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam id dolor id nibh ultricies vehicula.' },
      { elm: 'img', attr: { width: '200px', src: 'http://skiano.com/static/art-stew-01.jpg' } },
      { elm: 'p', value: 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec ullamcorper nulla non metus auctor fringilla. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Donec ullamcorper nulla non metus auctor fringilla.' },
      { elm: 'p', value: 'Maecenas sed diam eget risus varius blandit sit amet non magna. Donec id elit non mi porta gravida at eget metus. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.'},
    ]
  }
};

const fetchArticle = (id) => Promise.resolve(ARTICLES[id]);
const fetchArticleList = () => Promise.resolve(
  Object.entries(ARTICLES).map(([id, article]) => {
    return { id, title: article.title }
  })
);

////////////////
// COMPONENTS //
////////////////

const Page = ({ title }, content) => {
  return _.html(
    _.head(
      _.title(title),
      _.meta({
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
      }),
      _.link({
        rel: 'stylesheet',
        href: 'https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css',
      }),
      _.link({
        rel: 'stylesheet',
        href: 'https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap-theme.min.css',
      })
    ),
    _.body(
      _.main({ class: 'container' }, content)
    )
  )
};

const HomePage = Page({ title: 'Home '}, [
  _.h1('Home Page'),
  async function provideArticles (ctx) {
    const articleList = await fetchArticleList();
    return _.nav(
      _.ul(
        articleList.map(({ id, title }) => {
          return _.li(
            _.a({ href: `/article/${id}` }, title)
          );
        })
      )
    );
  }
]);

const ArticleBody = body => body.map(({ elm, value, attr }) => _[elm](attr, value));

const ArticlePage = async (ctx) => {
  const article = await fetchArticle(ctx.route.params.article_id);
  return Page({
    title: 'My Article Page',
  }, [
    _.a({ href: '/'}, 'home'),
    _.h1(article.title),
    ArticleBody(article.body)
  ]);
};

/////////////////
// APPLICATION //
/////////////////

const app = express();

// The application router
const routes = [
  { path: '/', component: HomePage },
  { path: '/article/:article_id', component: ArticlePage },
].map((route) => ({...route, ...parseRoute(route.path)}));

// The page request handler
app.get('*', (req, res, next) => {

  // 1. Search for a matching route
  let r;
  let route;
  let match;
  for (r = 0; r < routes.length; r++) {
    route = routes[r];
    match = route.pattern.exec(req.url);
    if (match) break;
  }

  // 2. Handle 404 
  if (!match) return next();

  // 3. Mix in route parameters
  let k;
  let params = {};
  if (route.keys.length) {
    for (k = 0; k < route.keys.length; k++) params[route.keys[k]] = match[k + 1];
  }

  // 4. Create a page "context"
  const ctx = {
    route: { params },
    user: {
      name: 'Greg',
      email: 'gregory@awesome.com',
    }
  };

  // 5. Stream the content
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Transfer-Encoding', 'chunked');
  toStream(res, route.component, ctx);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});