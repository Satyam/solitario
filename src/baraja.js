import k from './k.js';
import {
  palos,
  valores,
  numCartas,
  numPalos,
  numValores,
} from './loadSprites.js';

export const baraja = [];

export const barajar = () => {
  baraja.length = 0;
  while (baraja.length < numCartas) {
    const carta = unaCarta();
    if (!baraja.includes(carta)) baraja.push(carta);
  }
};

export const unaCarta = () => {
  let p = Math.floor(k.rand(0, numPalos));
  let v = Math.floor(k.rand(0, numValores));
  return valores[v] + palos[p];
};
