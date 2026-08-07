import { Tablero } from './tablero.js';

let previous = -1;

export class Undo extends Array {
  #undoBtn;
  #redoBtn;
  #previous = -1;
  #size;
  constructor(size) {
    super();
    this.#size = size;
    this.#undoBtn = document.getElementById('undo');
    this.#redoBtn = document.getElementById('redo');
    this.#undoBtn.addEventListener('click', this.#undo.bind(this));
    this.#redoBtn.addEventListener('click', this.#redo.bind(this));
    this.#setButtons();
    setTimeout(this.#initListeners.bind(this));
  }

  #initListeners() {
    tablero.on(Tablero.NEWGAME_BEFORE, this.#resetUndo.bind(this));
  }

  #resetUndo() {
    this.length = 0;
    this.#previous = -1;
    this.#setButtons();
  }

  pushState(/* from , to, cartas, ...extra*/) {
    this.#previous += 1;
    if (this.#previous > this.length) this.length = this.#previous;
    this[this.#previous] = Array.from(arguments).join('|');
    this.#setButtons();
  }

  #restoreState(index) {
    const [from, to, cartas, ...extra] = this[index].split('|');
    tablero[to[0]](to[1]).decline(cartas.split(','), ...extra);
    tablero[from[0]](from[1]).restore(cartas.split(','), ...extra);
  }

  #undo() {
    if (this.#previous < 0) return;
    this.#restoreState(this.#previous);
    this.#previous -= 1;
    this.#setButtons();
    tablero.fire(Tablero.UNDO_AFTER);
    console.log('undo p', this.#previous, 'l', this.length);
  }

  #redo() {
    if (this.#previous > this.length - 2) return;
    this.#previous += 1;
    this.#restoreState(this.#previous);
    this.#setButtons();
    tablero.fire(Tablero.REDO_AFTER);
    console.log('redo p', this.#previous, 'l', this.length);
  }

  #setButtons() {
    this.#undoBtn.disabled = this.#previous < 0;
    this.#redoBtn.disabled = this.#previous > this.length - 2;
  }
}
