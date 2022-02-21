import './style.css';

// THE UNUSED IMPORTS MAY BE USED BY eval()
import * as genz from '../src/genz.mjs';
const { _, css, traverse, mediaQuery, dedupe, toStream } = genz;
console.log({ _, css, traverse, mediaQuery, dedupe, toStream });
// SO DO NOT REMOVE THEM...

import dedent from 'ts-dedent';
import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup"
import { ViewPlugin } from '@codemirror/view';
import { javascript } from "@codemirror/lang-javascript"

const editor = document.getElementById('editor');
const errors = document.getElementById('errors');
const preview = document.getElementById('preview');

let initial;
try {
  if (window.location.hash.length > 1) {
    initial = window.atob(window.location.hash.slice(1));
  }
} catch (e) {}

initial = initial || dedent(`
_.html(
  _.head(
    _.title('Basic Example'),
    _.style(css('body', {
      backgroundColor: 'limegreen'
    }))
  ),
  _.body(
    _.h1('Hello World'),
    _.p('This is a basic example.')
  )
)
`);

// var html_string= "content";
// document.getElementById('output_iframe1').src = "data:text/html;charset=utf-8," + escape(html_string);

const updatePreview = async (txt) => {
  let output = '';

  try {
    const tree = eval(txt);

    const html = await new Promise((resolve, reject) => {
      const chunks = [];
      const streamish = {
        write(c) {
          chunks.push(c)
          return true;
        },
        end() {
          resolve(chunks.join(''));
        },
        on() {}
      }
      toStream(streamish, tree);

      errors.classList.remove('show');
    });

    preview.src = `data:text/html;charset=utf-8,${window.escape(html)}`;
    window.location.hash = btoa(txt);
  } catch (e) {
    window.location.hash = '';
    errors.classList.add('show');
    errors.innerText = e.message;
  }
};

updatePreview(initial);

new EditorView({
  parent: editor,
  state: EditorState.create({
    doc: initial,
    extensions: [
      basicSetup,
      javascript(),
      ViewPlugin.fromClass(class {
        constructor(view) {}
        update(update) {
          if (update.docChanged) {
            updatePreview(update.state.doc.toString());
          }
        }
      }),
    ]
  }),
});
