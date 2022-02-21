import './style.css';

import dedent from 'ts-dedent';
import { _, css, traverse, toStream } from '../src/genz.mjs';
import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup"
import { ViewPlugin } from '@codemirror/view';
import { javascript } from "@codemirror/lang-javascript"

const editor = document.getElementById('editor');
const errors = document.getElementById('errors');
const preview = document.getElementById('preview');

const initial = dedent(`
_.html(
  _.head(
    _.title('Basic Example'),
    _.style(css('body', {
      backgroundColor: 'yellow'
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
  } catch (e) {
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
