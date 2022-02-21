import fs from 'fs';
import url from 'url';
import puppeteer from 'puppeteer';

const SAMPLE = process.env.URL || 'https://www.ft.com/';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(SAMPLE);

  page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

  const codeVersion = await page.evaluate(() => {
    // traversal Inspired by
    // https://javascript.plainenglish.io/walking-the-dom-7a1123fb67da

    const tree = (function visit_nodes_recursive(node = document.documentElement, parent) {
      let vn;
      const tagName = node.tagName;

      if (!tagName) {
        if (node.nodeValue.trim()) {
          vn = node.nodeValue;
        }
      } else {
        vn = {
          tag: tagName.toLowerCase(),
          children: [],
          attributes: {},
          // @see: https://stackoverflow.com/questions/27786815/how-can-i-test-if-an-element-is-self-enclosed-in-javascript?noredirect=1&lq=1
          isVoid: document.createElement(tagName).outerHTML.indexOf( "><" ) === -1
        };
      }

      for (let a in node.attributes) {
        if (node.attributes.hasOwnProperty(a)) {
          let attr = node.attributes[a];
          if (attr.name === 'href' || attr.name === 'src'){
            vn.attributes[attr.name] = node[attr.name];
          } else {
            vn.attributes[attr.name] = attr.value;
          }
        }
      }

      if (node.firstChild) {
        if (tagName.toLocaleLowerCase() === 'svg') {
          vn.children.push(node.innerHTML);
        } else {
          visit_nodes_recursive(node.firstChild, vn);
        }
      }

      if (node.nextSibling) visit_nodes_recursive(node.nextSibling, parent);
      if (vn && parent) parent.children.unshift(vn);
      return vn;
    })();

    function toGenzCode (n, d = 0) {
      const TAB = '  ';
      const indent = TAB.repeat(d);

      if (typeof n === 'string') {
        return `\`${
          // hacky but could not get a good one-line regex...
          n.trim().replace(/\\/g, `\\\\`)   // 1. replace \ with \\
           .replace(/`/g, '\\`')     // 2. replace ` with \`
           .replace(/\\\\`/g, `\\`) // 3. replace \\" with \"
        }\``;
      }

      const args = [];

      if (Object.keys(n.attributes).length) {
        args.push(indent + TAB + JSON.stringify(n.attributes))
      }

      n.children.forEach((c) => {
        args.push(toGenzCode(c, d + 1))
      });

      return args.length > 1
        ? `${indent}_.${n.tag}(\n${args.join(`,\n`)}\n${indent})`
        : `${indent}_.${n.tag}(${args.join(',').trim()})`;
    }

    return toGenzCode(tree);
  });

  fs.writeFileSync('perf/fixture.mjs', `import { _ } from '../genz.mjs'\n\nexport default () => ${codeVersion}`);
  console.log('created file');

  await browser.close();
})();