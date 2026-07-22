import { Celda } from './celda.js';
import { Card } from './card.js';
import { HUECO, CELDA } from './constants.js';

export class Pila extends Celda {
  #card;
  constructor(slot) {
    super(CELDA.PILA, slot);
    this.container.classList.add('singleRow');
    this.container.setAttribute('draggable', true);
    this.#card = new Card(HUECO);
    super.container.appendChild(this.#card.el);
  }

  get card() {
    return this.#card;
  }

  update() {
    const cardId = this.top || HUECO;
    if (cardId === this.#card.id) return;
    this.#card.id = cardId;
  }
}
