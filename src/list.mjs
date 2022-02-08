function createList() {
  let length = 0;
  let head;
  let tail;
  let n;
  let subhead;

  return {
    length: () => length,
    head: () => head,
    tail: () => tail,
    add: (value) => {
      // Splice in another list...
      // todo: make this a class so this check can be exact?
      if (!!value.head) {
        subhead = value.head();
        tail.next = subhead;
        subhead.prev = tail;
        tail = value.tail();

        if (!head) head = Lhead;

        length += value.length();
        return;
      }

      // Add a simple node
      else {
        n = { v: value };

        if (tail) {
          tail.next = n;
          n.prev = tail;
        }

        if (!head) {
          head = n;
        }

        tail = n;
        length += 1;
      }
    },
    remove: (node) => {
      n = node || tail;

      if (length && n) {
        const l = n.prev;
        const r = n.next;

        if (l) {
          l.next = r;
        } else {
          head = r;
        }

        if (r) {
          r.prev = l;
        } else {
          tail = l;
        }

        length -= 1;
      }
    },
    walk: function(cb, start) {
      n = start || head;
      while (n) {
        cb(n);
        n = n.next;
      }
    },
  }
}

const l1 = createList();
l1.add(1);
l1.add(2);
l1.add(3);

const l2 = createList();
l2.add(4);
l2.add(5);

l1.add(l2);
l1.add(6);
l1.add(7);


l1.walk(({ v }) => {
  console.log('hello!', v);
});
console.log(l1.length());