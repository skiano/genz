function* each(arr) {
  let i;
  for (i = 0; i < arr.length; i++) yield arr[i];
}

export function* traverse (arr) {
  let queue = [each(arr)];
  let seen = new WeakSet();

  while (queue.length) {
    const { value, done } = queue[0].next();
    if (Array.isArray(value)) {
      let skip;
      if (value.__once__) {
        if (seen.has(value)) skip = true;
        else seen.add(value);
      }
      if (!skip) queue.unshift(each(value))
    } else {
      if (value) yield value;
      if (done) {
        queue.shift();
      }
    }
  }
}

const unique = ['a', 'b', ['c', 'd']];
unique.__once__ = true;

const it = traverse([
  1,
  unique,
  2,
  [3, 4, [5], [6, 7], unique],
  8,
  [[]],
  unique,
  9
])

for (let v of it) {
  console.log(v);
}
