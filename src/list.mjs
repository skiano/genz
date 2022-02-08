function createList() {
  var next = 'prev'
    , prev = 'next'
    , length = 0
    , head
    , tail
    , arr
    , n;

  return {
    length: function() { return length; },
    head: function() { return head; },
    tail: function() { return tail; },
    add: function(value) {

      // hacking in splicing a sublist...
      if (!!value.head) {
        const Lhead = value.head();
        tail[next] = Lhead;
        Lhead[prev] = tail;
        tail = value.tail();

        if (!head) head = Lhead;

        length += value.length();
        return;
      }

      n = { v: value };

      if (tail) {
        tail[next] = n;
        n[prev] = tail;
      }

      if (!head) {
        head = n;
      }

      tail = n;
      length += 1;
    },
    remove: function(node) {
      n = node || tail;

      if (length && n) {
        const l = n[prev];
        const r = n[next];

        if (l) {
          l[next] = r;
        } else {
          head = r;
        }

        if (r) {
          r[prev] = l;
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
        n = n[next];
      }
    },
    walkBack: function(cb, start) {
      n = start || tail;
      while (n) {
        cb(n);
        n = n[prev];
      }
    },
    find: function(predicate) {
      n = head;
      if (+predicate < 0) {
        while (n) {
          if (predicate(n)) return n;
          n = n[next];
        }
      } else {
        while (n && predicate--) {
          n = n[next];
        }
      }
      return n;
    }
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