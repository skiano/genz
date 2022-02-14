export const syncStringify = (it) => {

  let o;
  let frags = [];
  do {
    o = it();
    frags.push(o);
  } while (o);

  return frags.join('');
}

