import { Readable } from 'stream';

export class NodeStream extends Readable {
  #node
  #stack

  constructor(list) {
    super();
    this.#node = list.head();
    this.#stack = [];
  }

  _read() {
    if (this.#node.value instanceof Linked) {
      this.#stack.push(this.#node);
      this.#node = this.#node.value.head();
    }
    if (this.#node) this.push(this.#node.value);
    this.#node = (this.#node || this.#stack.pop() || {}).next;
    if (!this.#node) return this.push(null)
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
    this.#len += this.#measure(value); //but how to deduct once...
  }

  walk(cb) {
    const s = [this];

    let n = this.#head;
    while (n) {
      cb(n);
      n = n.next;
    }
  }
}

// EXAMPLE...
//
const l1 = new Linked({ transform: v => String(v) });
l1.add(1);
l1.add(2);
l1.add(3);

const l2 = new Linked({ transform: v => String(v) });
l2.add(4);
l2.add(5);

l1.add(l2);
l1.add(6);
l1.add(7);

// const s = new NodeStream(l1);
// s.pipe(process.stdout);

l1.walk(({ value }) => {
  console.log(value)
});
