import { Cartas } from './baraja.js';
import { Tablero } from './tablero.js';

// It is important that the first letter of these string literals be unique.
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
  get clave() {
    return `${this.#type[0]}${this.#slot}`;
  }

  update() {
    // To be implemented by subclasses
  }
  push(cards) {
    super.push(cards);
    this.update();
  }

  pop(qty = 1) {
    const ret = super.pop(qty);
    this.update();
    return ret;
  }

  clear() {
    super.clear();
    this.update();
  }

  async top2Base(base) {
    tablero.fire(Tablero.JUGADA_BEFORE);
    await this.#animateMove(base);
    const extraFrom = this.extra;
    const carta = this.pop();
    base.push(carta);
    tablero.pushState(this.clave, base.clave, carta.name, extraFrom);
    tablero.fire(Tablero.JUGADA_AFTER);
  }

  async #animateMove(destCarta, duration = 300) {
    const topEl = this.top.el;
    if (!topEl) return true;
    topEl.classList.add('flyOver');
    return new Promise((resolve) => {
      const srcPos = topEl.getBoundingClientRect();
      const destPos = destCarta.el.getBoundingClientRect();
      const anim = topEl.animate(
        {
          transform: `translate(
          ${destPos.left - srcPos.left}px,
          ${destPos.top - srcPos.top}px
        )`,
        },
        {
          duration,
        }
      );
      anim.addEventListener('finish', () => {
        topEl.classList.remove('flyOver');
        resolve();
      });
    });
  }

  get extra() {
    return null;
  }
  decline(cartas, ...extra) {
    tablero.baraja.push(this.pop(cartas.length));
  }
  restore(cartas, ...extra) {
    this.push(tablero.baraja.pullCartas(cartas));
  }
}
