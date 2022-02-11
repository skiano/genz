[
  './basic.mjs',
].forEach(async (p) => {
  const m = await import(p);
  if (!Array.isArray(m.default)) throw new Error(`Suite ${p} invalid`);

  m.default.forEach(async (t) => {
    try {
      await t();
    } catch (e) {
      console.log('');
      console.log(e.stack);
      console.log('');
    }
  });
});