import { TIPOS_CELDA } from './celda.js';
import { PilaSimple } from './pilaSimple.js';

export class Vista extends PilaSimple {
  constructor() {
    super(TIPOS_CELDA.VISTA);
    this.el.addEventListener('mousedown', this.#raiseFromVista.bind(this));
  }

  push(cartas) {
    if (Array.isArray(cartas)) {
      cartas.forEach((carta) => (carta.reverso = false));
    } else {
      cartas.reverso = false;
    }
    super.push(cartas);
  }

  #raiseFromVista(ev) {
    if (ev.buttons === 4) {
      vistaToPila(canDropInSomePila(datos.vista[0]));
      return false;
    }
  }
}
