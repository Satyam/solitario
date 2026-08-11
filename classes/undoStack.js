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

  pushState(/* from , to, cartas, extraFrom, extraTo*/) {
    this.#previous += 1;
    if (this.#previous > this.length) this.length = this.#previous;
    this[this.#previous] = Array.from(arguments).join('|');
    this.#setButtons();
  }

  #undo() {
    if (this.#previous < 0) return;
    const [from, to, cartas, extraFrom, extraTo] =
      this[this.#previous].split('|');
    const cs = cartas.split(',');
    tablero.getCelda(to).decline(cs, extraTo);
    tablero.getCelda(from).restore(cs, extraFrom);
    this.#previous -= 1;
    this.#setButtons();
    tablero.fire(Tablero.UNDO_AFTER);
  }

  #redo() {
    if (this.#previous > this.length - 2) return;
    this.#previous += 1;
    const [from, to, cartas, extraFrom, extraTo] =
      this[this.#previous].split('|');
    const cs = cartas.split(',');
    tablero.getCelda(from).decline(cs, extraFrom);
    tablero.getCelda(to).restore(cs, parseInt(extraTo, 10) + cs.length);
    this.#setButtons();
    tablero.fire(Tablero.REDO_AFTER);
  }

  #setButtons() {
    this.#undoBtn.disabled = this.#previous < 0;
    this.#redoBtn.disabled = this.#previous > this.length - 2;
  }
}
