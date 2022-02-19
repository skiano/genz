import { TAG_NAMES, VOID_ELEMENTS } from "./constants.mjs";

function createTag (name) {
  return function tag (a0) {
    a0 = a0 ?? false; // coerce null/undefined to false...
    let a;
    let attr;
    if (
      typeof a0 === 'object' && 
      typeof a0.then !== 'function' && 
      !Array.isArray(a0)
    ) {
      for (a in a0) {
        if (!attr) attr = [];
        attr.push(` ${a}="${a0[a]}"`);
        attr.push('>')
      }
      arguments[0] = attr;
      return VOID_ELEMENTS[name]
        ? [`<${name}`, attr]
        : [`<${name}`, arguments, `</${name}>`];
    }
    
    return VOID_ELEMENTS[name]
      ? [`<${name}`, attr, '>']
      : [`<${name}`, arguments, `</${name}>`];
  };
}

export default TAG_NAMES.reduce((o, name) => {
  o[name] = createTag(name, { isVoid: VOID_ELEMENTS[name] });
  return o;
}, {});

