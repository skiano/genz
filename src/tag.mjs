import { Readable } from 'stream';
import { TAG_NAMES, VOID_ELEMENTS } from "./constants.mjs";

function createTag (name) {
  return function tag () {
    let arg0 = arguments[0];

    const hasAttributes = (
      typeof arg0 === 'object' &&
      arg0 !== null &&
      typeof arg0.then !== 'function'
    );

    let str;
    let done;
    let opening = true;

    let i = hasAttributes ? 1 : 0;
    let queue_a = [arguments];
    let queue_i = [i];
    let child_value;
    let defer;

    function next() {
      if (done) return;

      if (defer) {
        child_value = defer();
        if (typeof child_value === 'undefined') {
          defer = null;
          return next();
        }
        return child_value;
      }

      /////////////////
      // Opening tag //
      /////////////////

      if (opening) {
        str = name === 'html' ? '<!DOCTYPE html' : `<${name}`;
        if (hasAttributes) {
          for (let a in arg0) {
            str += ` ${a}="${arg0[a]}"`
          }
        }
        opening = false;
        return str += '>';
      }

      //////////////////////
      // Process children //
      //////////////////////

      // 1) return end tag if there are no more children
      if (!queue_a.length) {
        done = true;
        return VOID_ELEMENTS[name] ? '/>' : `</${name}>`;
      }

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
          
          // use the child node
          if (child_value.__isNext__) {
            defer = child_value;
            return next();
          }

          // OUPUT A CHILD STRING!
          return typeof child_value === 'number' ? String(child_value) : child_value;
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

    next.__isNext__ = true;
    return next;
  };
}

class TagStream extends Readable {
  #next;
  #chunks;

  constructor (next) {
    super();
    this.#next = next;
  }

  _read(size) {
    let n = this.#next();

    if (n) {
      let s = 0;
      let buffers = [];
      while (n && s < size) {
        n = Buffer.from(n);
        s += n.byteLength;
        buffers.push(n);
        n = this.#next();
      }

      buffers = Buffer.concat(buffers, s);
      this.push(buffers);
    } else {
      this.push();
    }
  }
}

export const _ = TAG_NAMES.reduce((o, name) => {
  o[name] = createTag(name, { isVoid: VOID_ELEMENTS[name] });
  return o;
}, {});

const n = _.html(
  1,
  2,
  [3, 4, 5],
  3,
  _.span({ class: "yes"}, 'yello'),
  4
);

const s = new TagStream(n)

// console.log((s.read(200) || '').toString());

s.pipe(process.stdout);

// let f;
// do {
//   f = n();
//   if (f) console.log(f);
// } while(f);


