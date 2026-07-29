import { Mazo } from './mazo.js';
import { Vista } from './vista.js';
import { Base, Bases } from './base.js';
import { Tablon, Tablones } from './tablon.js';
import { Guess } from './guess.js';
import { Game } from './game.js';

export class Tablero extends EventTarget {
  #el;

  #mazo;
  #vista;
  #guess;
  #bases = [];
  #tablones = [];

  #dragCelda;
  #dragCarta;
  #cartaIndex = 0;

  #game;

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

  dragStart(celda, carta, cartaIndex = 0) {
    this.#dragCelda = celda;
    this.#dragCarta = carta;
    this.#cartaIndex = cartaIndex;
    this.#bases.forEach((base) => {
      base.el.classList.toggle('droppable-active', base.canMoveInto(carta));
    });
    this.#tablones.forEach((tablon) => {
      tablon.el.classList.toggle('droppable-active', tablon.canMoveInto(carta));
    });
  }

  clearDropTargets() {
    document
      .querySelectorAll('.droppable-active')
      .forEach((el) => el.classList.remove('droppable-active'));
    this.#dragCelda = null;
    this.#dragCarta = null;
    this.#cartaIndex = 0;
  }

  get dragCelda() {
    return this.#dragCelda;
  }

  get dragCarta() {
    return this.#dragCarta;
  }

  get cartaIndex() {
    return this.#cartaIndex;
  }

  static fire(EV) {
    document.dispatchEvent(new Event(EV));
  }

  static on(EV, callback, self) {
    document.addEventListener(EV, callback);
  }

  static off(EV, callback) {
    document.removeEventListener(EV, callback);
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
