import _, { css } from './tagen.mjs';

const Head = (opt, ...args) => (
  _.head(
    _.title(opt.title || 'My Site'),
    args,
    _.style([
      css('html', {
        'color': 'blue',
      }),
      css('p', {
        'border': '1px solid red',
        'padding': '10px',
      })
    ])
  )
)

const Well = (...args) => (
  _.body(
    _.main({ class: 'well' }, ...args)
  )
)

export const Home = () => {
  const paragraphs = [];
  for (let i = 0; i < 20 * 1000; i++) {
    paragraphs.push(_.p(`paragraph ${i}`));
  }
  return (
    _.html(
      Head({ title: 'Home' }),
      Well(
        _.div(
          _.p(_.strong('a super big page!'))
        ),
        paragraphs
      )
    )
  );
};

export const Article = (articleId) => {
  return (
    _.html(
      Head({ title: articleId }),
      Well(
        _.section(
          _.p(`Article content for ${articleId}`)
        )
      )
    )
  )
};

// EXAMPLE
// const a = await Article('123');
// for (let f of a) console.log(f);