import { TIPOS_CELDA } from './celda.js';
import { Superpuesta } from './superpuestas.js';

export class Mazo extends Superpuesta {
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
