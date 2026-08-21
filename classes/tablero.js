import { Mazo } from './mazo.js';
import { Vista } from './vista.js';
import { Base, Bases } from './base.js';
import { Tablon, Tablones } from './tablon.js';
import { Guess } from './guess.js';
import { Game } from './game.js';
import { Undo } from './undoStack.js';
import { Baraja } from './baraja.js';
import { initStats } from './stats.js';
import { TIPOS_CELDA } from './celda.js';

export class Tablero extends EventTarget {
  #el;

  #mazo;
  #vista;
  #guess;
  #bases = [];
  #tablones = [];

  #dragCelda;
  #dragCarta;
  #dragQty = 1;

  #game;

  #baraja;

  #undo;

  constructor(el) {
    super();
    this.#el = el;

    this.#baraja = new Baraja();

    this.#mazo = new Mazo();
    el.appendChild(this.#mazo.el);
    this.#vista = new Vista();
    el.appendChild(this.#vista.el);
    this.#guess = new Guess();
    el.appendChild(this.#guess.el);

    this.#bases = new Bases();
    this.#bases.forEach((base) => el.appendChild(base.el));

    this.#tablones = new Tablones();
    this.#tablones.forEach((tablon) => el.appendChild(tablon.el));

    // onEV(EV.NEWGAME_AFTER, renderAll);
    // onEV(EV.UNDO_AFTER, renderAll);
    // onEV(EV.REDO_AFTER, renderAll);
    this.el.addEventListener('dragend', this.clearDropTargets.bind(this));

    this.#undo = new Undo();
  }
  startGame() {
    this.#game = new Game();
    initStats();
  }
  get el() {
    return this.#el;
  }
  get mazo() {
    return this.#mazo;
  }
  get vista() {
    return this.#vista;
  }
  get bases() {
    return this.#bases;
  }
  get tablones() {
    return this.#tablones;
  }
  get guess() {
    return this.#guess;
  }

  get baraja() {
    return this.#baraja;
  }

  getCelda(clave) {
    switch (clave[0]) {
      case TIPOS_CELDA.MAZO[0]:
        return this.#mazo;
      case TIPOS_CELDA.VISTA[0]:
        return this.#vista;
      case TIPOS_CELDA.BASE[0]:
        return this.#bases[clave[1]];
      case TIPOS_CELDA.TABLON[0]:
        return this.#tablones[clave[1]];
    }
  }

  pushState() {
    return this.#undo.pushState(...arguments);
  }

  async animateMove(srcEl, destEl, duration = 300) {
    if (!srcEl) return true;
    srcEl.classList.add('flyOver');
    return new Promise((resolve) => {
      const srcPos = srcEl.getBoundingClientRect();
      const destPos = destEl.getBoundingClientRect();
      const anim = srcEl.animate(
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
        srcEl.classList.remove('flyOver');
        resolve();
      });
    });
  }

  dragStart(celda, carta, dragQty = 1) {
    this.#dragCelda = celda;
    this.#dragCarta = carta;
    this.#dragQty = dragQty;
    this.#bases.forEach((base) => {
      base.el.classList.toggle('droppable-active', base.canMoveInto(carta));
    });
    this.#tablones.forEach((tablon) => {
      tablon.el.classList.toggle('droppable-active', tablon.canMoveInto(carta));
    });
  }

  clearDropTargets() {
    this.#el
      .querySelectorAll('.dragging, .droppable-active')
      .forEach((el) => el.classList.remove('dragging', 'droppable-active'));
    this.#dragCelda = null;
    this.#dragCarta = null;
    this.#dragQty = 1;
  }

  get dragCelda() {
    return this.#dragCelda;
  }

  get dragCarta() {
    return this.#dragCarta;
  }

  get dragQty() {
    return this.#dragQty;
  }

  fire(EV, data) {
    if (data) {
      this.dispatchEvent(new CustomEvent(EV, { detail: data }));
    } else {
      this.dispatchEvent(new Event(EV));
    }
  }

  on(EV, callback, self) {
    this.addEventListener(EV, callback);
  }

  off(EV, callback) {
    this.removeEventListener(EV, callback);
  }
  static GAMEOVER_BEFORE = 'before_game_over';
  static GAMEOVER_AFTER = 'after_game_over';
  static JUGADA_BEFORE = 'before_jugada';
  static JUGADA_AFTER = 'after_jugada';
  static NEWGAME_BEFORE = 'before_new_game';
  static NEWGAME_AFTER = 'after_new_game';
  static UNDO_AFTER = 'after_undo';
  static REDO_AFTER = 'after_redo';
  static NEW_RONDA = 'new_ronda';
}
