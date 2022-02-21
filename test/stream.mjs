import assert from 'assert';
import { Writable } from 'stream';
import { _, toStream } from '../genz.mjs';

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
      const highWaterMark = 6;
      const res = new ResponseLike({ highWaterMark });

      res.on('close', () => {
        console.log(res.arr.join('\n'));
        // assert.equal(res.arr.join(' '), '<div> <section> DRAIN section! DRAIN </section> DRAIN <p> hello </p> </div> DRAIN');
        resolve();
      });

      res.on('error', reject);

      const fetchArticle = (id) => {
        return Promise.resolve({
          123: { title: 'Cool Article' },
        }[id]);
      };

      const Page = ({ title }) => ([
        _.h1(title),
        _.section((ctx) => {
          return _.p(`hello ${ctx.username}`)
        }),
        _.section(async (ctx) => {
          const article = await fetchArticle(ctx.articleId);
          return _.h2(article.title);
        }),
      ]);

      const App = () => {
        return _.html(
          _.head(),
          _.body(
            _.main(
              Page('My Page')
            )
          )
        )
      }

      toStream(res, App, {
        username: 'Greg',
        articleId: 123,
      });
    });
  },

];