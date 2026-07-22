import { Celda } from './celda.js';
import { Card } from './card.js';
import { HUECO, REVERSO, CELDA } from './constants.js';

export class Mazo extends Celda {
  #card;
  constructor() {
    super(CELDA.MAZO);
    this.container.classList.add('singleRow');
    this.#card = new Card(HUECO);
    super.container.appendChild(this.#card.el);
  }
  get card() {
    return this.#card;
  }

  update() {
    const cardId = this.top ? REVERSO : HUECO;
    if (cardId === this.#card.id) return;
    this.#card.id = cardId;
  }
}
