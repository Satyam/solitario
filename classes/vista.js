import { Celda } from './celda.js';
import { Card } from './card.js';
import { HUECO, CELDA } from './constants.js';

export class Vista extends Celda {
  #card;
  constructor() {
    super(CELDA.VISTA);
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
