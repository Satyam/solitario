import { TIPOS_CELDA } from './celda.js';
import { PilaSimple } from './pilaSimple.js';

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
      this.raise();
    }
  }

  async raise() {
    if (!this.top) return false;
    const destino = tablero.bases.canMoveIntoAny(this.top);
    if (destino) await this.top2Base(destino);
    return !!destino;
  }
}
