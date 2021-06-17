import k from './k.js';
import { cartas, ROJO, NEGRO, HUECO, REVERSO } from './datos.js';

// Cards from https://www.me.uk/cards/makeadeck.cgi
export const palos = 'CDHS';
export const valores = 'A23456789TJQK';

export const numPalos = palos.length;
export const numValores = valores.length;

export const numCartas = numPalos * numValores;

for (let p = 0; p < numPalos; p++) {
  for (let v = 0; v < numValores; v++) {
    const palo = palos[p];
    const name = valores[v] + palo;
    k.loadSprite(name, `cards/${name}.svg`);
    cartas[name] = {
      name,
      palo,
      valor: v,
      color: palo === 'D' || palo === 'H' ? ROJO : NEGRO,
    };
  }
}

k.loadSprite(REVERSO, 'cards/2B.svg');
k.loadSprite(HUECO, 'src/hueco.svg');
