

import { Readable } from 'stream';

export class Render extends Readable {
  constructor(frags) {
    super();
    this._a = frags;
    this._i = 0;
    this._outer = [];
    this.stats = {
      size: frags._bytes,
    }
  }

  _construct(cb) { // TODO how to deal with top level async... and how to get the size :(
    Promise.resolve(this._a).then((a) => {
      this._a = a;
      cb();
    }).catch(cb);
  }

  _read() {
    let frag = this._a[this._i];

    while(typeof frag === 'undefined' && this._outer.length) {
      [this._a, this._i] = this._outer.pop();
      frag = this._a[this._i];
    }

    if (Array.isArray(frag)) {
      this._outer.push([this._a, this._i + 1]);
      this._i = 0;
      this._a = frag;
      frag = this._a[this._i];
    }

    if (typeof frag !== 'undefined' && !Array.isArray(frag)) {
      this.push(frag);
      this._i++;
    } else {
      this.push(null);
    }
  }

  _destroy(error, cb) {
    cb();
  }
}

// const r = new Render([
//   1,
//   2,
//   [0, 0],
//   [1, 1],
//   3,
//   [
//     4,
//     5,
//     6,
//     [
//       7,
//       8
//     ],
//     9
//   ],
//   10,
//   [
//     11,
//     [
//       12
//     ],
//   ],
//   13,
//   14,
//   15,
// ]);

// r.on('data', (d) => {
//   console.log(d.toString());
// })
// r.pipe(process.stdout);