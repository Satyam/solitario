import k from '../k.js';
import grilla from '../comp/grilla.js';
import {
  HUECO,
  MAZO,
  REVERSO,
  OFFSET_PILA,
  baraja,
  EN_HUECO,
} from '../datos.js';

export function huecoComp(slot) {
  const cartas = [];
  let top = null;
  const rendered = [];
  let lastHidden = slot - 1;
  let dragSensed = false;
  return {
    add() {
      const mazo = k.getFirst(MAZO);
      for (let i = 0; i <= slot; i++) {
        this.push(mazo.sacar());
      }
      k.mouseDown(() => {
        if (dragSensed || cartas.length === 0) return;
        const top = rendered.filter((which) => which.hasPt(k.mousePos())).pop();
        if (!top || top.index <= lastHidden) return;
        dragSensed = true;
        console.log('mouseDown', slot, top.index, lastHidden);
      });
      k.mouseRelease(() => {
        dragSensed = false;
      });
    },
    slot() {
      return slot;
    },
    push(cardId) {
      cartas.push(cardId);
      top = cardId;
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
      console.log('rendering', slot);
      cartas.forEach((cardId, index) => {
        const r = rendered[index];
        if (r && r.cardId === cardId && r.visible === index > lastHidden)
          return;
        if (r) k.destroy(r);
        rendered[index] = k.add([
          k.sprite(index > lastHidden ? cardId : REVERSO),
          k.pos(this.pos.x, this.pos.y + OFFSET_PILA * index),
          EN_HUECO,
          {
            parent: this,
            index,
            cardId,
            visible: index > lastHidden,
          },
        ]);
      });
    },
  };
}

export default function () {
  for (let slot = 0; slot < 7; slot++) {
    k.add([k.sprite(HUECO), grilla(slot, 1), huecoComp(slot), HUECO, EN_HUECO]);
  }
}
