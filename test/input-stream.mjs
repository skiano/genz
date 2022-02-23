import { _, toStream } from '../src/genz.mjs';
import { Readable, Writable } from 'stream';
import assert from 'assert';

class ResponseLike extends Writable {
  constructor(options) {
    super(options);
    this.arr = [];
  }

  _write(chunk, encoding, next) {
    this.arr.push(chunk.toString());
    next();
  }

  _destroy(err, cb) {
    cb();
  }
}

class FakeReadable extends Readable {
  constructor (options) {
    super(options);
    this.i = 0;
    this.chunks = options.chunks;
  }

  _read() {
    this.push(this.chunks[this.i]);
    this.i = this.i + 1;
  }
}

export default [

  async function TEST_CONSUME_READABLE () {
    await new Promise((resolve) => {

      const readable = new FakeReadable({
        highWaterMark: 1,
        chunks: ['A', 'B', 'C'],
      });
  
      const res = new ResponseLike();
  
      res.on('close', () => {
        assert.equal(res.arr.join(','), '<div>ABC</div>');
        resolve();
      });
  
      toStream(res, _.div(readable));

    });
  },

];