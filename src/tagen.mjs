import util from 'util';
import { VOID_ELEMENTS, TAG_NAMES } from './constants.mjs';

function* each(arr) {
  let i;
  for (i = 0; i < arr.length; i++) yield arr[i];
}

function* traverse (arr) {
  let queue = [each(arr)];
  while (queue.length) {
    const { value, done } = queue[0].next();
    if (Array.isArray(value)) { 
      queue.unshift(each(value))
    } else {
      if (value) yield value;
      if (done) {
        queue.shift();
      }
    }
  }
}

export const createTag = (name, options = { isVoid: false }) => {
  return function* tag() {
    yield name === 'html' ? '<!DOCTYPE><html' : `<${name}`;

    let o;
    let arg;
    let entered;

    for (arg of traverse(arguments)) {
      switch (true) {
        case !arg:
          // omit falsy children...
          break;

        case typeof arg === 'string':
          if (!entered) yield entered = true && '>';
          yield arg;
          break;

        // yield any child nodes
        case util.types.isGeneratorObject(arg):
          if (!entered) yield entered = true && '>';
          for (o of arg) yield o;
          break;
        
        case (arg && typeof arg === 'object'):
          for (o in arg) yield ` ${o}="${arg[o]}"`;
          if (!entered) yield entered = true && '>';
          break;

        default:
          throw new Error('Invalid tag argument');
      }
    }

    if (!entered) yield '>';
    if (!options.isVoid) yield `</${name}>`;
  };
};

export default TAG_NAMES.reduce((o, name) => {
  o[name] = createTag(name, { isVoid: VOID_ELEMENTS[name] });
  return o;
}, {});
