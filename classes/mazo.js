import { TIPOS_CELDA } from './celda.js';
import { PilaSimple } from './pilaSimple.js';

export class Mazo extends PilaSimple {
  constructor() {
    super(TIPOS_CELDA.MAZO);
    this.el.addEventListener('click', this.#sacarCarta.bind(this));
  }

  push(cartas) {
    if (Array.isArray(cartas)) {
      cartas.forEach((carta) => (carta.reverso = true));
    } else {
      cartas.reverso = true;
    }
    super.push(cartas);
  }

  #sacarCarta() {
    if (this.top) {
      const carta = this.pop();
      carta.reverso = false;
      tablero.vista.push(carta);
    } else {
      this.push(tablero.vista.back());
    }
  }
}
