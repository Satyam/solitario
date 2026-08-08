const SVG_NS = 'http://www.w3.org/2000/svg';
const SVG_CARD_PREFIX = 'assets/cards.svg#card_';

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
  #palo;
  #index;
  #el = null;
  #use = null;
  #reverso = false;

  constructor(palo, index) {
    this.#palo = palo;
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
    return `${this.valor}${this.#palo}`;
  }
  get el() {
    return (this.#el ??= this.#createEl());
  }
  get hasEl() {
    return !!this.#el;
  }
  get palo() {
    return this.#palo;
  }
  get valor() {
    return valores[this.#index];
  }
  get index() {
    return this.#index;
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

// I don't want to extend Array with Cartas because most methods won't ever apply
// and I don't want to make false assumptions on similarly named methods.
export class Cartas {
  #cartas = [];

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

  pop(qty = 1) {
    return qty === 1 ? this.#cartas.shift() : this.#cartas.splice(0, qty);
  }

  clear() {
    if (this.#cartas.length) {
      tablero.baraja.push(this.#cartas);
      this.#cartas.length = 0;
    }
  }

  get cartas() {
    return this.#cartas;
  }
}

export class Baraja {
  #cartas = {};

  constructor() {
    for (const palo of palos) {
      for (let index = 0; index < valores.length; index++) {
        const carta = new Carta(palo, index);
        this.#cartas[carta.name] = carta;
      }
    }
  }

  pullCarta(name) {
    const carta = this.#cartas[name];
    if (carta) {
      delete this.#cartas[name];
      return carta;
    }
    return null;
  }

  pullCartas(names) {
    return Array.isArray(names)
      ? names.map((name) => this.pullCarta(name))
      : [this.pullCarta(names)];
  }

  pullRandom(qty) {
    const names = Object.keys(this.#cartas).sort(() => Math.random() - 0.5);
    return this.pullCartas(qty ? names.slice(0, qty) : names);
  }

  push(cartas) {
    const p = (carta) => {
      this.#cartas[carta.name] = carta;
      if (carta.hasEl) carta.el.parentElement?.removeChild(carta.el);
    };
    if (Array.isArray(cartas)) {
      cartas.forEach(p);
    } else {
      p(cartas);
    }
  }

  get length() {
    return Object.keys(this.#cartas).length;
  }
}
