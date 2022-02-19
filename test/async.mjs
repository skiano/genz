import _, { render } from '../src/tag.mjs';
import assert from 'assert';
import { resolve } from 'path';

export default [

  // async function TEST_RETURNS_PROMISES () {
  //   const p = Promise.resolve('a');
  //   const next = _.div(p);
  //   const f1 = next();
  //   const f2 = next();
  //   assert.equal(f1, '<div>', 'Should open');
  //   assert.equal(f2, p, 'Should pass back a promise');
  // },

  async function TEST_PASSING_BACK_RESOLVED_PROMISE () {
    const p = Promise.resolve('a');
    const next = _.div(p);
    const open = next();
    const resolved = await next();
    const child = next(resolved) // pass it back in...
    const close = next();
    assert.equal(open + child + close, '<div>a</div>');
  },

  async function TEST_MANUALLY_PASSING_NESTED_1 () {
    const next = _.div(_.p(Promise.resolve('hi')));

    const div_open = next();
    const p_open = next();
    const p_child_promise = next();
    const p_child = next(await p_child_promise);
    const p_close = next();
    const div_close = next();

    assert.equal(div_open, '<div>');
    assert.equal(p_open, '<p>');
    assert.equal(p_child, 'hi');
    assert.equal(p_close, '</p>');
    assert.equal(div_close, '</div>');
  },

  async function TEST_ASYNC_RENDER_SIMPLE () {
    const next = _.div(Promise.resolve('a'));
    const frags = [];
    const out = await new Promise((resolve) => {
      render(next, (frag) => {
        if (typeof frag === 'undefined') resolve();
        else frags.push(frag);
      });
    });
    assert.equal(frags.join(''), '<div>a</div>');
  },

  async function TEST_ASYNC_RENDER_NESTED_ONCE () {
    const next = _.div(_.p(Promise.resolve('a')));
    const frags = [];
    await new Promise((resolve) => {
      render(next, (frag) => {
        if (typeof frag === 'undefined') resolve();
        else frags.push(frag);
      });
    });
    assert.equal(frags.join(''), '<div><p>a</p></div>');
  },

  async function TEST_ASYNC_RENDER_DEEP () {
    const next = _.div(
      _.p(Promise.resolve('123')),
      Promise.resolve(_.p([
        Promise.resolve('Yay'),
        Promise.resolve(_.strong('!'))
      ]))
    );
    const frags = [];
    await new Promise((resolve) => {
      render(next, (frag) => {
        if (typeof frag === 'undefined') resolve();
        else frags.push(frag);
      });
    });
    assert.equal(frags.join(''), '<div><p>123</p><p>Yay<strong>!</strong></p></div>');
  },

  async function TEST_NEXT_TICK_ON_MAX () {
    const next = _.div('hello');
    const frags = [];
    const promise = new Promise((resolve) => {
      render(next, (frag) => {
        if (typeof frag === 'undefined') resolve();
        else frags.push(frag);
      }, 0);
    });
    frags.push('interrupt');
    process.nextTick(() => {
      frags.push('interrupt');
    });
    await promise;
    assert.deepEqual(frags, [ '<div>', 'interrupt', 'hello', 'interrupt', '</div>' ]);
  },

  async function TEST_NEXT_TICK_ON_MAX_CONFIGURABLE () {
    const next = _.div('hello');
    const frags = [];
    const promise = new Promise((resolve) => {
      render(next, (frag) => {
        if (typeof frag === 'undefined') resolve();
        else frags.push(frag);
      }, 2);
    });
    frags.push('interrupt');
    await promise;
    assert.deepEqual(frags, [ '<div>', 'hello', 'interrupt', '</div>' ]);
  }
];