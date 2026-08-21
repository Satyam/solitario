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
            fromCelda: tablon,
            fromCard,
            toCelda: base,
            toCard,
          });
          continue next;
        }
      }
    }
    return moves;
  }

  #vistaToTablones() {
    const moves = [];
    const card = tablero.vista.top;
    if (card && card.index > 0) {
      for (const dest of tablero.tablones) {
        if (dest.canMoveInto(card)) {
          moves.push({
            fromCard: card,
            fromCelda: tablero.vista,
            toCelda: dest,
            toCard: dest.top,
          });
          continue;
        }
      }
    }
    return moves;
  }

  #vistaToBases() {
    const moves = [];
    const card = tablero.vista.top;
    if (card) {
      for (const dest of tablero.bases) {
        if (dest.canMoveInto(card)) {
          moves.push({
            fromCard: card,
            fromCelda: tablero.vista,
            toCelda: dest,
            toCard: dest.top,
          });
          break;
        }
      }
    }
    return moves;
  }

  #tablonToTablon() {
    const moves = [];
    next: for (const fromTablon of tablero.tablones) {
      const fromCard = fromTablon.cartas[fromTablon.numVisible - 1];
      if (!fromCard || fromCard.index === 0) continue;
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
            fromCelda: fromTablon,
            toCelda: toTablon,
            toCard: toTablon.top,
          });
          continue next;
        }
      }
    }
    return moves;
  }

  #guessNext() {
    function formatCelda(celda) {
      return celda.type === TIPOS_CELDA.VISTA
        ? '<td colspan="2">Vista</td>'
        : `<td>${celda.type}</td><td align="center">${celda.slot + 1}</td>`;
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
      return `<tr class="desde"><td>De:</td>${formatCelda(
        guess.fromCelda
      )}<td align="center">${formatCarta(guess.fromCard)}</td></tr>  
  <tr class="hasta"><td>A:</td>${formatCelda(
    guess.toCelda
  )}<td align="center">${formatCarta(guess.toCard)}</td></tr>`;
    }

    const guesses = this.#tablonToBase().concat(
      this.#tablonToTablon(),
      this.#vistaToTablones(),
      this.#vistaToBases()
    );

    guesses.sort(({ fromCelda: celdaA }, { fromCelda: celdaB }) =>
      celdaA.type === TIPOS_CELDA.TABLON && celdaB.type === TIPOS_CELDA.TABLON
        ? celdaB.cartas.length -
          celdaB.numVisible -
          (celdaA.cartas.length - celdaA.numVisible)
        : 0
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
