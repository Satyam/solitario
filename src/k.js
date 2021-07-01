import kaboom from '../public/kaboom.mjs';

const k = kaboom({
  scale: 1 / 2,
  fullscreen: true,
  clearColor: [0, 0.7, 0, 1],
  debug: true,
});

k.getFirst = (tag) => k.get(tag)[0];
export default k;
