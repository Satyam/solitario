import { TIPOS_CELDA } from './celda.js';
import { PilaSimple } from './pilaSimple.js';

export const NUM_BASES = 4;

export class Base extends PilaSimple {
  constructor(slot) {
    super(TIPOS_CELDA.BASE, slot);
  }
  push(cards) {
    if (Array.isArray(cards)) {
      cards.forEach((card) => (card.reverso = false));
    } else {
      cards.reverso = false;
    }
    super.push(cards);
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
}
