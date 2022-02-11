

const each = (arr, i = 0) => {
  const marker = { done: false };
  return function next() {
    marker.value = arr[i++];
    marker.done = i >= arr.length;
    return marker;
  }
}

function traverse (arr, i) {
  const queue = [each(arr, i)];
  
  return function next() {
    if (!queue.length) return;

    const { value, done } = queue[0]();

    if (Array.isArray(value)) { 
      queue.unshift(each(value));
      return next();
    }
    
    else {
      if ((value ?? false) !== false) return value;
      if (done) {
        queue.shift();
        return next();
      }
    }
  }
}

function tag () {
  const hasAttributes = (
    typeof arguments[0] == 'object' &&
    arguments[0] !== null &&
    typeof arguments[0] !== 'function'
  );
  const n = traverse(arguments, hasAttributes ? 1 : 0);
  console.log(n());
  console.log(n());
  console.log(n());
  console.log(n());
  console.log(n());
};

tag(
  1,
  2,
  [3, 4, 5],
  3,
  4
)

