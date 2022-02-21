import * as genz from '../src/genz.mjs';

export default {
  base: '', // makes the assets work on gh-pages
  build: {
    minify: 'terser',
    terserOptions: {
      mangle: false,
    }
  }
}