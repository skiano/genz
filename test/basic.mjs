import _ from '../src/tag.mjs';
import assert from 'assert';
import { success, stringify } from './_helpers.mjs';

export default [
  
  async () => {
    // TODO: address this
    // const ret = await stringify(_.img());
    // assert.equal(ret, '<img/>');
    // success('Handles void elements');
  },

  async () => {
    const ret = await stringify(_.div('Hello ', 'world. ', [], ['I'], [ [' ', 'am here!'] ]));
    assert.equal(ret, '<div>Hello world. I am here!</div>');
    success('Handles deep nesting');
  },

];