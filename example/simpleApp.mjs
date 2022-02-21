import http from 'http';
import { _, toStream } from '../genz.mjs';

const fetchArticle = (id) => {
  return Promise.resolve({
    123: {
      title: 'Cool Article',
      content: [
        { elm: 'p', value: 'Wow! a paragraph' },
      ],
    },
  }[id]);
};

const Profile = _.section((ctx) => {
  return _.p(`hello ${ctx.username}`)
});

const Article = (article) => {
  return _.section({ class: 'article' }, 
    _.h2({ class: 'article__title' }, article.title),
    _.div({ class: 'article__body' },
      article.content.map(({ elm, value }) => {
        return _[elm](value)
      })
    )
  );
};

const ArticlePage = _.section({ class: 'page' }, async (ctx) => {
  const article = await fetchArticle(ctx.articleId);
  return Article(article);
});

const Page = (...content) => {
  return _.main(
    { class: 'page__wrap' },
    ...content
  );
};

const App = _.html(
  _.head(),
  _.body(
    Page(
      Profile,
      ArticlePage
    )
  )
);

const server = http.createServer((req, res) => {
  if (req.url !== '/') return res.end();

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.statusCode = 200;

  const before = Date.now();

  toStream(res, App, {
    username: 'Greg',
    articleId: 123,
  });

  res.on('close', () => {
    console.log(`-> ${Date.now() - before}ms`);
  });

  // TODO: handle aborts and close etc
});

const PORT = process.env.PORT || 3000;

server.listen(3000, () => {
  console.log(`http://localhost:${PORT}`);
});