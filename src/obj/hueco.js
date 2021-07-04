import k from '../k.js';
import grilla from '../comp/grilla.js';
import enViaje from './enViaje.js';
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
  let dragging = null;
  return {
    add() {
      const mazo = k.getFirst(MAZO);
      for (let i = 0; i <= slot; i++) {
        this.push(mazo.sacar());
      }
      k.mouseDown(() => {
        if (k.isDragging || dragging || cartas.length === 0) return;
        const top = rendered.filter((which) => which.hasPt(k.mousePos())).pop();
        if (!top || top.index <= lastHidden) return;
        console.log('mouseDown', slot, top.index, lastHidden);
        dragging = k.add([enViaje(cartas.slice(top.index), top)]);
        k.isDragging = true;
        cartas.length = top.index;
        lastHidden = cartas.length - 2;
        this.render();
      });
      k.mouseRelease(() => {
        if (dragging) {
          k.destroy(dragging);
          dragging = null;
          k.isDragging = false;
        }
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

      if (rendered.length && cartas.length < rendered.length) {
        for (let ri = cartas.length; ri < rendered.length; ri++) {
          k.destroy(rendered[ri]);
        }
        rendered.length = cartas.length;
      }

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
