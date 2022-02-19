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

    // function* each(arr) {
    //   let i;
    //   for (i = 0; i < arr.length; i++) yield arr[i];
    // }

    // function* traverse (arr) {
    //   let queue = [each(arr)];
    //   while (queue.length) {
    //     const { value, done } = queue[0].next();

    //     if (typeof value === 'object' && typeof value.length !== 'undefined') { 
    //       queue.unshift(each(value))
    //     } else {
    //       if (value) yield value;
    //       if (done) {
    //         queue.shift();
    //       }
    //     }
    //   }
    // }

    const traverse = (arr) => {
      const queue_a = [arr];
      const queue_i = [0];

      let i;
      let value;
      return function next() {
        i = queue_i[0];
        value = queue_a[0][i];
        queue_i[0] = i + 1;

        if (typeof value === 'object' && typeof value.length !== 'undefined') { 
          queue_a.unshift(value);
          queue_i.unshift(0);
          return next();
        } else {
          if ((value ?? false) !== false) {

            // pass back any promises...
            if (value.then) { // TODO: add tests for weird promise-looking things...
              return value;
            }

            // OUPUT A CHILD STRING!!!!!!
            return typeof value === 'string'
              ? value
              : String(value);

          } else if (queue_i[0] >= queue_a[0].length) {
            queue_a.shift();
            queue_i.shift();
            return next();
          } else {
            return next();
          }
        }

      }
    }

    const next = traverse(content)

    console.log(next());
    console.log(next());
    console.log(next());
    console.log(next());
    console.log(next());
    console.log(next());
    console.log(next());
    console.log(next());
    console.log(next());
    console.log(next());
    console.log(next());

  },

];
