const SVG_NS = 'http://www.w3.org/2000/svg';

export class Card {
  #id = null;
  #el = null;
  #use = null;
  #className;

  constructor(id, className) {
    this.#id = id;
    this.#className = className;

    const el = document.createElementNS(SVG_NS, 'svg');
    el.setAttribute('xmlns', SVG_NS);
    el.setAttribute('viewBox', '0 0 240 336');
    if (className) el.classList.add('card', className);

    const use = document.createElementNS(SVG_NS, 'use');
    use.setAttribute('href', `assets/cards.svg#card_${this.#id}`);
    el.appendChild(use);

    this.#el = el;
    this.#use = use;
  }
  set id(id) {
    if (id === this.#id) return;
    this.#id = id;
    this.#use.setAttribute('href', `assets/cards.svg#card_${this.#id}`);
  }
  get id() {
    return this.#id;
  }
  get el() {
    return this.#el;
  }
}
