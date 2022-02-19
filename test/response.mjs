import assert from 'assert';
import { Writable } from 'stream';
import _, { reqRes } from '../genz.mjs'; 

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

  async function TEST_RESPECTS_HIGHWATER_MARK () {
    await new Promise((resolve) => {

      const highWaterMark = 6;
      const res = new ResponseLike({ highWaterMark });
  
      res.on('drain', () => {
        res.arr.push('DRAIN');
      });

      res.on('close', () => {
        assert.equal(res.arr.join(' '), '<div> <section> DRAIN section! DRAIN </section> DRAIN <p> hello </p> </div> DRAIN');
        resolve();
      });
  
      reqRes(_.div(_.section('section!'), _.p('hello')), res);
    });
  },

]