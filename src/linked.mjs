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
      this.#node = this.#node.next;
    } else {
      this.push(null);
    }
  }
}

export class Linked {
  #head
  #tail
  #length
  #measure
  #transform;

  constructor(options = {}) {
    this.#length = 0;
    this.#measure = options.measure || (v => v.length);
    this.#transform = options.transform;
  }

  head() { return this.#head }

  tail() { return this.#tail }

  length() { return this.#length }

  add(value) {
    if (value instanceof Linked) {
      const subhead = value.head();
      this.#tail.next = subhead;
      this.#tail = value.tail();
      if (!this.#head) this.#head = subhead;
      this.#length += value.length();
    }

    // Add a simple node
    else {
      if (this.#transform) value = this.#transform(value);
      const node = { value };
      if (this.#tail) this.#tail.next = node;
      if (!this.#head) this.#head = node;
      this.#tail = node;
      this.#length += this.#measure(value);
    }
  }

  walk(cb) {
    let n = this.#head;
    while (n) {
      cb(n);
      n = n.next;
    }
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
