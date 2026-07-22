export class Celda {
  #type = '';
  #slot = 0;
  #el = null;
  #container = null;
  #cards = [];

  constructor(type, slot = 0) {
    this.#type = type;
    this.#slot = slot;

    const el = document.createElement('div');
    el.classList.add('celda', this.#type);

    const container = document.createElement('div');
    container.classList.add('cardContainer');
    el.appendChild(container);

    this.#el = el;
    this.#container = container;
  }
  get type() {
    return this.#type;
  }
  get slot() {
    return this.#slot;
  }
  get el() {
    return this.#el;
  }
  get container() {
    return this.#container;
  }
  update() {
    // To be implemented by subclasses
  }
  push(...cards) {
    this.#cards.unshift(...cards);
    this.update();
  }
  get top() {
    return this.#cards[0] ?? null;
  }
  pop(qty) {
    const ret =
      typeof qty === 'undefined'
        ? this.#cards.shift()
        : this.#cards.slice(0, qty);
    this.update();
    return ret;
  }
}
