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
    Tablero.on(Tablero.NEWGAME_BEFORE, this.#resetUndo.bind(this));
    Tablero.on(Tablero.JUGADA_BEFORE, this.#pushState.bind(this));
    this.#undoBtn = document.getElementById('undo');
    this.#redoBtn = document.getElementById('redo');
    this.#undoBtn.addEventListener('click', this.#undo.bind(this));
    this.#redoBtn.addEventListener('click', this.#redo.bind(this));
    this.#setButtons();
  }

  #resetUndo() {
    this.length = 0;
    this.#previous = -1;
    this.#setButtons();
  }

  #pushState() {
    this.#previous += 1;
    this.length = this.#previous;
    this[this.#previous] = JSON.stringify({
      mazo: tablero.mazo.state,
      vista: tablero.vista.state,
      bases: tablero.bases.state,
      tablones: tablero.tablones.state,
    });
    this.#setButtons();
    console.log(this.length, this.#previous, JSON.parse(this[this.#previous]));
  }

  #restoreState(index) {
    const state = JSON.parse(this[index]);
    tablero.mazo.state = state.mazo;
    tablero.vista.state = state.vista;
    tablero.bases.state = state.bases;
    tablero.tablones.state = state.tablones;
  }

  #undo() {
    if (this.#previous < 0) return;
    this.#restoreState(this.#previous);
    this.#previous -= 1;
    this.#setButtons();
    Tablero.fire(Tablero.UNDO_AFTER);
  }

  #redo() {
    if (this.#previous >= this.length - 2) return;
    this.#previous += 1;
    this.#restoreState(this.#previous);
    this.#setButtons();
    Tablero.fire(Tablero.REDO_AFTER);
  }

  #setButtons() {
    this.#undoBtn.disabled = this.#previous < 0;
    this.#redoBtn.disabled = this.#previous >= this.length - 2;
  }
}
