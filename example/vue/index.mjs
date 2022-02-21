// this runs in Node.js on the server.
import { createSSRApp } from 'vue'

// Vue's server-rendering API is exposed under `vue/server-renderer`.
import { renderToNodeStream } from 'vue/server-renderer'
import compiled from './template.mjs';

// import { compile } from '@vue/compiler-ssr';


// const out = compile(`
// <html>
//   <head>
//     <title>{{ v2 }}</title>
//   </head>
//   <body>
//     <p :class="v3">{{ v1 }}</p>
//   </body>
//   </html>
// `);


// console.log(out.code);




const app = createSSRApp(compiled)

const str = renderToNodeStream(app);

str.pipe(process.stdout);