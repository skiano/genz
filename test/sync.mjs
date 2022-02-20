import { _, traverse, dedupe } from '../genz.mjs';
import assert from 'assert';

const syncStringify = (it) => {
  let o;
  let frags = [];
  do {
    o = it();
    frags.push(o);
  } while (o);

  return frags.join('');
}

export default [
  function TEST_NESTED_EXAMPLE () {
    
    const content = _.html(
      _.head(
        _.title('Hello World'),
      ),
      _.body(
        _.p('P 1'),
        _.p('P 2'),
      ),
    );

    const txt = syncStringify(traverse(content));

    assert.equal(
      txt,
      '<!DOCTYPE html><html><head><title>Hello World</title></head><body><p>P 1</p><p>P 2</p></body></html>'
    );
  },

  function TEST_DEDUPING () {
    const once = dedupe(_.style('{{ unique }}'), 'component-style');
    const multi = _.style('{{ repeat }}');

    const content = _.body(
      once,
      _.div(
        once,
        multi,
      ),
      multi
    );

    const txt = syncStringify(traverse(content));

    assert.equal(
      txt,
      '<body><style>{{ unique }}</style><div><style>{{ repeat }}</style></div><style>{{ repeat }}</style></body>'
    );
  },

];
