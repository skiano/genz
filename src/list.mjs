
class Linked {
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


// function createList() {
//   let length = 0;
//   let head;
//   let tail;
//   let n;
//   let subhead;

//   return {
//     length: () => length,
//     head: () => head,
//     tail: () => tail,
//     add: (value) => {
//       // Splice in another list...
//       // todo: make this a class so this check can be exact?
//       if (!!value.head) {
//         subhead = value.head();
//         tail.next = subhead;
//         subhead.prev = tail;
//         tail = value.tail();

//         if (!head) head = Lhead;

//         length += value.length();
//         return;
//       }

//       // Add a simple node
//       else {
//         n = { v: value };

//         if (tail) {
//           tail.next = n;
//           n.prev = tail;
//         }

//         if (!head) {
//           head = n;
//         }

//         tail = n;
//         length += 1;
//       }
//     },
//     remove: (node) => {
//       n = node || tail;

//       if (length && n) {
//         const l = n.prev;
//         const r = n.next;

//         if (l) {
//           l.next = r;
//         } else {
//           head = r;
//         }

//         if (r) {
//           r.prev = l;
//         } else {
//           tail = l;
//         }

//         length -= 1;
//       }
//     },
//     walk: function(cb, start) {
//       n = start || head;
//       while (n) {
//         cb(n);
//         n = n.next;
//       }
//     },
//   }
// }

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


l1.walk(({ value }) => {
  console.log('hello!', value);
});
console.log(l1.length());