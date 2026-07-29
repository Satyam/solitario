import { TIPOS_CELDA } from './celda.js';
import { PilaSimple } from './pilaSimple.js';
import { Tablero } from './tablero.js';
export const NUM_BASES = 4;

export class Base extends PilaSimple {
  constructor(slot) {
    super(TIPOS_CELDA.BASE, slot);
    this.el.classList.add('droppable');
    this.el.addEventListener('dragstart', this.#dragStart.bind(this));
    this.el.addEventListener('dragover', this.#dragover.bind(this));
    this.el.addEventListener('drop', this.#drop.bind(this));
    this.el.addEventListener('dragend', this.#dragend.bind(this));
  }

  push(cards) {
    if (Array.isArray(cards)) {
      cards.forEach((card) => (card.reverso = false));
    } else {
      cards.reverso = false;
    }
    super.push(cards);
  }

  canMoveInto(carta) {
    const top = this.top;
    if (top) {
      return carta.palo === top.palo && carta.index === top.index + 1;
    } else {
      return carta.valor === 'A';
    }
  }

  #dragStart() {
    this.el.classList.add('dragging');
    tablero.dragStart(this, this.top);
  }

  #dragover(ev) {
    if (this.canMoveInto(tablero.dragCarta)) {
      ev.preventDefault();
    }
  }

  #drop(ev) {
    if (this.canMoveInto(tablero.dragCarta)) {
      Tablero.fire(Tablero.JUGADA_BEFORE);
      this.push(tablero.dragCelda.pop());
      Tablero.fire(Tablero.JUGADA_AFTER);
      ev.preventDefault();
    }
  }

  #dragend() {
    this.el.classList.remove('dragging');
    tablero.clearDropTargets();
  }
}

export class Bases extends Array {
  constructor() {
    super();
    for (let slot = 0; slot < NUM_BASES; slot++) {
      this[slot] = new Base(slot);
    }
  }
  clear() {
    this.forEach((base) => base.clear());
  }
  canMoveIntoAny(carta) {
    if (typeof carta === 'undefined') return false;
    return this.find((base) => base.canMoveInto(carta));
  }
}
