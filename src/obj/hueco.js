import k from '../k.js';
import grilla from '../comp/grilla.js';
import { HUECO, MAZO, OFFSET_PILA, baraja } from '../datos.js';

export function huecoComp(slot) {
  const cartas = [];
  let top = null;
  const rendered = [];
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
      // this.changeSprite(cardId);
      this.render();
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
    render() {
      console.log('rendering');
      rendered.forEach((c) => k.destroy(c));
      rendered.length = 0;
      cartas.forEach((cardId, index) => {
        rendered.push(
          k.add([
            k.sprite(cardId),
            k.pos(this.pos.x, this.pos.y + OFFSET_PILA * index),
          ])
        );
      });
    },
  };
}

export default function () {
  for (let slot = 0; slot < 7; slot++) {
    k.add([k.sprite(HUECO), grilla(slot, 1), huecoComp(slot), HUECO]);
  }
}
