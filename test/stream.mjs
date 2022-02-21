import assert from 'assert';
import { Writable } from 'stream';
import { _, toStream } from '../src/genz.mjs';

class ResponseLike extends Writable {
  constructor(options) {
    super(options);
    this.arr = [];
  }

  _write(chunk, encoding, next) {
    this.arr.push(chunk.toString());
    next();
  }
}

export default [

  async function TEST_STREAM_EXAMPLE () {
    await new Promise((resolve, reject) => {
      const highWaterMark = 6;
      const res = new ResponseLike({ highWaterMark });

      res.on('drain', () => {
        res.arr.push('DRAIN');
      });

      res.on('close', () => {
        assert.equal(res.arr.join(' '), '<div> <section> DRAIN section! DRAIN </section> DRAIN <p> hello </p> </div> DRAIN');
        resolve();
      });

      res.on('error', reject);

      toStream(res, _.div(_.section('section!'), _.p('hello')));
    });
  },

  async function TEST_ASYNC_DATA_FETCHING_FROM_CTX () {

    await new Promise((resolve, reject) => {
      const res = new ResponseLike();
      res.on('error', reject);
      res.on('close', () => {
        console.log(res.arr.join('\n'));
        resolve();
      });

      // Some Example "components"

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

      // Rendering the components with a "context"

      const ctx =  {
        username: 'Greg',
        articleId: 123,
      };

      toStream(res, App, ctx);
    });
  },

];