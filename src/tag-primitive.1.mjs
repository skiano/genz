

const each = (arr, i = 0) => {
  const marker = { done: false };
  return function next() {
    marker.value = arr[i++];
    marker.done = i >= arr.length;
    return marker;
  }
}

function traverse (arr, cb, i) {
  const queue = [each(arr, i)];
  
  while (queue.length) {
    const { value, done } = queue[0]();
    if (Array.isArray(value)) { 
      queue.unshift(each(value))
    } else {
      if ((value ?? false) !== false) cb(value);
      if (done) {
        queue.shift();
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
  traverse(arguments, (arg) => {
    console.log(arg);
  }, hasAttributes ? 1 : 0);
};

