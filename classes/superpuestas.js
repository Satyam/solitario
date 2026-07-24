import { Celda, TIPOS_CELDA } from './celda.js';
import { Card } from './card.js';
import { HUECO } from './baraja.js';

export class Superpuesta extends Celda {
  #card;
  constructor(tipo, slot) {
    super(tipo, slot);
    this.container.classList.add('singleRow');
    if (this.top) {
      this.container.classList.remove(HUECO);
      this.container.draggable = true;
      this.#card = this.top;
      super.container.appendChild(this.#card.el);
    } else {
      this.container.classList.add(HUECO);
      this.container.draggable = false;
    }
  }

  update() {
    if (this.top) {
      if (this.top === this.#card) return;
      this.container.classList.remove(HUECO);
      if (this.#card) {
        this.#card.id = this.top.id;
      } else {
        this.#card = this.top;
        this.container.appendChild(this.#card.el);
      }
    } else {
      if (this.#card) {
        this.#card.el.remove();
        this.#card = null;
      }
      this.container.classList.add(HUECO);
      this.container.draggable = false;
    }
  }

  get cardShown() {
    return this.#card;
  }
}
