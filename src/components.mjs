import { stdout } from 'process';
import _, { css, inlineFile } from './tag.mjs';

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
    ]),
    _.script({ type: 'module' }, inlineFile('src/inline.js')),
    // _.script({ type: 'text/javascript' }, '_XT=[];_XTI=t=>_XT.push(t);')
    _.script({ type: 'text/javascript' }, `    
      const _XT = { push: (node) => {
        setInterval(() => {
          node.style.visibility = node.style.visibility === 'visible' ? 'hidden' : 'visible';
        }, 200);
      }
      }
    `)
  )
)

const Well = (...args) => (
  _.body(
    // _.script({
    //   type: 'text/javascript',
    //   src: '/client.js'
    // }),
    _.main({ class: 'well' }, ...args)
  )
)

const Init = (id) => {
  return _.script({ type: 'text/javascript' }, `_XT.push(document.getElementById('${id}'))`);
}

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
          { id: 'exampleId' },
          _.p(_.strong('a super big page!')),
          Init('exampleId'),
        ),
        paragraphs
      )
    )
  );
};

export const Article = async (articleId) => {
  // simulate a async data request...
  const data = await Promise.resolve({
    body: `Article content for ${articleId}`,
  })

  return (
    _.html(
      Head({ title: articleId }),
      Well(
        _.section(
          _.p(data.body)
        )
      )
    )
  )
};

// EXAMPLE
// const a = await Article('123');
// for (let f of a) console.log(f);
// tagStream(
//   _.script(inlineFile('src/inline.js'))
// ).pipe(stdout);
