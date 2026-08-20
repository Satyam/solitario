// import { baraja, charPalos, COLOR } from './baraja.js';
// // import { canDropInSomeHueco, canDropInSomePila, onEV, offEV } from './utils.js';
import { TIPOS_CELDA } from './celda.js';

import { Tablero } from './tablero.js';

export class Guess {
  #visible = false;
  #permanent = false;
  #el;
  #hintBtn;
  constructor() {
    const el = document.createElement('div');
    el.classList.add('celda', 'guess');
    this.#el = el;

    this.#hintBtn = document.getElementById('hint');
    this.#hintBtn.addEventListener('click', this.#handleClick.bind(this));

    this.#setOnDemand();
    setTimeout(this.#initListeners.bind(this));
  }

  #initListeners() {
    tablero.on(Tablero.JUGADA_AFTER, this.#hideOrGuess.bind(this));
    tablero.on(Tablero.NEWGAME_AFTER, this.#hideOrGuess.bind(this));
    tablero.on(Tablero.UNDO_AFTER, this.#hideOrGuess.bind(this));
    tablero.on(Tablero.REDO_AFTER, this.#hideOrGuess.bind(this));
  }

  get el() {
    return this.#el;
  }

  #hideOrGuess() {
    if (this.#permanent) {
      this.#guessNext();
    } else {
      this.#hideHint();
    }
  }
  #handleClick(ev) {
    if (this.#permanent) {
      this.#setOnDemand();
      if (ev.detail === 1) {
        this.#guessNext();
      }
    } else {
      if (ev.detail === 1) {
        this.#guessNext();
      } else {
        this.#setPermanent();
      }
    }
  }

  #setOnDemand() {
    this.#permanent = false;
    this.#hideHint();

    this.#hintBtn.classList.remove('buttonPressed');
  }

  #setPermanent() {
    this.#permanent = true;
    this.#hintBtn.classList.add('buttonPressed');
    this.#guessNext();
  }

  #hideHint() {
    if (this.#permanent) return;
    this.#el.classList.add('notVisible');
  }

  #checkAnyKingAround() {
    const cartaVista = tablero.vista.top;
    return (
      (cartaVista && cartaVista.valor === 'K') ||
      tablero.tablones.some((tablon, slot) => {
        const visible = tablon.visible;
        return visible.some(
          (carta) =>
            carta.valor === 'K' && visible.length < tablon.cartas.length
        );
      })
    );
  }

  #tablonToBase() {
    const moves = [];
    next: for (const tablon of tablero.tablones) {
      const fromCard = tablon.top;
      if (!fromCard) continue;
      // If there is a single card which is not an ace or two,
      // don't raise it unless thre is a king hanging around which can
      // take the space it frees.
      if (
        tablon.cartas.length === 1 &&
        fromCard.index > 1 &&
        !this.#checkAnyKingAround()
      ) {
        continue;
      }
      for (const base of tablero.bases) {
        const toCard = base.top;
        if (base.canMoveInto(fromCard)) {
          moves.push({
            fromType: tablon.type,
            fromCard,
            fromSlot: tablon.slot,
            toType: base.type,
            toCard,
            toSlot: base.slot,
          });
          continue next;
        }
      }
    }
    return moves;
  }

  #vistaToAny(which) {
    const moves = [];
    const card = tablero.vista.top;
    if (card) {
      for (const dest of which) {
        if (dest.canMoveInto(card)) {
          moves.push({
            fromCard: card,
            fromType: tablero.vista.type,
            fromSlot: 0,
            toType: dest.type,
            toSlot: dest.slot,
            toCard: dest.top,
          });
          if (dest.type === 'base') break;
          else continue;
        }
      }
    }
    return moves;
  }

  #tablonToTablon() {
    const moves = [];
    next: for (const fromTablon of tablero.tablones) {
      for (const fromCard of fromTablon.visible) {
        if (!fromCard) continue;
        if (
          fromTablon.cartas.length === fromTablon.numVisible &&
          fromCard.index > 0 &&
          !this.#checkAnyKingAround()
        ) {
          continue;
        }
        for (const toTablon of tablero.tablones) {
          if (toTablon === fromTablon) continue;
          if (toTablon.canMoveInto(fromCard)) {
            moves.push({
              fromCard,
              fromType: fromTablon.type,
              fromSlot: fromTablon.slot,
              toType: toTablon.type,
              toSlot: toTablon.slot,
              toCard: toTablon.top,
            });
            continue next;
          }
        }
      }
    }
    return moves;
  }

  #guessNext() {
    function formatType(type, slot) {
      switch (type) {
        case TIPOS_CELDA.BASE:
          return `<td>Base</td><td align="center">${slot + 1}</td>`;
        case TIPOS_CELDA.VISTA:
          return '<td colspan="2">Vista</td>';
        case TIPOS_CELDA.TABLON:
          return `<td>Tablón</td><td align="center">${slot + 1}</td>`;
      }
    }

    const colorCSS = {
      negro: 'black',
      rojo: 'red',
    };
    function formatCarta(carta) {
      if (carta) {
        const valor = carta.valor.replace('T', '10');
        const palo = carta.charPalo;
        return `${valor}<span style="color: ${colorCSS[carta.color]};">${palo}</span>`;
      }
      return 'vacío';
    }

    function formatGuess(guess) {
      return `<tr class="desde"><td>De:</td>${formatType(
        guess.fromType,
        guess.fromSlot
      )}<td align="center">${formatCarta(guess.fromCard)}</td></tr>  
  <tr class="hasta"><td>A:</td>${formatType(
    guess.toType,
    guess.toSlot
  )}<td align="center">${formatCarta(guess.toCard)}</td></tr>`;
    }

    const guesses = this.#tablonToBase().concat(
      this.#tablonToTablon(),
      this.#vistaToAny(tablero.tablones),
      this.#vistaToAny(tablero.bases)
    );

    this.#el.classList.remove('notVisible');
    console.dir(guesses);
    this.#el.innerHTML = guesses.length
      ? `<table>
    <tr><th></th><th>Donde</th><th>Col.</th><th>Carta</th></tr>
    ${guesses.map(formatGuess).join('\n')}</table>`
      : '<p class="noHint">No hay sugerencias</p>';
  }
}
