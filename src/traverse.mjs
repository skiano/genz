function* each(arr) {
  let i;
  for (i = 0; i < arr.length; i++) yield arr[i];
}

export function* traverse (arr) {
  let queue = [each(arr)];
  while (queue.length) {
    const { value, done } = queue[0].next();
    if (Array.isArray(value)) {
      queue.unshift(each(value));
    } else {
      if (value) yield value;
      if (done) {
        queue.shift();
      }
    }
  }
}

const it = traverse([
  1,
  2,
  [3, 4, [5], [6, 7]],
  8,
  [[]],
  9
])

for (let v of it) {
  console.log(v);
}
