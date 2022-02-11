console.log('???')

console.log(_XT)

const init = (node) => {
  setInterval(() => {
    node.style.visibility = node.style.visibility === 'visible' ? 'hidden' : 'visible';
  }, 200);
}

_XT.forEach(init);
_XT.push = init;
