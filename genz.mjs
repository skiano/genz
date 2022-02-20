import { TAG_NAMES, VOID_ELEMENTS } from "./constants.mjs";

export function createTag (name) {
  return function tag (a0) {
    // 1. If attibutes are passed
    let a;
    let attr;
    if (
      a0 &&
      typeof a0 === 'object' &&
      typeof a0.then !== 'function' && 
      !Array.isArray(a0)
    ) {
      for (a in a0) {
        if (!attr) attr = [];
        attr.push(` ${a}="${a0[a]}"`);
        attr.push('>')
      }
      arguments[0] = attr;
      return VOID_ELEMENTS[name]
        ? [`<${name}`, attr]
        : [name === 'html' ? '<!DOCTYPE html><html' : `<${name}`, arguments, `</${name}>`];
    }

    // 2. If attributes are omitted
    return VOID_ELEMENTS[name]
      ? `<${name}>`
      : [name === 'html' ? '<!DOCTYPE html><html>' : `<${name}>`, arguments, `</${name}>`];
  };
}

export const _ = TAG_NAMES.reduce((o, name) => {
  o[name] = createTag(name, { isVoid: VOID_ELEMENTS[name] });
  return o;
}, {});

export function traverse (arr, ctx = {}) {
  arr = Array.isArray(arr) ? arr : [arr]; // test this..., and, is it necessary?

  let i;
  let value;
  let queue_a = [arr];
  let queue_i = [0];
  let dedupes = {};

  return function next(replaceValue) {
    if (arguments.length) {
      value = replaceValue;
    } else {
      i = queue_i[0];
      value = queue_a[0][i] ?? false; // make sure that undefined/null => false
      queue_i[0] = i + 1;

      if (typeof value === 'function') value = value(ctx);
    }

    if (typeof value === 'object' && typeof value.length !== 'undefined') {
      // skip if we dedupe
      if (value._DEDUPE_) {
        if (dedupes[value._DEDUPE_]) return next();
        dedupes[value._DEDUPE_] = true;
      }
      
      // Move deeper
      queue_a.unshift(value);
      queue_i.unshift(0);
      return next();
    } else {
      if (value !== false) {
        // Pass back any promises
        // with the expectation that the resolved value
        // will be replaced with next
        if (value.then) return value;

        // return a child string
        return typeof value === 'string' ? value : String(value);

      } else if (queue_i[0] >= queue_a[0].length) {

        // Move shallower
        queue_a.shift();
        queue_i.shift();

        // End the traversal
        if (!(queue_a && queue_a.length)) {
          value = undefined
          queue_a = undefined;
          queue_i = undefined;
          dedupes = undefined;
          return;
        }

        return next();
      } else {
        // Skip undefined/null
        return next();
      }
    }
  }
}

export function toStream (arr, res) {

  // TODO: handle weird events (like aborts) in req or res
  // TODO: decide what if anything to do with this max sync...
  const MAX_SYNC = 5000;
  const next = traverse(arr);

  async function loop (i = 1) {
    let frag = next();
    let open;

    if ((frag ?? false) !== false) {
      if (frag.then) {
        frag = next(await frag); // TODO: handle the error in some way...
        open = res.write(frag);
        if (open) loop(0);
        else res.once('drain', loop);
      } else {
        open = res.write(frag);
        if (!open) res.once('drain', loop);
        else if (i >= MAX_SYNC) process.nextTick(loop);
        else loop(i + 1);
      }
    } else {
      res.end();
    }
  }

  loop(); // start the loop
}

////////////
// EXTRAS //
////////////

export const dedupe = (v, id) => {
  v._DEDUPE_ = id;
  return v;
};

export const css = (selectors, declarations) => {
  // Array.isArray()
};
