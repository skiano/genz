export const css = (selectors, rules = {}) => {
  selectors = Array.isArray(selectors) ? selectors.join(',') : selectors;
  const fragments = [`${selectors} {`];
  for (let r in rules) {
    if (rules.hasOwnProperty(r)) {
      fragments.push(`${r}:${rules[r]};`);
    }
  }
  fragments.push('}');
  return fragments;
};

export const mediaQuery = (def, rules) => {
  const fragments = [`@media ${def} {`];
  rules.forEach((r) => fragments.push(r));
  return fragments;
};
