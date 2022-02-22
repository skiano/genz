import fs from 'fs';
import url from 'url';
import puppeteer from 'puppeteer';

const SAMPLE = process.env.URL || 'https://www.ft.com/';

console.log(`Attemptiong ${SAMPLE}`);

(async () => {
  const browser = await puppeteer.launch();

  console.log(`- Puppeteer is launched`);

  const page = await browser.newPage();

  console.log(`- Browser page created`);

  await page.goto(SAMPLE);

  page.on('console', (msg) => console.log('  >', msg.text()));

  console.log(`- Navigated to page`);

  const codeVersion = await page.evaluate(() => {
    // traversal Inspired by
    // https://javascript.plainenglish.io/walking-the-dom-7a1123fb67da

    let totalNodes = 0;
    let maxDepth = 0;

    const tree = (function visit_nodes_recursive(node = document.documentElement, parent, depth = 0) {
      totalNodes++;
      if (depth > maxDepth) maxDepth = depth;

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
          visit_nodes_recursive(node.firstChild, vn, depth + 1);
        }
      }

      if (node.nextSibling) visit_nodes_recursive(node.nextSibling, parent, depth + 1);
      if (vn && parent) parent.children.unshift(vn);
      return vn;
    })();

    console.log(`TOTAL NODES: ${totalNodes}`);
    console.log(`MAX DEPTH: ${maxDepth}`);

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

  console.log(`- Generated genz code`);

  fs.writeFileSync('perf/fixture.mjs', `import { _ } from '../src/genz.mjs'\n\nexport default () => ${codeVersion}`);
  
  console.log('- Wrote fixture');

  await browser.close();
})();