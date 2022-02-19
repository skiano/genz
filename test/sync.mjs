import { _, traverse } from '../genz.mjs';
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

  function TEST_DOC_TYPE () {
    
    const content = _.html(
      _.header(
        _.nav(
          _.a({ href: '/' }, 'home'),
          _.a({ href: '/about' }, 'about'),
        )
      ),
      _.main(
        _.section(
          _.p('Paragraph 1'),
          _.p('Paragraph 2'),
        )
      ),
      _.ul([
        _.li('List item 1'),
        _.li('List item 2'),
      ])
    );

    const txt = syncStringify(traverse(content));

    console.log(txt);
  },

];
