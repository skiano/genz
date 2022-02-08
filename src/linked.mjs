import { Readable } from 'stream';

export class NodeStream extends Readable {
  #node

  constructor(list) {
    super();
    this.#node = list.head();
  }

  _read() {
    if (this.#node) {
      this.push(this.#node.value);
      this.#node = this.#node.in || (this.#node.out && this.#node.out.next) || this.#node.next;
    } else {
      this.push(null);
    }
  }
}

export class Linked {
  #head
  #tail
  #once
  #length
  #measure
  #transform;

  constructor(options = {}) {
    this.#length = 0;
    this.#measure = options.measure || (v => v.length);
    this.#transform = options.transform;
    this.#once = options.once;
  }

  head() { return this.#head }

  tail() { return this.#tail }

  length() { return this.#length }

  isOnce() { return this.#once }

  add(value) {
    // splice in child list
    if (value instanceof Linked) {
      if (!this.#tail) this.#head = this.#tail = {}; // if the list is the first item
      this.#tail.in = value.head();
      value.tail().out = this.#tail; // how to skip the repeat
      this.#length += value.length(); // how to handle once!!!!
    }
    // normal node
    else {
      const node = {
        value: this.#transform ? this.#transform(value) : value
      };

      if (this.#tail) {
        this.#tail.next = node;
      } else {
        this.#head = node;
      }
      this.#tail = node;
      this.#length += this.#measure(value);
    }
  }

  walk(cb) {
    let n = this.#head;
    while (n) {
      cb(n);
      n = n.in || (n.out && n.out.next) || n.next;
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

const s = new NodeStream(l1);
s.pipe(process.stdout);

// l1.walk(({ value }) => {
//   console.log(value)
// });
