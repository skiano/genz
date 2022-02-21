import * as genz from '../src/genz.mjs';

export default {
  base: process.env.BASE || '/', // makes the assets work on gh-pages
  build: {
    minify: 'terser',
    terserOptions: {
      mangle: false,
    }
  }
}