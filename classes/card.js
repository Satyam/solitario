import { SVG_NS, SVG_CARD_PREFIX } from './constants.js';
import { HUECO, REVERSO } from './baraja.js';

export class Card {
  #id = null;
  #el = null;
  #use = null;
  #className;
  #reverso = false;

  constructor(id, className) {
    this.#id = id;
    this.#className = className;
  }

  #createEl() {
    const el = document.createElementNS(SVG_NS, 'svg');
    el.setAttribute('xmlns', SVG_NS);
    el.setAttribute('viewBox', '0 0 240 336');
    el.classList.add('card');
    if (this.#className) el.classList.add(this.#className);

    const use = document.createElementNS(SVG_NS, 'use');
    use.setAttribute(
      'href',
      `${SVG_CARD_PREFIX}${this.#reverso ? REVERSO : this.#id}`
    );
    el.appendChild(use);

    this.#use = use;
    return el;
  }

  set id(id) {
    if (id === this.#id) return;
    this.#id = id;
    this.#el ??= this.#createEl();
    this.#use.setAttribute(
      'href',
      `${SVG_CARD_PREFIX}${this.#reverso ? REVERSO : this.#id}`
    );
  }

  get id() {
    return this.#id;
  }

  get el() {
    return (this.#el ??= this.#createEl());
  }
  get reverso() {
    return this.#reverso;
  }
  set reverso(r) {
    this.#reverso = r;
  }
}
