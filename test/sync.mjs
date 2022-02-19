import _ from '../genz.mjs';
import assert from 'assert';

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

    function* each(arr) {
      let i;
      for (i = 0; i < arr.length; i++) yield arr[i];
    }

    function* traverse (arr) {
      let queue = [each(arr)];
      while (queue.length) {
        const { value, done } = queue[0].next();

        if (typeof value === 'object' && typeof value.length !== 'undefined') { 
          queue.unshift(each(value))
        } else {
          if (value) yield value;
          if (done) {
            queue.shift();
          }
        }
      }
    }

    const it = traverse(content)

    console.log(it.next().value);
    console.log(it.next().value);
    console.log(it.next().value);
    console.log(it.next().value);
    console.log(it.next().value);
    console.log(it.next().value);
    console.log(it.next().value);
    console.log(it.next().value);
    console.log(it.next().value);
    console.log(it.next().value);
    // console.log(it.next().value);
    // console.log(it.next().value);

  },

];
