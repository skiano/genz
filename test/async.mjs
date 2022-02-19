import _ from '../src/tag.mjs';
import assert from 'assert';
import { syncStringify } from './_helpers.mjs';

export default [

  async function TEST_RETURNS_PROMISES () {
    const p = Promise.resolve('a');
    const next = _.html(p);
    const f1 = next();
    const f2 = next();
    assert.equal(f2, p, 'Should pass back a promise');
  },

];