import { SVG_NS, SVG_CARD_PREFIX } from './constants.js';

// Types and constants related to cards.
export const COLOR = {
  ROJO: 'rojo',
  NEGRO: 'negro',
};
// Cards from https://www.me.uk/cards/makeadeck.cgi
const valores = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'T',
  'J',
  'Q',
  'K',
];
const palos = ['C', 'D', 'H', 'S'];
const charPalos = {
  H: '&hearts;',
  D: '&diams;',
  S: '&spades;',
  C: '&clubs;',
};
export const REVERSO = 'back';
export const HUECO = 'hueco';

export class Carta {
  #name;
  #palo;
  #valor;
  #index;
  #el = null;
  #use = null;
  #reverso = false;

  constructor(palo, valor, index) {
    this.#palo = palo;
    this.#valor = valor;
    this.#index = index;
  }

  #createEl() {
    const el = document.createElementNS(SVG_NS, 'svg');
    el.setAttribute('xmlns', SVG_NS);
    el.setAttribute('viewBox', '0 0 240 336');
    el.classList.add('card');

    const use = document.createElementNS(SVG_NS, 'use');
    use.setAttribute(
      'href',
      `${SVG_CARD_PREFIX}${this.#reverso ? REVERSO : this.name}`
    );
    el.appendChild(use);

    this.#use = use;
    return el;
  }

  get name() {
    return `${this.#valor}${this.#palo}`;
  }
  get el() {
    return (this.#el ??= this.#createEl());
  }
  get palo() {
    return this.#palo;
  }
  get valor() {
    return this.#valor;
  }
  get color() {
    return this.#palo === 'D' || this.#palo === 'H' ? COLOR.ROJO : COLOR.NEGRO;
  }
  get charPalo() {
    return charPalos[this.#palo];
  }

  get reverso() {
    return this.#reverso;
  }
  set reverso(r) {
    this.#reverso = r;
    this.#use?.setAttribute(
      'href',
      `${SVG_CARD_PREFIX}${r ? REVERSO : this.name}`
    );
  }
}

export class Cartas {
  #cartas = [];

  constructor(full = false) {
    if (full) {
      this.#cartas = palos
        .map((palo) =>
          valores.map((valor, index) => new Carta(palo, valor, index))
        )
        .flat();
    }
  }

  push(cards) {
    if (Array.isArray(cards)) {
      this.#cartas.unshift(...cards);
    } else {
      this.#cartas.unshift(...arguments);
    }
  }

  get top() {
    return this.#cartas[0] ?? null;
  }

  pop(qty) {
    const ret =
      typeof qty === 'undefined'
        ? this.#cartas.shift()
        : this.#cartas.splice(0, qty);
    return ret;
  }

  clear() {
    this.#cartas.forEach((card) => {
      card.el.remove();
    });
    this.#cartas.length = 0;
  }

  get cartas() {
    return this.#cartas;
  }

  shuffle() {
    this.#cartas.sort(() => Math.random() - 0.5);
    return this;
  }
}
