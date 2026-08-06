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
    Tablero.fire(Tablero.JUGADA_BEFORE);
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
    Tablero.fire(Tablero.JUGADA_AFTER);
  }
  get state() {
    return `m:${this.cartas.map((carta) => `${carta.palo}${carta.index}`).join(',')}`;
  }

  set state(data) {
    this.clear();
    if (data.length) {
      this.push(
        data
          .split(',')
          .map((name) => new Carta(name[0], parseInt(name.substring(1))))
      );
    }
  }
}
