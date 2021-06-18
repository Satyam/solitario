import k from '../k.js';
import {
  palos,
  valores,
  numCartas,
  numPalos,
  numValores,
} from '../loadSprites.js';

import grilla from '../comp/grilla.js';

import { cartas, MAZO, VISTA, REVERSO, HUECO } from '../datos.js';

export function mazoComp() {
  let baraja = [];
  return {
    add() {
      this.barajar();
      this.clicks(() => {
        if (baraja.length) {
          this.trigger('popped', this.sacar());
        } else {
          baraja = k.get(VISTA)[0].vuelta();
        }
        this.changeSprite(baraja.length ? REVERSO : HUECO);
      });
    },
    barajar() {
      baraja.length = 0;
      while (baraja.length < numCartas) {
        const carta = this.unaCarta();
        if (!baraja.includes(carta)) {
          baraja.push(carta);
          cartas[carta].donde = MAZO;
          cartas[carta].pos = baraja.length;
        }
      }
    },

    unaCarta() {
      let p = Math.floor(k.rand(0, numPalos));
      let v = Math.floor(k.rand(0, numValores));
      return valores[v] + palos[p];
    },
    sacar() {
      return baraja.pop();
    },
  };
}

export default function () {
  k.add([k.sprite(REVERSO), grilla(0, 0), mazoComp(), MAZO]);
}
