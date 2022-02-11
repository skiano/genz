import _ from '../src/tag.mjs';
import assert from 'assert';
import { success, stringify } from './_helpers.mjs';

export default [
  
  async () => {
    const ret = await stringify(_.img());
    assert.equal(ret, '<img>'); // TODO: decide if it should be <img/>
    success('Void Elements');
  },

  async () => {
    const ret = await stringify(_.div('Hello ', 'world. ', [], ['I'], [ [' ', 'am here!'] ]));
    assert.equal(ret, '<div>Hello world. I am here!</div>');
    success('Deep Nesting');
  },

  () => {
    const it = _.div(_.p('hello ', _.span('yes')));
    const a = [];
    for (let c of it) a.push(c);
    assert.equal(a.join(''), '<div><p>hello <span>yes</span></p></div>');
    success('Avoid Unnessesary Promises');
  },

];