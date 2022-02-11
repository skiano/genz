import { TAG_NAMES, VOID_ELEMENTS } from "./constants.mjs";

function traverse (arr, i = 0) {
  let value;
  const queue_a = [arr];
  const queue_i = [i];
  
  return function next() {
    if (!queue_a.length) return;

    i = queue_i[0];

    value = queue_a[0][i];
    queue_i[0] = i + 1;

    if (Array.isArray(value)) { 
      queue_a.unshift(value);
      queue_i.unshift(0);
      return next();
    } else {
      if ((value ?? false) !== false) {
        return value;
      } else if (queue_i[0] >= queue_a[0].length) {
        queue_a.shift();
        queue_i.shift();
        return next();
      } else {
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

      str = children(); // i should be able to pause the stream in a similar way for promises...
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


// const n = traverse([
//   [],
//   false,
//   1,
//   [11, [12, 13], 14, undefined, []],
//   2,
//   3
// ]);

// for (let i = 0; i <= 12; i++) {
//   console.log(n())
// }


