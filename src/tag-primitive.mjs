import { TAG_NAMES, VOID_ELEMENTS } from "./constants.mjs";

function createTag (name) {
  return function tag () {
    const hasAttributes = (
      typeof arguments[0] == 'object' &&
      arguments[0] !== null &&
      typeof arguments[0] !== 'function'
    );

    let str;
    let opening = true;

    let i = hasAttributes ? 1 : 0;
    let queue_a = [arguments];
    let queue_i = [i];
    let child_value;

    return function next() {
      /**
       * Create the opening tag
       */
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

      /**
       * Process children
       */

      // 1) return end tag if there are no more children
      if (!queue_a.length) return VOID_ELEMENTS[name] ? '/>' : `</${name}>`;

      // 2) get current child
      i = queue_i[0];
      child_value = queue_a[0][i];
      queue_i[0] = i + 1;
  
      // 3) if the child is an array, move deeper and search there
      if (Array.isArray(child_value)) { 
        queue_a.unshift(child_value);
        queue_i.unshift(0);
        return next();
      } else {
        // 4) if the child has a value, return it
        if ((child_value ?? false) !== false) {
          return child_value;
        } else if (queue_i[0] >= queue_a[0].length) {
          // 5) if there is nothing left in this array, move shallower
          queue_a.shift();
          queue_i.shift();
          return next();
        } else {
          // 6) if the value is false, null, or undefined, skip it
          return next();
        }
      }
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


