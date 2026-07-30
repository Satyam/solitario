import { Celda, TIPOS_CELDA } from './celda.js';
import { HUECO } from './baraja.js';
import { Tablero } from './tablero.js';

export const NUM_TABLONES = 7;

export class Tablon extends Celda {
  #numVisible = 1;
  #cardHeight;
  #shortCardHeight;

  constructor(slot) {
    super(TIPOS_CELDA.TABLON, slot);
    this.container.draggable = true;
    this.el.classList.add('droppable');

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
    this.container.addEventListener('mousedown', this.#raise.bind(this));
    this.el.addEventListener('dragstart', this.#dragStart.bind(this));
    this.el.addEventListener('dragover', this.#dragOver.bind(this));
    this.el.addEventListener('drop', this.#dragDrop.bind(this));
  }

  push(cards, first = false) {
    if (!first) {
      if (Array.isArray(cards)) {
        cards.forEach((card) => (card.reverso = false));
        this.#numVisible += cards.length;
      } else {
        cards.reverso = false;
        this.#numVisible++;
      }
    }
    super.push(cards);
  }

  pop(qty = 1) {
    this.#numVisible -= qty;
    if (this.#numVisible <= 0) this.#numVisible = 1;
    return super.pop(qty);
  }

  #oneLevel(cartas, container, next = false) {
    const carta = cartas.shift();
    const isVisible = cartas.length < this.#numVisible;
    carta.reverso = !isVisible;
    const subPila = document.createElement('div');
    subPila.classList.add('stack');
    subPila.dataset.cartaIndex = cartas.length;
    if (next) subPila.classList.add('offset');
    subPila.draggable = isVisible;

    subPila.appendChild(carta.el);
    if (cartas.length) {
      this.#oneLevel(cartas, subPila, true);
    }
    container.appendChild(subPila);
  }

  update() {
    const cont = this.container;
    cont.firstChild?.remove();
    const cartas = this.cartas.toReversed();
    if (cartas.length) {
      cont.style.height =
        ((cartas.length || 1) - 1) * this.#shortCardHeight + this.#cardHeight;
      cont.classList.remove(HUECO);
      this.#oneLevel(cartas, cont);
    } else {
      cont.classList.add(HUECO);
      cont.draggable = false;
    }
  }

  clear() {
    super.clear();
    this.#numVisible = 1;
  }
  get visible() {
    this.cartas.filter((carta, index) => index < this.#numVisible);
  }
  #raise(ev) {
    if (ev.buttons === 4) {
      ev.preventDefault();
      this.raise();
    }
  }

  async raise() {
    if (!this.top) return false;
    const destino = tablero.bases.canMoveIntoAny(this.top);
    if (destino) await this.top2Base(destino);
    return !!destino;
  }

  #dragStart(ev) {
    this.el.classList.add('dragging');
    tablero.dragStart(
      this,
      this.cartas[ev.target.dataset.cartaIndex],
      parseInt(ev.target.dataset.cartaIndex, 10) + 1
    );
  }

  #dragOver(ev) {
    if (this.canMoveInto(tablero.dragCarta)) {
      ev.preventDefault();
    }
  }

  #dragDrop(ev) {
    if (this.canMoveInto(tablero.dragCarta)) {
      Tablero.fire(Tablero.JUGADA_BEFORE);
      this.push(tablero.dragCelda.pop(tablero.dragQty));
      this.el.classList.remove('dragging');
      tablero.clearDropTargets();
      Tablero.fire(Tablero.JUGADA_AFTER);
      ev.preventDefault();
    }
  }

  canMoveInto(carta) {
    const top = this.top;
    if (top) {
      return carta.color !== top.color && carta.index + 1 === top.index;
    } else {
      return carta.valor === 'K';
    }
  }
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
