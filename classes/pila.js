import { Celda } from './celda.js';
import { Card } from './card.js';
import { HUECO, CELDA } from './constants.js';

export class Pila extends Celda {
  #card;
  #index;
  constructor(slot) {
    super(CELDA.PILA, slot);
    this.container.setAttribute('draggable', true);
    const stk = document.createElement('div');
    stk.classList.add('stack');
    stk.setAttribute('draggable', true);

    const card = new Card(HUECO);
    stk.appendChild(card);
    this.container.appendChild(stk);
  }

  update() {}
}
