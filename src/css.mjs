export const css = (selectors, rules = {}) => {
  const fragments = [];
  fragments._bytes = 0;
  const append = (frag) => {
    frag = Buffer.from(frag);
    fragments._bytes += frag.length;
    fragments.push(frag);
  };

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
  const fragments = [];
  fragments._bytes = 0;
  const append = (frag) => {
    frag = Buffer.from(frag);
    fragments._bytes += frag.length;
    fragments.push(frag);
  };
  append(`@media ${def} {`);
  rules.forEach(append);
  append('}');
  return fragments;
};
