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
      tablero.fire(Tablero.JUGADA_BEFORE);
      const extraFrom = tablero.dragCelda.extra;
      const cartas = tablero.dragCelda.pop(tablero.dragQty);
      tablero.pushState(
        tablero.dragCelda.clave,
        this.clave,
        Array.isArray(cartas)
          ? cartas.map((carta) => carta.name).join(',')
          : cartas.name,
        extraFrom
      );
      this.push(cartas);
      this.el.classList.remove('dragging');
      tablero.clearDropTargets();
      tablero.fire(Tablero.JUGADA_AFTER);
      ev.preventDefault();
    }
  }

  async endAnimation() {
    const topEl = this.top?.el;
    if (!topEl) {
      return;
    }
    topEl.classList.remove('stayBehind');
    topEl.classList.add('flyOver');
    if (this.cartas.length > 1) {
      const next = this.cartas[1];
      next.el.classList.add('stayBehind');
      this.container.appendChild(next.el);
    }
    if (
      await new Promise((resolve) => {
        const anim = topEl.animate(
          [
            {
              transform: 'rotate(0) translate(0, 0)',
              opacity: 1,
            },
            {
              transform: 'rotate(120deg) translate(-200px, 400px)',
              opacity: 0.3,
            },
          ],
          { duration: Math.random() * 3000 + 1000, delay: 10 }
        );

        anim.addEventListener('finish', () => {
          resolve(true);
        });
        anim.addEventListener('cancel', () => {
          resolve(false);
        });
      })
    ) {
      tablero.baraja.push(this.pop());
      return this.endAnimation();
    }
    return false;
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
    tablero.fire(Tablero.GAMEOVER_AFTER);
  }
}
