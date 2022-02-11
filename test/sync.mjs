import _ from '../src/tag.mjs';
import assert from 'assert';
import { syncStringify } from './_helpers.mjs';

export default [

  function TEST_DOC_TYPE () {
    const ret = syncStringify(_.div('Hello ', 'world. ', [], ['I'], [ [' ', 'am here!'] ]));
    assert.equal(ret, '<div>Hello world. I am here!</div>');
  },

  function TEST_VOID_ELEMENTS () {
    // TODO: decide if it should be <img> or <img/>?
    assert.equal(syncStringify(_.hr()), '<hr>');
    assert.equal(syncStringify(_.img({ src: '/a.jpg' })), '<img src="/a.jpg">');
  },

  function TEST_DEEP_NESTING () {
    const ret = syncStringify(_.div('Hello ', 'world. ', [], ['I'], [ [' ', 'am here!'] ]));
    assert.equal(ret, '<div>Hello world. I am here!</div>');
  },

  function TEST_NUMBERS () {
    const ret = syncStringify(_.main(12, _.em(3)));
    assert.equal(ret, '<main>12<em>3</em></main>');
  },

];