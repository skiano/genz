import fs from 'fs';
import { _, toStream } from '../src/genz.mjs';
import { Writable } from 'stream';
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

export default [

  async function TEST_CONSUME_READABLE () {
    await new Promise((resolve) => {  
      const res = new ResponseLike();
  
      res.on('close', () => {
        assert.equal(res.arr.join(''), '<div><p>This is on disk</p></div>');
        resolve();
      });
  
      toStream(res, _.div(fs.createReadStream('test/_.example.html')));

    });
  },

];