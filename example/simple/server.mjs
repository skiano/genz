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
      { elm: 'p', value: 'This is the first paragraph' },
      { elm: 'p', value: 'This is the second paragraph' },
      
    ]
  },
  'a-very-great-article': {
    title: 'A Very Great Article',
    body: [
      { elm: 'p', value: 'This is the first paragraph' },
      { elm: 'img', attr: { width: '200px', src: 'http://skiano.com/static/art-stew-01.jpg' } },
      { elm: 'p', value: 'This is the second paragraph' },
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
    ),
    _.body(
      _.main({ class: 'page-wrap' }, content)
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

const ArticleBody = body => body.map(({ elm, value, attr }) => {
  return _[elm](attr, value);
});

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