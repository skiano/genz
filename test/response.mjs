import { Writable } from 'stream';
import _, { reqRes } from '../src/tag.mjs'; 

class ResponseLike extends Writable {
  constructor(options) {
    super(options);
    this.arr = [];
  }

  _write(chunk, encoding, next) {
    process.nextTick(() => {
      this.arr.push(chunk.toString());
      next();
    });
  }
}


export default [

  async function TEST_STREAMING_RESPONSE () {

    const res = new ResponseLike({
      highWaterMark: 4,
    });

    res.on('drain', (a) => {
      console.log('drain')
    })

    res.on('close', () => {
      console.log('close', res.arr, res.arr.length);
    })

    reqRes(_.div('hello world'), res);
  },

]