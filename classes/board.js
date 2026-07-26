import { Mazo } from './mazo.js';
import { Vista } from './vista.js';
import { Base } from './base.js';
import { Tablon } from './tablon.js';
import { Guess } from './guess.js';
import { Game } from './game.js';
import { NUM_BASES, NUM_TABLONES } from './constants.js';

export class Board extends EventTarget {
  #el;

  #mazo;
  #vista;
  #guess;
  #bases = [];
  #tablones = [];

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
    for (let slot = 0; slot < NUM_BASES; slot++) {
      this.#bases[slot] = new Base(slot);
      el.appendChild(this.#bases[slot].el);
    }
    for (let slot = 0; slot < NUM_TABLONES; slot++) {
      this.#tablones[slot] = new Tablon(slot);
      el.appendChild(this.#tablones[slot].el);
    }
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
