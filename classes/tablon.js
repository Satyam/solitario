import { Celda, TIPOS_CELDA } from './celda.js';
import { HUECO } from './baraja.js';

export const NUM_TABLONES = 7;

export class Tablon extends Celda {
  #index = 0;
  #cardHeight;
  #shortCardHeight;

  constructor(slot) {
    super(TIPOS_CELDA.TABLON, slot);
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
    this.el.addEventListener('mousedown', this.#raiseFromTablon.bind(this));
  }

  #oneLevel(cartas, container, next = false) {
    const carta = cartas.pop();
    const isVisible = cartas.length <= this.#index;
    carta.reverso = !isVisible;
    const subPila = document.createElement('div');
    subPila.classList.add('stack');
    if (next) subPila.classList.add('offset');
    subPila.draggable = isVisible;

    subPila.appendChild(carta.el);
    if (cartas.length) {
      this.#oneLevel(cartas, subPila, true);
    }
    container.appendChild(subPila);
  }
  update() {
    const cartas = this.cartas.toReversed();
    if (cartas.length) {
      this.container.style.height =
        ((cartas.length || 1) - 1) * this.#shortCardHeight + this.#cardHeight;
      this.container.classList.remove(HUECO);
      this.#oneLevel(cartas, this.container);
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
    this.cartas.filter((carta, index) => index < this.#index);
  }
  #raiseFromTablon() {}
}

export class Tablones extends Array {
  constructor() {
    super();
    for (let slot = 0; slot < NUM_TABLONES; slot++) {
      this[slot] = new Tablon(slot);
    }
  }
  clear() {
    this.forEach((tablon) => tablon.clear());
  }
}
