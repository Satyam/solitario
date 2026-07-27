import { TIPOS_CELDA } from './celda.js';
import { PilaSimple } from './pilaSimple.js';

export const NUM_BASES = 4;

export class Base extends PilaSimple {
  constructor(slot) {
    super(TIPOS_CELDA.BASE, slot);
    this.el.classList.add('droppable');
  }
  push(cards) {
    if (Array.isArray(cards)) {
      cards.forEach((card) => (card.reverso = false));
    } else {
      cards.reverso = false;
    }
    super.push(cards);
  }
  canMoveInto(carta) {
    const top = this.top;
    if (top) {
      return carta.palo === top.palo && carta.index === top.index + 1;
    } else {
      return carta.valor === 'A';
    }
  }

  canDrop(carta) {
    console.log(carta);
    return Math.random() > 0.5;
  }
}

export class Bases extends Array {
  constructor() {
    super();
    for (let slot = 0; slot < NUM_BASES; slot++) {
      this[slot] = new Base(slot);
    }
  }
  clear() {
    this.forEach((base) => base.clear());
  }
  canMoveIntoAny(carta) {
    if (typeof carta === 'undefined') return false;
    return this.find((base) => base.canMoveInto(carta));
  }
}
