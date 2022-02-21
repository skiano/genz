import express from 'express';
import { parse as parseRoute } from 'regexparam';
import { _, toStream } from '../src/genz.mjs';

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

const MainNav = _.nav({ class: 'navbar navbar-default' },
  _.div({ class: 'container-fluid' },

    // Brand and toggle get grouped for better mobile display
    _.div({ class: 'navbar-header' },
      _.button({
        type: 'button',
        class: 'navbar-toggle collapsed',
        'data-toggle': 'collapse',
        'data-target': '#bs-example-navbar-collapse-1',
        'aria-expanded': "false"
      }, [
        _.span({ class: 'sr-only' }, 'Toggle navigation'),
        _.span({ class: 'icon-bar' }),
        _.span({ class: 'icon-bar' }),
        _.span({ class: 'icon-bar' })
      ]),
      _.a({ class: 'navbar-brand', href: '/' }, 'Home'),
    ),

    // Collect the nav links, forms, and other content for toggling
    _.div({ class: 'collapse navbar-collapse', id: 'bs-example-navbar-collapse-1' },
      _.ul({ class: 'nav navbar-nav navbar-right'},
        _.li({ class: 'dropdown' },
          _.a({
            href: '#',
            class: 'dropdown-toggle',
            'data-toggle': 'dropdown',
            'role': 'button',
            'aria-haspopup': 'true',
            'aria-expanded': 'false'
          }, 'Profile ', _.span({ class: 'caret' })),
          _.ul({ class: 'dropdown-menu' }, [
            _.li((ctx) => _.a({ href: '#' }, ctx.user.email)),
            _.li({ class: 'divider', role: 'separator' }),
            _.li(_.a({ href: '#' }, 'other link'))
          ]),
        )
      )
    )
  )
);

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
      }),
    ),
    _.body(
      MainNav,
      _.main({ class: 'container' }, content),
      _.script({
        type: 'text/javascript',
        src: 'https://code.jquery.com/jquery-1.12.4.min.js',
      }),
      _.script({
        type: 'text/javascript',
        src: 'https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js',
      })
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
  const start = Date.now();

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

  res.on('close', () => {
    console.log(`[get] ${req.url} ${Date.now() - start}ms`);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});