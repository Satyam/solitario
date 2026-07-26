import { TIPOS_CELDA } from './celda.js';
import { PilaSimple } from './pilaSimple.js';

export class Mazo extends PilaSimple {
  constructor() {
    super(TIPOS_CELDA.MAZO);
  }
  push(cards) {
    if (Array.isArray(cards)) {
      cards.forEach((card) => (card.reverso = true));
    } else {
      cards.reverso = true;
    }
    super.push(cards);
  }
}
