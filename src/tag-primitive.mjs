import { TAG_NAMES, VOID_ELEMENTS } from "./constants.mjs";

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
    } else {
      if ((value ?? false) !== false) return value;
      if (done) {
        queue.shift();
        return next();
      }
    }
  }
}

function createTag (name) {
  return function tag () {
    const hasAttributes = (
      typeof arguments[0] == 'object' &&
      arguments[0] !== null &&
      typeof arguments[0] !== 'function'
    );

    let str;
    let opening = true;
    let children = traverse(arguments, hasAttributes ? 1 : 0);

    return function next() {
      if (opening) {
        str = name = 'html' ? `<${name}` : `<${name}`;
        if (hasAttributes) {
          for (let a in arguments[0]) {
            str += ` ${a}="${arguments[0][a]}"`
          }
        }
        opening = false;
        return str += '>';
      }
      str = children();
      if (typeof str === 'undefined') {
        str = VOID_ELEMENTS[name] ? '/>' : `</${name}>`;
      }
      return str;
    }
  };
}

export const _ = TAG_NAMES.reduce((o, name) => {
  o[name] = createTag(name, { isVoid: VOID_ELEMENTS[name] });
  return o;
}, {});


const n = _.div(
  1,
  2,
  [3, 4, 5],
  3,
  4
);

console.log(n())
console.log(n())
console.log(n())

