import { TIPOS_CELDA } from './celda.js';
import { PilaSimple } from './pilaSimple.js';
import { Tablero } from './tablero.js';
import { Carta } from './baraja.js';

export const NUM_BASES = 4;

export class Base extends PilaSimple {
  constructor(slot) {
    super(TIPOS_CELDA.BASE, slot);
    this.el.classList.add('droppable');
    this.el.addEventListener('dragstart', this.#dragStart.bind(this));
    this.el.addEventListener('dragover', this.#dragOver.bind(this));
    this.el.addEventListener('drop', this.#dragDrop.bind(this));
  }

  push(cartas) {
    if (Array.isArray(cartas)) {
      cartas.forEach((carta) => (carta.reverso = false));
    } else {
      cartas.reverso = false;
    }
    super.push(cartas);
  }

  update() {
    super.update();
    if (this.top) this.container.draggable = true;
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

  #dragOver(ev) {
    if (this.canMoveInto(tablero.dragCarta)) {
      ev.preventDefault();
    }
  }

  #dragDrop(ev) {
    if (this.canMoveInto(tablero.dragCarta)) {
      Tablero.fire(Tablero.JUGADA_BEFORE);
      const cartas = tablero.dragCelda.pop(tablero.dragQty);
      tablero.pushState(
        tablero.dragCelda.clave,
        this.clave,
        Array.isArray(cartas)
          ? cartas.map((carta) => carta.clave).join(',')
          : cartas.clave
      );
      this.push(cartas);
      this.el.classList.remove('dragging');
      tablero.clearDropTargets();
      Tablero.fire(Tablero.JUGADA_AFTER);
      ev.preventDefault();
    }
  }

  async endAnimation() {
    const topEl = this.top?.el;
    if (!topEl) {
      return;
    }
    topEl.classList.remove('behind');
    topEl.classList.add('top');
    if (this.cartas.length > 1) {
      const next = this.cartas[1];
      next.el.classList.add('behind');
      this.container.appendChild(next.el);
    }
    await new Promise((resolve) => {
      const anim = topEl.animate(
        [
          {
            transform: 'rotate(0) translate(0, 0)',
            opacity: 1,
          },
          {
            transform: 'rotate(180deg) translate(-200px, 400px)',
            opacity: 0,
          },
        ],
        { duration: Math.random() * 3000 + 1000, delay: 10 }
      );

      anim.addEventListener('finish', () => {
        resolve(true);
      });
    });
    this.pop();
    return this.endAnimation();
  }

  get state() {
    return `b${this.slot}:${this.cartas.map((carta) => `${carta.palo}${carta.index}`).join(',')}`;
  }
  set state(data) {
    this.clear();
    if (data.length) {
      this.push(
        data
          .split(',')
          .map((name) => new Carta(name[0], parseInt(name.substring(1))))
      );
    }
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

  async endAnimation() {
    await Promise.all(this.map((base) => base.endAnimation()));
    Tablero.fire(Tablero.GAMEOVER_AFTER);
  }

  get state() {
    return this.map((b) => b.state).join('|');
  }
  set state(s) {
    this.forEach((b, slot) => (b.state = s[slot]));
  }
}
