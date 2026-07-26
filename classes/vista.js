import { TIPOS_CELDA } from './celda.js';
import { PilaSimple } from './pilaSimple.js';
import { Tablero } from './tablero.js';

export class Vista extends PilaSimple {
  constructor() {
    super(TIPOS_CELDA.VISTA);
    this.el.addEventListener('mousedown', this.#raise.bind(this));
  }

  push(cartas) {
    if (Array.isArray(cartas)) {
      cartas.forEach((carta) => (carta.reverso = false));
    } else {
      cartas.reverso = false;
    }
    super.push(cartas);
  }

  #raise(ev) {
    if (ev.buttons === 4) {
      ev.preventDefault();
      const destino = tablero.bases.canMoveIntoAny(this.top);
      if (destino) this.#toBase(destino);
    }
  }
  async #toBase(base) {
    Tablero.fire(Tablero.JUGADA_BEFORE);
    base.push(this.pop());
    // await animateMove(
    //   document.querySelector(`${SEL.VISTA} ${SEL.TOP}`),
    //   document.querySelectorAll(SEL.PILAS).item(toSlot).querySelector(SEL.TOP)
    // );
    Tablero.fire(Tablero.JUGADA_AFTER);
  }
}
