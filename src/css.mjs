import { Linked } from './linked.mjs';

export const css = (selectors, rules = {}) => {
  const fragments = new Linked();
  const append = (frag) => fragments.add(Buffer.from(frag));

  selectors = Array.isArray(selectors) ? selectors.join(',') : selectors;
  append(`${selectors} {`);

  for (let r in rules) {
    if (rules.hasOwnProperty(r)) {
      append(`${r}:${rules[r]};`);
    }
  }
  append('}');
  return fragments;
};

export const mediaQuery = (def, rules) => {
  const fragments = new Linked();
  const append = (frag) => fragments.add(Buffer.from(frag));
  append(`@media ${def} {`);
  rules.forEach(r => fragments.add(r));
  append('}');
  return fragments;
};
