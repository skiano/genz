import _ from '../src/tag.mjs';
import assert from 'assert';
import { success, syncStringify } from './_helpers.mjs';

export default [

  () => {
    // TODO: decide if it should be <img> or <img/>?
    assert.equal(syncStringify(_.hr()), '<hr>');
    assert.equal(syncStringify(_.img({ src: '/a.jpg' })), '<img src="/a.jpg">');
    success('Void Elements');
  },

  () => {
    const ret = syncStringify(_.div('Hello ', 'world. ', [], ['I'], [ [' ', 'am here!'] ]));
    assert.equal(ret, '<div>Hello world. I am here!</div>');
    success('Deep Nesting');
  },

];