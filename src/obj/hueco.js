import k from '../k.js';
import grilla from '../comp/grilla.js';
import { HUECO, MAZO, baraja } from '../datos.js';

export function huecoComp(slot) {
  const cartas = [];
  let top = null;
  return {
    add() {
      const mazo = k.get(MAZO)[0];
      this.push(mazo.sacar());
    },
    slot() {
      return slot;
    },
    push(cardId) {
      cartas.push(cardId);
      top = cardId;
      this.changeSprite(cardId);
    },

    drop(cardId) {
      const carta = baraja[cardId];
      console.log('drop hueco', cardId, carta);
      if (top) {
        const cartaTop = baraja[top];
        console.log('cartaTop', cartaTop);
        if (
          carta.color !== cartaTop.color &&
          carta.valor === cartaTop.valor - 1
        ) {
          this.push(cardId);
          return true;
        }
      } else {
        if (carta.valor === 12) {
          this.push(cardId);
          return true;
        }
      }
      return false;
    },
  };
}

export default function () {
  for (let slot = 0; slot < 7; slot++) {
    k.add([k.sprite(HUECO), grilla(slot, 1), huecoComp(slot), HUECO]);
  }
}
