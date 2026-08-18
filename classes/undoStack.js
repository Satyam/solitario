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
    console.log('pushState', Array.from(arguments).join('|'));
    this.#setButtons();
  }

  async #undo() {
    if (this.#previous < 0) return;
    const [from, to, cartas, extraFrom, extraTo] =
      this[this.#previous].split('|');
    const cs = cartas.split(',');
    const toCelda = tablero.getCelda(to);
    const fromCelda = tablero.getCelda(from);
    const toEl = toCelda.getCarta(cs[cs.length - 1]).container;

    // If the fromCelda has no cards, get the container itself.
    const fromEl = fromCelda.top?.el ?? fromCelda.el;
    await tablero.animateMove(toEl, fromEl);
    toCelda.decline(cs, extraTo);
    fromCelda.restore(cs, extraFrom);
    this.#previous -= 1;
    this.#setButtons();
    tablero.fire(Tablero.UNDO_AFTER);
  }

  async #redo() {
    if (this.#previous > this.length - 2) return;
    this.#previous += 1;
    const [from, to, cartas, extraFrom, extraTo] =
      this[this.#previous].split('|');
    const cs = cartas.split(',');
    const toCelda = tablero.getCelda(to);
    const fromCelda = tablero.getCelda(from);
    const fromEl = fromCelda.getCarta(cs[cs.length - 1]).container;

    // If the toCelda has no cards, get the container itself.
    const toEl = toCelda.top?.el ?? toCelda.el;
    await tablero.animateMove(fromEl, toEl);
    fromCelda.decline(cs, extraFrom);
    toCelda.restore(cs, parseInt(extraTo, 10) + cs.length);
    this.#setButtons();
    tablero.fire(Tablero.REDO_AFTER);
  }

  #setButtons() {
    this.#undoBtn.disabled = this.#previous < 0;
    this.#redoBtn.disabled = this.#previous > this.length - 2;
  }
}
