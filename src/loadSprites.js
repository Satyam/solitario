import k from './k.js';

// Cards from https://www.me.uk/cards/makeadeck.cgi
export const palos = 'CDHS';
export const valores = 'A23456789TJQK';

export const numPalos = palos.length;
export const numValores = valores.length;

export const numCartas = numPalos * numValores;

for (let p = 0; p < numPalos; p++) {
  for (let v = 0; v < numValores; v++) {
    const name = valores[v] + palos[p];
    k.loadSprite(name, `cards/${name}.svg`);
  }
}

k.loadSprite('reverso', 'cards/2B.svg');
