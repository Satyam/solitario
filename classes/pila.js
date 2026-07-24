import { Celda, TIPOS_CELDA } from './celda.js';
import { Card } from './card.js';
import { HUECO } from './baraja.js';

export class Pila extends Celda {
  #index = 0;
  #cardHeight;
  #shortCardHeight;

  constructor(slot) {
    super(TIPOS_CELDA.PILA, slot);
    this.container.draggable = true;

    if (this.top) {
      this.container.classList.remove(HUECO);
      this.update();
    } else {
      this.container.classList.add(HUECO);
      this.container.draggable = false;
    }
    const s = getComputedStyle(document.documentElement);
    this.#cardHeight = parseInt(s.getPropertyValue('--cardHeight'), 10);
    this.#shortCardHeight = parseInt(
      s.getPropertyValue('--shortCardHeight'),
      10
    );
  }

  #oneLevel(cards, container, next = false) {
    const card = cards.pop();
    const isVisible = cards.length <= this.#index;
    card.reverso = !isVisible;
    const subPila = document.createElement('div');
    subPila.classList.add('stack');
    if (next) subPila.classList.add('offset');
    subPila.draggable = isVisible;

    subPila.appendChild(card.el);
    if (cards.length) {
      this.#oneLevel(cards, subPila, true);
    }
    container.appendChild(subPila);
  }
  update() {
    const cards = this.cards.toReversed();
    if (cards.length) {
      this.container.style.height =
        ((cards.length || 1) - 1) * this.#shortCardHeight + this.#cardHeight;
      this.container.classList.remove(HUECO);
      this.#oneLevel(cards, this.container);
    } else {
      this.container.classList.add(HUECO);
      this.container.draggable = false;
    }
  }

  clear() {
    super.clear();
    this.#index = 0;
  }
  get visible() {
    this.cards.filter((card, index) => index < this.#index);
  }
}
