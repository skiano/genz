import _ from '../genz.mjs';
import assert from 'assert';

export default [

  function TEST_DOC_TYPE () {
    
    const content = _.html({ class: "abc" })

    console.log(content);

  },

];
