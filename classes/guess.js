import { baraja, charPalos, COLOR } from './baraja.js';
// import { canDropInSomeHueco, canDropInSomePila, onEV, offEV } from './utils.js';
import { TIPOS_CELDA } from './celda.js';

import { Board } from './board.js';

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
    Board.on(Board.JUGADA_AFTER, this.#hideOrGuess.bind(this));
    Board.on(Board.NEWGAME_AFTER, this.#hideOrGuess.bind(this));
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
    console.log('onDemand');
    this.#permanent = false;
    this.#hideHint();

    this.#hintBtn.classList.remove('buttonPressed');
    this.#hintBtn.firstElementChild.src = 'assets/icons/quiz_black_24dp.svg';
  }

  #setPermanent() {
    console.log('permanent');
    this.#permanent = true;
    this.#hintBtn.classList.add('buttonPressed');
    this.#hintBtn.firstElementChild.src = 'assets/icons/quiz_white_24dp.svg';
    this.#guessNext();
  }

  #hideHint() {
    console.log('hide');
    if (this.#permanent) return;
    this.#el.classList.add('notVisible');
  }

  checkAnyKingAround() {
    const cartaVista = baraja[board.vista.top];
    return (
      (cartaVista && cartaVista.valor === 'K') ||
      board.pilas.some((pila, slot) => {
        const length = pila.cards.length;
        if (length) {
          // **** TODO: Can't figure it out yet!!!!
          const firstShown = pila.visible[0];
          for (let index = 0; index < length - (firstShown || 1); index++) {
            const carta = baraja[hueco[index]];
            if (carta && carta.valor === 'K') return true;
          }
        }
        return false;
      })
    );
  }

  guessFirstPilaToBase() {
    const cardsToCheck = [];
    board.pilas.forEach((pila, slot) => {
      if (pila.top) {
        cardsToCheck.push({
          fromPos: TIPOS_CELDA.PILA,
          fromCardId: pila.top,
          fromSlot: slot,
          firstShown: pila.visible[0],
          isLast: pila.cards.length === 1,
        });
      }
    });
    cardsToCheck.sort((a, b) => b.firstShown - a.firstShown);
    cardsToCheck.forEach((move) => {
      const fromCardId = move.fromCardId;
      if (move.isLast) {
        const fromCarta = baraja[fromCardId];
        // except for aces and twos, others only are worth it if there is a king to fill the hueco
        if (fromCarta.index > 1 && !checkAnyKingAround()) return false;
      }
      const toSlot = canDropInSomePila(fromCardId);
      if (toSlot !== false) {
        move.toPos = TIPOS_CELDA.PILA;
        move.toSlot = toSlot;
        move.toCardId = datos.pilas[toSlot][0];
      }
    });
    return cardsToCheck.filter((move) => typeof move.toPos !== 'undefined');
  }

  guessVistaToPila() {
    const cardId = datos.vista[0];
    if (cardId) {
      const toSlot = canDropInSomePila(cardId);
      if (toSlot !== false) {
        return [
          {
            fromCardId: cardId,
            fromPos: TIPOS_CELDA.VISTA,
            fromSlot: 0,
            firstShown: 0,
            toPos: TIPOS_CELDA.PILA,
            toSlot,
            toCardId: datos.pilas[toSlot][0],
          },
        ];
      }
    }
    return [];
  }

  guessVistaToHueco() {
    const cardId = datos.vista[0];
    if (cardId) {
      const toSlot = canDropInSomeHueco(cardId);
      if (toSlot !== false) {
        return [
          {
            fromCardId: cardId,
            fromPos: TIPOS_CELDA.VISTA,
            fromSlot: 0,
            firstShown: 0,
            toPos: TIPOS_CELDA.HUECO,
            toSlot,
            toCardId: datos.huecos[toSlot][0],
          },
        ];
      }
    }
    return [];
  }

  guessHuecoToHueco() {
    const cardsToCheck = [];
    datos.huecos.forEach((hueco, slot) => {
      const firstShown = datos.firstShown[slot];
      const fromIndex = hueco.length - firstShown - 1;
      if (hueco[firstShown]) {
        cardsToCheck.push({
          fromPos: TIPOS_CELDA.HUECO,
          fromCardId: hueco[fromIndex],
          fromSlot: slot,
          firstShown,
          isLast: hueco.length === fromIndex + 1,
        });
      }
    });
    // sort in decreasing order by firstShown so it lists the longest stack to uncover first
    cardsToCheck.sort((a, b) => b.firstShown - a.firstShown);
    cardsToCheck.forEach((move) => {
      const fromCardId = move.fromCardId;
      if (move.isLast) {
        const fromCarta = baraja[fromCardId];
        // except for aces and twos, others only are worth it if there is a king to fill the hueco
        if (
          fromCarta.valor === 'K' ||
          (fromCarta.index > 1 && !checkAnyKingAround())
        )
          return false;
      }
      const toSlot = canDropInSomeHueco(fromCardId);
      if (toSlot !== false) {
        move.toPos = TIPOS_CELDA.HUECO;
        move.toSlot = toSlot;
        move.toCardId = datos.huecos[toSlot][0];
      }
    });
    return cardsToCheck.filter((move) => typeof move.toPos !== 'undefined');
  }

  formatGuess(guess) {
    function formatPos(pos, slot) {
      switch (pos) {
        case TIPOS_CELDA.HUECO:
          return `<td>hueco</td><td align="center">${slot + 1}</td>`;
        case TIPOS_CELDA.VISTA:
          return '<td colspan="2">vista</td>';
        case TIPOS_CELDA.PILA:
          return `<td>pila</td><td align="center">${slot + 1}</td>`;
      }
    }

    function formatCardId(cardId) {
      if (cardId) {
        const carta = baraja[cardId];
        const valor = carta.valor.replace('T', '10');
        const palo = charPalos[carta.palo];
        return (
          valor +
          (carta.color === COLOR.ROJO
            ? `<span style="color: red;">${palo}</span>`
            : palo)
        );
      }
      return 'vacío';
    }
    return `<tr class="desde"><td>De:</td>${formatPos(
      guess.fromPos,
      guess.fromSlot
    )}<td align="right">${formatCardId(guess.fromCardId)}</td></tr>  
  <tr class="hasta"><td>A:</td>${formatPos(
    guess.toPos,
    guess.toSlot
  )}<td align="right">${formatCardId(guess.toCardId)}</td></tr>`;
  }

  #guessNext() {
    console.log('guess next');
    return; // Bypass!!
    const guesses = guessFirstPilaToBase().concat(
      guessHuecoToHueco(),
      guessVistaToPila(),
      guessVistaToHueco()
    );

    this.#el.classList.remove('notVisible');
    this.#el.innerHTML = guesses.length
      ? `<table>
  <tr><th></th><th>Donde</th><th>Columna</th><th>Carta</th></tr>
  ${guesses.map(formatGuess).join('\n')}</table>`
      : '<p class="noHint">No hay sugerencias</p>';
  }
}
