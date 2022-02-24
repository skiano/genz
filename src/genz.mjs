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
      typeof a0.on !== 'function' &&
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
}, Object.create(null));

export function traverse (arr, ctx = {}) {
  arr = Array.isArray(arr) ? arr : [arr]; // test this..., and, is it necessary?

  let i;
  let value;
  let queue_a = [arr];
  let queue_i = [0];
  let dedupes = Object.create(null);

  return function next(replaceValue) {
    if (typeof replaceValue !== 'undefined') {
      value = replaceValue;
    } else {
      i = queue_i[0];
      value = queue_a[0][i];
      queue_i[0] = i + 1;

      // execute function with context
      if (typeof value === 'function') value = value(ctx);
    }

    // make sure that undefined/null => false
    value = value ?? false;

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
        if (
          typeof value === 'string' || // pass back string
          typeof value.then === 'function' || // pass back promise for async handling
          typeof value.on === 'function' // pass back readable streams 
        ) {
          return value;
        }

        // otherwise attempt to stringify
        return String(value);

      } else if (queue_i[0] >= queue_a[0].length) {

        // Move shallower
        queue_a.shift();
        queue_i.shift();

        // End the traversal if we cannot go shallower
        if (!(queue_a && queue_a.length)) return;

        // return the shallower value
        return next();
      } else {
        // Skip undefined/null
        return next();
      }
    }
  }
}

export function toString (arr, ctx) {
  const next = traverse(arr, ctx);
  let o;
  let frags = [];
  do {
    o = next();
    frags.push(o);
  } while (o);
  return frags.join('');
}

export function toStream (res, arr, ctx, errorRender) {
  const next = traverse(arr, ctx);

  function handleError (error) {
    res.off('drain', loop);
    res.emit('error', error);

    const errorHtml = toString(errorRender || _.div(
      { id: 'genz-error' },
      _.style(
        css('#genz-error', {
          left: '20px',
          right: '20px',
          bottom: '20px',
          padding: '18px',
          position: 'absolute',
          background: 'rgba(255, 100, 100, 0.5)',
          border: '1px solid red',
        })
      ),
      'Oops! Something went very wrong.'
    ), error);

    if (res.write(errorHtml)) {
      process.nextTick(() => res.destroy());
    } else {
      res.on('drain', () => res.destroy());
    }
  }

  let stream;
  function readStream () {
    stream.on('data', (d) => {
      if (res.write(d)) stream.read();
      else res.on(drain, readStream);
    });
    stream.read();
  }

  async function loop () {
    try {
      let frag = next();

      while (typeof frag !== 'undefined' && res.writable) {  
        if (frag.on) {
          stream = frag;
          stream.on('close', loop);
          return readStream();
        }

        if (frag.then) frag = next(await frag);
        if (res.write(frag)) {
          frag = next();
        } else {
          return; // break the loop and allow a drain...
        }
      }
  
      return res.end(); 
    } catch (error) {
      handleError(error); 
    }
  }

  loop();
  res.on('drain', loop);
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
