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

      toStream(_.div(_.section('section!'), _.p('hello')), res);
    });
  },

];