import { TAG_NAMES, VOID_ELEMENTS } from "./constants.mjs";

// from https://www.npmjs.com/package/kebab-case
const KEBAB_REGEX = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g;
const replacer = match => '-' + match.toLowerCase();
const kebabCase = str => str.replace(KEBAB_REGEX, replacer);

export function createTag (name, isVoid, opener) {
  opener = name === 'html' ? '<!DOCTYPE html><html': `<${name}`;

  return function tag (a0) {
    arguments.__IS_ARGUMENTS__ = true;

    // 1. If attibutes are passed
    if (
      a0 &&
      !a0.__IS_ARGUMENTS__ &&
      typeof a0 === 'object' &&
      typeof a0.then !== 'function' &&
      !Array.isArray(a0)
    ) {
      let a;
      let str = '';
      for (a in a0) str += ` ${a}="${a0[a]}"`;
      str += '>';
      arguments[0] = str;

      if (isVoid) {
        arguments[-1] = opener;
      } else {
        arguments[-1] = opener;
        arguments[arguments.length] = `</${name}>`;
        arguments.length += 1;
      }

      return arguments;
    }

    // 1. If no attibutes are passed
    if (isVoid) {
      return `<${name}>`;
    } else {
      arguments[-1] = opener + '>';
      arguments[arguments.length] = `</${name}>`;
      arguments.length += 1;
      return arguments;
    }
  };
}

export const _ = TAG_NAMES.reduce((o, name) => {
  o[name] = createTag(name, VOID_ELEMENTS[name]);
  return o;
}, Object.create({}));

export function traverse (arr, ctx = {}) {
  arr = Array.isArray(arr) ? arr : [arr]; // test this..., and, is it necessary?

  let i;
  let value;
  let queue_a = [arr];
  let queue_i = [0];
  let dedupes = Object.create(null);

  return function next(replaceValue) {
    if (arguments.length) {
      value = replaceValue;
    } else {
      i = queue_i[0];
      value = queue_a[0][i] ?? false; // make sure that undefined/null => false
      queue_i[0] = i + 1;

      if (typeof value === 'function') value = value(ctx); // todo: error handling?
    }

    if (typeof value === 'object' && typeof value.length !== 'undefined') {
      // skip if we dedupe
      if (value.__DEDUPE__) {
        if (dedupes[value.__DEDUPE__]) return next();
        dedupes[value.__DEDUPE__] = true;
      }
      
      // Move deeper
      queue_a.unshift(value);
      queue_i.unshift(value.__IS_ARGUMENTS__ ? -1 : 0);
      return next();
    } else {
      if (value !== false) {
        // Pass back any promises
        // with the expectation that the resolved value
        // will be replaced with next
        if (value.then) return value;

        // return a child string
        return typeof value === 'string'
          ? value
          : String(value);
      } else if (queue_i[0] >= queue_a[0].length) {

        // Move shallower
        queue_a.shift();
        queue_i.shift();

        // End the traversal
        if (!(queue_a && queue_a.length)) {
          arr = null;
          value = null;
          queue_a = null;
          queue_i = null;
          dedupes = null;
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

export function toStream (res, arr, ctx) {
  // TODO: handle weird events (like aborts) in req or res
  // TODO: decide what if anything to do with this max sync...
  const next = traverse(arr, ctx);

  async function loop () {
    let frag = next();

    while (typeof frag !== 'undefined') {
      if (frag.then) frag = next(await frag);
      // is it ok to just bumbard with a bunch of tiny writes?
      // or should they be ganged up somehow
      if (res.write(frag)) {
        frag = next();
      } else {
        return; // break the loop and allow a drain...
      }
    }

    return res.end();
  }

  loop(); // start the loop
  res.on('drain', loop);
  res.on('end', () => { arr = null; });
}

////////////
// EXTRAS //
////////////

export function dedupe(v, id) {
  v.__DEDUPE__ = id;
  return v;
};

export function css(chunks, a, arg, d) {
  chunks = [];
  for (a = 0; a < arguments.length; a++) {
    arg = arguments[a];
    if (a === 0) {
      chunks.push(`${Array.isArray(arg) ? arg.join(',') : arg}{`);
    } else {
      for (d in arg) {
        chunks.push(`${kebabCase(d)}:${arg[d]};`);
      }
    }
  };
  chunks.push('}');
  return chunks;
};

export function mediaQuery(chunks, a, arg) {
  chunks = [];
  for (a = 0; a < arguments.length; a++) {
    arg = arguments[a];
    if (a === 0) {
      chunks.push(`@media ${arg} {`);
    } else {
      chunks.push(arg);
    }
  };
  chunks.push('}');
  return chunks;
}
