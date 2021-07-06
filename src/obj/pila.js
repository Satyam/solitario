import k from '../k.js';
import grilla from '../comp/grilla.js';
import { HUECO, PILA, baraja } from '../datos.js';

export function pilaComp(slot) {
  const cartas = [];
  let top = null;

  return {
    slot() {
      return slot;
    },
    push(cardId) {
      console.log('push into pila', slot, cardId);
      cartas.push(cardId);
      top = cardId;
      this.changeSprite(cardId);
    },

    drop(cardId) {
      const carta = baraja[cardId];
      console.log('drop pila', cardId, carta);
      if (top) {
        const cartaTop = baraja[top];
        console.log('cartaTop', cartaTop);
        if (
          carta.palo === cartaTop.palo &&
          carta.valor === cartaTop.valor + 1
        ) {
          this.push(cardId);
          return true;
        }
      } else {
        if (carta.valor === 0) {
          this.push(cardId);
          return true;
        }
      }
      return false;
    },
  };
}

export default function () {
  for (let slot = 0; slot < 4; slot++) {
    k.add([k.sprite(HUECO), grilla(slot + 3, 0), pilaComp(slot), PILA]);
  }
}
