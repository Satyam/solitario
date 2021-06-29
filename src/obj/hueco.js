import k from '../k.js';
import grilla from '../comp/grilla.js';
import { HUECO } from '../datos.js';

export function huecoComp(slot) {
  const cartas = [];
  return {
    slot() {
      return slot;
    },
  };
}

export default function () {
  for (let slot = 0; slot < 7; slot++) {
    k.add([k.sprite(HUECO), grilla(slot, 1), huecoComp(slot), HUECO]);
  }
}
