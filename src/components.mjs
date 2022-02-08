import { css } from './css.mjs';
import * as _ from './html.mjs';

const latent = (v, t = 100) => v //
// const latent = (v, t = 100) => v new Promise((resolve) => setTimeout(resolve, t, v));

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

export const Home = async () => {
  const paragraphs = [];
  for (let i = 0; i < 20 * 1000; i++) {
    paragraphs.push(_.p(`paragraph ${i}`));
  }
  return Page({
    title: 'Home Page',
  }, (
    _.main(
      latent(_.p([
        latent(_.span('a'), 100),
        latent(_.span('a'), 100),
      ]), 100),
      paragraphs,
    )
  ));
};

const ArticleStyle = _.styleOnce(
  css('.article__body', {
    border: '1px solid blue',
  })
);

export const Article = async (articleId) => {
  const article = await Promise.resolve({
    body: `Lorem Ipsum for article: ${articleId}`,
  });
  return Page({
    title: 'Article'
  },([
    // ArticleStyle,
    _.main({ class: 'article__body' }, article.body)
  ]));
};