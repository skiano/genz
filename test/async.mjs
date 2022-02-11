import _ from '../src/tag.mjs';
import assert from 'assert';
import { stringify } from './_helpers.mjs';

export default [

  async function TEST_PROMISED_NODES () {
    const MyComponent = () => Promise.resolve(_.p('yay'));

    const ret = await stringify(_.main(
      Promise.resolve(_.div(
        MyComponent(),
      ))
    ));

    assert.equal(ret, '<main><div<p>yay</p>></div></main>');
  },

];