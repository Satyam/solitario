import { TIPOS_CELDA } from './celda.js';
import { Superpuesta } from './superpuestas.js';

export class Vista extends Superpuesta {
  constructor() {
    super(TIPOS_CELDA.VISTA);
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
