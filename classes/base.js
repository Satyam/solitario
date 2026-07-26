import { TIPOS_CELDA } from './celda.js';
import { PilaSimple } from './pilaSimple.js';

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
