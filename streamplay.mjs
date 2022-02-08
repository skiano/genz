import { Duplex, Readable } from 'stream';

// const ksource = Symbol('source');

// class Render extends Duplex {
//   constructor(source, options) {
//     super(options);
//     this[ksource] = source;
//   }

//   _write(chunk, encoding, callback) {
//     // The underlying source only deals with strings.
//     if (Buffer.isBuffer(chunk)) {
//       chunk = chunk.toString();
//     }
//     this[kSource].writeSomeData(chunk);
//     callback();
//   }

//   _read(size) {
//     this[kSource].fetchSomeData(size, (data, encoding) => {
//       this.push(Buffer.from(data, encoding));
//     });
//   }
// }

// console.log(new Render('abc'));

// SEE: https://nodejs.org/api/stream.html#api-for-stream-implementers
// class Counter extends Readable {
//   constructor(frags) {
//     super();
//     this._max = 10;
//     this._index = 1;
//   }

//   _read() {
//     const i = this._index++;
//     if (i > this._max)
//       this.push(null);
//     else {
//       const str = String(i);
//       const buf = Buffer.from(str, 'ascii');
//       setTimeout(() => {
//         this.push(buff);
//       }, 100);
//     }
//   }
// }



const isPromise = (o) => typeof o === 'object' && !!o.then;

class Render extends Readable {
  constructor(frags) {
    super();
    this._a = frags;
    this._i = 0;
    this._outer = [];
  }

  _construct(cb) { // TODO how to deal with top level async... and how to get the size :(
    Promise.resolve(this._a).then((a) => {
      this._a = a;
      cb();
    }).catch(cb);
  }

  _read() {
    let frag = this._a[this._i];
    if (Array.isArray(frag)) {
      this._outer.push([this._a, this._i + 1]);
      this._i = 0;
      this._a = frag;
      frag = this._a[this._i];
    }

    if (typeof frag === 'undefined' && this._outer.length) {
      [this._a, this._i] = this._outer.pop();
      frag = this._a[this._i];
    }

    if (typeof frag !== 'undefined' && !Array.isArray(frag)) {
      this.push(String(frag), 'utf8');
      this._i++;
    }
  }

  _destroy(error, cb) {
    cb();
  }
}

const r = new Render([
  1,
  2,
  3,
  [
    4,
    5,
    6,
    [
      7,
      8
    ],
    9
  ],
  10,
  [
    11,
    [
      12
    ],
  ],
  13,
  14,
  15,
]);

// r.on('data', (d) => {
//   console.log(d.toString());
// })

r.pipe(process.stdout);