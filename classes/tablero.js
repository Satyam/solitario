import { Mazo } from './mazo.js';
import { Vista } from './vista.js';
import { Base, Bases } from './base.js';
import { Tablon, Tablones } from './tablon.js';
import { Guess } from './guess.js';
import { Game } from './game.js';
import { Undo } from './undoStack.js';

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

  #undo;

  constructor(el) {
    super();
    this.#el = el;
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
  get guess() {
    return this.#guess;
  }
  get bases() {
    return this.#bases;
  }
  get tablones() {
    return this.#tablones;
  }

  pushState() {
    return this.#undo.pushState(...arguments);
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
}
