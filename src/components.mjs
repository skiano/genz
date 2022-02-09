import _, { css } from './tagen.mjs';

const aboveFoldCSS = [
  css('html', {
    'color': 'red',
  }),
  css('p', {
    'text-decoration': 'underline',
  })
];

const Page = (opt, content) => {
  return (
    _.html(
      _.head(
        _.title(opt.title),
        _.style(aboveFoldCSS)
      ),
      _.body(content),
    )
  );
}

export const Home = () => {
  const paragraphs = [];
  for (let i = 0; i < 20 * 1000; i++) {
    paragraphs.push(_.p(`paragraph ${i}`));
  }
  return Page({
    title: 'Home Page',
  }, (
    _.main(
      _.p([
        _.span('a'), 100,
        _.span('a'),
      ]),
      paragraphs,
    )
  ));
};

const ArticleStyle = _.style(
  css('.article__body', {
    border: '1px solid blue',
  })
);

export const Article = (articleId) => {
  const article = {
    body: `Lorem Ipsum for article: ${articleId}`,
  };
  return Page({
    title: 'Article'
  },([
    ArticleStyle,
    _.div(
      _.section(
        ArticleStyle
      )
    ),
    ArticleStyle,
    _.main({ class: 'article__body' }, article.body)
  ]));
};

// EXAMPLE
// const a = await Article('123');
// for (let f of a) console.log(f);