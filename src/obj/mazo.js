import k from '../k.js';

import grilla from '../comp/grilla.js';

import {
  palos,
  valores,
  numCartas,
  numPalos,
  numValores,
  baraja,
  MAZO,
  VISTA,
  REVERSO,
  HUECO,
} from '../datos.js';

export function mazoComp() {
  let cartas = [];
  return {
    add() {
      this.barajar();
      this.clicks(() => {
        if (cartas.length) {
          this.trigger('popped', this.sacar());
        } else {
          cartas = k.get(VISTA)[0].vuelta();
        }
        this.changeSprite(cartas.length ? REVERSO : HUECO);
      });
    },
    barajar() {
      cartas.length = 0;
      while (cartas.length < numCartas) {
        const carta = this.unaCarta();
        if (!cartas.includes(carta)) {
          cartas.push(carta);
          baraja[carta].donde = MAZO;
          baraja[carta].pos = cartas.length;
        }
      }
    },

    unaCarta() {
      let p = Math.floor(k.rand(0, numPalos));
      let v = Math.floor(k.rand(0, numValores));
      return valores[v] + palos[p];
    },
    sacar() {
      return cartas.pop();
    },
  };
}

export default function () {
  k.add([k.sprite(REVERSO), grilla(0, 0), mazoComp(), MAZO]);
}
