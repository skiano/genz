import { Readable } from 'stream';

function* each(l) {
  let n = l.head();
  while(n) {
    yield n;
    n = n.next;
  }
}

export function* traverse (arr) {
  let queue = [each(arr)];
  while (queue.length) {
    const { value, done } = queue[0].next();
    if (value && value.value instanceof Linked) {
      queue.unshift(each(value.value));
    } else {
      if (value) yield value;
      if (done) {
        queue.shift();
      }
    }
  }
}

export class Linked {
  #len
  #head
  #tail
  #once
  #measure
  #transform;

  constructor(options = {}) {
    this.#len = 0;
    this.#once = options.once;
    this.#measure = options.measure || (v => v.length);
    this.#transform = options.transform;
  }

  head() { return this.#head }

  tail() { return this.#tail }

  length() { return this.#len }

  isOnce() { return this.#once }

  add(value) {
    const node = {
      value: this.#transform && !(value instanceof Linked)
        ? this.#transform(value)
        : value
    };

    if (this.#tail) {
      this.#tail.next = node;
    } else {
      this.#head = node;
    }
    this.#tail = node;
    this.#len += value instanceof Linked  //but how to deduct once...
      ? value.length()
      : this.#measure(value);
  }

  walk(cb) {
    const it = traverse(this);
    for (let i of it) {
      cb(i);
    }
  }

  stream() {
    return new NodeStream(this);
  }
}

export class NodeStream extends Readable {
  #iterator

  constructor(list) {
    super();
    this.#iterator = traverse(list);
  }

  _read() {
    const { value, done } = this.#iterator.next();
    if (done) this.push(null);
    else this.push(value.value);
  }
}

// EXAMPLE...
//
// const l1 = new Linked({ transform: v => String(v) });
// l1.add(1);
// l1.add(2);
// l1.add(3);

// const l2 = new Linked({ transform: v => String(v) });
// l2.add(4);
// l2.add(5);

// l1.add(l2);
// l1.add(6);
// l1.add(7);

// const s = new NodeStream(l1);
// s.pipe(process.stdout);

// l1.walk((v) => {
//   console.log(v.value)
// });
