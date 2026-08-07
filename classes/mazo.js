import { TIPOS_CELDA } from './celda.js';
import { PilaSimple } from './pilaSimple.js';
import { Tablero } from './tablero.js';
import { Carta } from './baraja.js';

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
    tablero.fire(Tablero.JUGADA_BEFORE);
    if (this.top) {
      const carta = this.pop();
      carta.reverso = false;
      tablero.vista.push(carta);
      tablero.pushState(this.clave, tablero.vista.clave, carta.clave);
    } else {
      const cartas = tablero.vista.back();
      this.push(cartas);
      tablero.pushState(
        this.clave,
        tablero.vista.clave,
        cartas.map((carta) => carta.clave).join(',')
      );
    }
    tablero.fire(Tablero.JUGADA_AFTER);
  }
}
