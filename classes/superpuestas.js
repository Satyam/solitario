import { Celda, TIPOS_CELDA } from './celda.js';
import { HUECO } from './baraja.js';

export class Superpuesta extends Celda {
  #cartaTop;
  constructor(tipo, slot) {
    super(tipo, slot);
    this.container.classList.add('singleRow');
    if (this.top) {
      this.container.classList.remove(HUECO);
      this.container.draggable = true;
      this.#cartaTop = this.top;
      super.container.appendChild(this.#cartaTop.el);
    } else {
      this.container.classList.add(HUECO);
      this.container.draggable = false;
    }
  }

  update() {
    const container = this.container;
    if (this.top) {
      if (this.top === this.#cartaTop) return;
      container.classList.remove(HUECO);
      this.#cartaTop = this.top;
      container.firstChild?.remove();
      container.appendChild(this.#cartaTop.el);
    } else {
      if (this.#cartaTop) {
        this.#cartaTop.el.remove();
        this.#cartaTop = null;
      }
      container.classList.add(HUECO);
      container.draggable = false;
    }
  }

  get cardTop() {
    return this.#cartaTop;
  }
}
