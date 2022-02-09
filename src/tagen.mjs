import util from 'util';
import { Readable } from 'stream';
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

export function* css(selectors, ...declarations) {
  yield (Array.isArray(selectors) ? selectors.join(',') : selectors) + '{';
  let p;
  let declaration;
  for (declaration of traverse(declarations)) {
    for (p in declaration) yield `${p}:${declaration[p]};`;
  }
  yield '}';
}

export function* mediaQuery(media, ...rules) {
  yield `@media ${media} {`;
  let r;
  let rule;
  for (rule of traverse(rules)) {
    for (r of rule) yield r;
  }
  yield '}';
}

export const createTag = (name, options = { isVoid: false }) => {
  const isRecursive = Symbol('isRecursive');

  return function* tag() {
    const topLevel = arguments[0] !== isRecursive;
    if (topLevel) {
      yield name === 'html' ? '<!DOCTYPE><html' : `<${name}`;
    }

    let o;
    let arg;
    let entered = !topLevel;
    let pending;

    for (arg of traverse(arguments)) {
      switch (true) {
        // omit falsy children...
        case !arg || arg === isRecursive:
          break;
        
        /**
         * OK... so this is some insane voodooo
         * to allow promises in SOME components WITHOUT turing everything
         * everywhere into promises
         * The idea is to yield the promise so that the Readable stream
         * can be the one that waits and then passes back the value
         * when that is ready the iterator yields back the final value
         */
        case typeof arg === 'object' && !!arg.then:
          pending = { pending: arg, ret: null };
          yield pending; // let the consumer pause...
          for (o of tag(isRecursive, pending.finished)) yield o;
          break;

        // plain text
        case typeof arg === 'string':
          if (!entered) yield entered = true && '>';
          yield arg; // TODO: do something about very large strings...
          break;

        // coerce numbers to strings
        case typeof arg === 'number':
          if (!entered) yield entered = true && '>';
          yield String(arg);
          break;

        // yield any child nodes
        case util.types.isGeneratorObject(arg):
          if (!entered) yield entered = true && '>';
          for (o of arg) yield o;
          break;

        // yield node attributes
        case (arg && typeof arg === 'object'):
          for (o in arg) yield ` ${o}="${arg[o]}"`;
          if (!entered) yield entered = true && '>';
          break;

        default:
          throw new Error('Invalid tag argument');
      }
    }

    if (topLevel && !entered) yield '>';
    if (topLevel && !options.isVoid) yield `</${name}>`;
  };
};

export class TagStream extends Readable {
  #iterator

  constructor(tag) {
    super();
    this.#iterator = tag;
  }

  _read() {
    let { value, done } = this.#iterator.next();

    if (value && value.pending) {
      value.pending.then((v) => {
        value.finished = v;
        const i = this.#iterator.next();
        if (i.done) this.push(null);
        else this.push(i.value);
      });
    } else {
      if (done) this.push(null);
      else this.push(value);
    }
  }
}

export const $ = TAG_NAMES.reduce((o, name) => {
  o[name] = createTag(name, { isVoid: VOID_ELEMENTS[name] });
  return o;
}, {});

export default $;

// EXAMPLE

// new TagStream(
//   $.div(
//     1,
//     2,
//     Promise.resolve($.p(
//       'yes',
//       Promise.resolve($.strong('shitttt'))
//     )),
//     3
//   )
// ).pipe(process.stdout).on('end', () => {
//   console.log('finished')
// });
