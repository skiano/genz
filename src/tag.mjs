import fs from 'fs';
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

export const inlineFile = (f) => {
  return fs.createReadStream(f);
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

    // TODO:
    // Should I yield the entire opening tag and closing tag at once
    // to reduce tiny yields??? What/how would I measure to inform that decision?

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
         * when that is ready the iterator yields back the final value...
         * ****
         * I tried doing this more idiomatically by having an empty yield to pause..
         * but so far no luck
         */
        case typeof arg === 'object' && !!arg.then:
          pending = { pending: arg, ret: null };
          yield pending; // let the consumer pause...
          for (o of tag(isRecursive, pending.finished)) yield o;
          break;

        /**
         * Support readable streams (ie. files)
         */
         case arg instanceof Readable:
          if (!entered) yield entered = true && '>';
          yield arg; // let the consumer pause... and resume after finished
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

class TagStream extends Readable {
  #iterator
  #reading

  constructor(tag) {
    super();
    this.#iterator = tag;
  }

  _tap(length) {
    if (length < this.#reading.readableLength) {
      this.push(this.#reading.read(length));
    } else {
      this.push(this.#reading.read(this.#reading.readableLength));
      this.#reading.close(); // This may not close the stream.
      // Artificially marking end-of-stream, as if the underlying resource had
      // indicated end-of-file by itself, allows the stream to close.
      // This does not cancel pending read operations, and if there is such an
      // operation, the process may still not be able to exit successfully
      // until it finishes. (https://nodejs.org/api/fs.html#filehandlecreatereadstreamoptions)
      // TODO: not sure if this is totally needed
      this.#reading.push(null);
      this.#reading.read(0);
      this.#reading = null;
      const i = this.#iterator.next();
      if (i.done) this.push(null);
      else this.push(i.value);
    }
  }

  _read(length) {
    if (this.#reading) return this._tap(length);

    let { value, done } = this.#iterator.next();

    if (value instanceof Readable) {
      this.#reading = value;
      value.once('readable', () => { this._tap(length); });
    } else if (value && value.pending) {
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

export const tagStream = (o) => {
  return o instanceof Readable ? o : new TagStream(o);
}

export const _ = TAG_NAMES.reduce((o, name) => {
  o[name] = createTag(name, { isVoid: VOID_ELEMENTS[name] });
  return o;
}, {});

export default _;
