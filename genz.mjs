import { TAG_NAMES, VOID_ELEMENTS } from "./constants.mjs";

let MAX_SYNC = 400;
export const setChunkThreshold = (n) => MAX_SYNC = n;

function createTag (name) {
  return function tag () {
    let arg0 = arguments[0];

    const hasAttributes = ( // TODO: how can i simplify this check?
      typeof arg0 === 'object' &&
      arg0 !== null &&
      !Array.isArray(arg0) &&
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

    function next(resolvedChild) {
      if (done) return;

      ////////////////////////
      // SUPPORT CHILD TAGS //
      ////////////////////////

      if (defer) {
        child_value = defer(resolvedChild);
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
        str = name === 'html' ? '<!DOCTYPE html><html' : `<${name}`;
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
        return VOID_ELEMENTS[name] ? '' : `</${name}>`;
      }

      // 2) get current child
      if (typeof resolvedChild !== 'undefined') {
        child_value = resolvedChild;
      } else {
        i = queue_i[0];
        child_value = queue_a[0][i];
        queue_i[0] = i + 1; 
      }  
  
      // 3) if the child is an array, move deeper and search there
      if (Array.isArray(child_value)) { 
        queue_a.unshift(child_value);
        queue_i.unshift(0);
        return next();
      } else {
        // 4) if the child has a value, return it
        if ((child_value ?? false) !== false) {
          // pass back any promises...
          if (child_value.then) { // TODO: add tests for weird promise-looking things...
            return child_value;
          }
          
          // use the child node
          if (child_value.__isNext__) {
            defer = child_value;
            return next();
          }

          // OUPUT A CHILD STRING!!!!!!
          return typeof child_value === 'number'
            ? String(child_value)
            : child_value;

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

export default TAG_NAMES.reduce((o, name) => {
  o[name] = createTag(name, { isVoid: VOID_ELEMENTS[name] });
  return o;
}, {});

export const render = (next, onFragment) => {
  const loop = async (i) => {
    let frag = next();

    if ((frag ?? false) !== false) {
      // if the fragment is promised, pause to get the result...
      // TODO: test edges...
      if (frag.then) {
        frag = next(await frag); // TODO: handle the error in some way...
        onFragment(frag);
        loop(0);
      } else {
        onFragment(frag);
        if (i >= MAX_SYNC) {
          process.nextTick(loop, 0);
        } else {
          loop(i + 1);
        }
      }
    } else {
      onFragment();
    }
  }
  // start the loop
  loop(1);
}

export function reqRes (next, res, req) {
  // TODO: handle weird events (like aborts) in req or res

  const loop = async (i = 1) => {
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
