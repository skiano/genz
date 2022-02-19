import _ from '../src/tag.mjs';
import assert from 'assert';

export default [

  async function TEST_RETURNS_PROMISES () {
    const p = Promise.resolve('a');
    const next = _.div(p);
    const f1 = next();
    const f2 = next();
    assert.equal(f1, '<div>', 'Should open');
    assert.equal(f2, p, 'Should pass back a promise');
  },

  async function TEST_PASSING_BACK_RESOLVED_PROMISE () {
    const p = Promise.resolve('a');
    const next = _.div(p);
    const open = next();
    const resolved = await next();
    const child = next(resolved) // pass it back in...
    const close = next();
    assert.equal(open + child + close, '<div>a</div>', 'Should replace child with whatever is passed to next');
  },

];