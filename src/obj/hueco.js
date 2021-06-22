import k from '../k.js';
import grilla from '../comp/grilla.js';
import { HUECO, JUEGO } from '../datos.js';

export function huecoComp(i) {
  const cartas = [];
  return {
    add() {
      this.overlaps(JUEGO, (j) => {
        console.log('overlap', i);
      });
    },
  };
}

export default function () {
  for (let i = 0; i < 7; i++)
    k.add([k.sprite(HUECO), grilla(i, 1), huecoComp(i), HUECO]);
}
