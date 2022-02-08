import { Readable } from 'stream';

export class Render extends Readable {
  constructor(frags) {
    super();
    this._i = 0;
    this._a = frags;
    this._outer = [];
    this.stats = { size: frags._bytes };
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
}

// EXAMPLE... WORKS
// const r = new Render([
//   ['1', '2', '3'],
//   ['4', '5', '6'],
// ]);

// EXAMPLE... BUSTED
// const r = new Render([
//   ['1', '2', '3'],
//   ['4', '5', '6'],
// ]);

// r.pipe(process.stdout);
