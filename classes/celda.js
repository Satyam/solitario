import { Cartas } from './baraja.js';

export const TIPOS_CELDA = {
  MAZO: 'mazo',
  VISTA: 'vista',
  TABLON: 'tablon',
  BASE: 'base',
};

export class Celda extends Cartas {
  #type = '';
  #slot = 0;
  #el = null;
  #container = null;

  constructor(type, slot = 0) {
    super();
    this.#type = type;
    this.#slot = slot;

    const el = document.createElement('div');
    el.classList.add('celda', this.#type);

    const container = document.createElement('div');
    container.classList.add('cardContainer');
    el.appendChild(container);

    this.#el = el;
    this.#container = container;
  }
  get type() {
    return this.#type;
  }
  get slot() {
    return this.#slot;
  }
  get el() {
    return this.#el;
  }
  get container() {
    return this.#container;
  }
  update() {
    // To be implemented by subclasses
  }
  push(cards) {
    super.push(cards);
    this.update();
  }

  pop(qty) {
    const ret = super.pop(qty);
    this.update();
    return ret;
  }

  clear() {
    super.clear();
    this.update();
  }
}
