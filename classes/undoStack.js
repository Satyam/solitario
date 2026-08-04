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
    if (this.#previous > this.length) this.length = this.#previous;
    this[this.#previous] = [
      tablero.mazo.state,
      tablero.vista.state,
      tablero.bases.state,
      tablero.tablones.state,
    ].join('|');
    this.#setButtons();
    console.log('push p', this.#previous, 'l', this.length);
  }

  #restoreState(index) {
    this[index].split('|').forEach((block) => {
      const [[pila, slot], data] = block.split(':');
      switch (pila) {
        case 'm':
          tablero.mazo.state = data;
          break;
        case 'v':
          tablero.vista.state = data;
          break;
        case 'b':
          tablero.bases[slot].state = data;
          break;
        case 't':
          tablero.tablones[slot].state = data;
          break;
      }
    });
  }

  #undo() {
    if (this.#previous < 0) return;
    this.#restoreState(this.#previous);
    this.#previous -= 1;
    this.#setButtons();
    Tablero.fire(Tablero.UNDO_AFTER);
    console.log('undo p', this.#previous, 'l', this.length);
  }

  #redo() {
    if (this.#previous > this.length - 2) return;
    this.#previous += 1;
    this.#restoreState(this.#previous);
    this.#setButtons();
    Tablero.fire(Tablero.REDO_AFTER);
    console.log('redo p', this.#previous, 'l', this.length);
  }

  #setButtons() {
    this.#undoBtn.disabled = this.#previous < 0;
    this.#redoBtn.disabled = this.#previous > this.length - 2;
  }
}
