import { POS, EV, tCardId, datos } from './datos.js';
import { canDropInSomeHueco, canDropInSomePila } from './utils.js';
type tGuess = {
  fromPos: POS;
  fromCardId: tCardId;
  fromSlot: number;
  fromIndex: number;
  toPos?: POS;
  toSlot?: number;
  toCardId?: tCardId;
};

export function initGuess() {
  $('#hint').on('click', guessNext);
  $(document).on(EV.JUGADA_AFTER, hideHint).on(EV.NEWGAME_AFTER, hideHint);
}
function hideHint() {
  $('.guess').css('visibility', 'hidden');
}
function guessFirstHuecoToPila(): tGuess[] {
  const cardsToCheck: tGuess[] = [];
  datos.huecos.forEach((hueco, slot) => {
    if (hueco[0]) {
      cardsToCheck.push({
        fromPos: POS.HUECO,
        fromCardId: hueco[0],
        fromSlot: slot,
        fromIndex: hueco.length,
      });
    }
  });
  cardsToCheck.sort((a: tGuess, b: tGuess) => a.fromIndex - b.fromIndex);
  cardsToCheck.forEach((move) => {
    const toSlot = canDropInSomePila(move.fromCardId);
    if (toSlot !== false) {
      move.toPos = POS.PILA;
      move.toSlot = toSlot;
      move.toCardId = datos.pilas[toSlot][0];
    }
  });
  return cardsToCheck.filter((move) => typeof move.toPos !== 'undefined');
}

function guessVistaToPila(): tGuess[] {
  const cardId = datos.vista[0];
  if (cardId) {
    const toSlot = canDropInSomePila(cardId);
    if (toSlot !== false) {
      return [
        {
          fromCardId: cardId,
          fromPos: POS.VISTA,
          fromSlot: 0,
          fromIndex: 0,
          toPos: POS.PILA,
          toSlot,
          toCardId: datos.pilas[toSlot][0],
        },
      ];
    }
  }
  return [];
}

function guessVistaToHueco(): tGuess[] {
  const cardId = datos.vista[0];
  if (cardId) {
    const toSlot = canDropInSomeHueco(cardId);
    if (toSlot !== false) {
      return [
        {
          fromCardId: cardId,
          fromPos: POS.VISTA,
          fromSlot: 0,
          fromIndex: 0,
          toPos: POS.HUECO,
          toSlot,
          toCardId: datos.huecos[toSlot][0],
        },
      ];
    }
  }
  return [];
}

function guessHuecoToHueco(): tGuess[] {
  const cardsToCheck: tGuess[] = [];
  datos.huecos.forEach((hueco, slot) => {
    const firstShown = datos.firstShown[slot];
    const fromIndex = hueco.length - firstShown - 1;
    if (hueco[firstShown]) {
      cardsToCheck.push({
        fromPos: POS.HUECO,
        fromCardId: hueco[fromIndex],
        fromSlot: slot,
        fromIndex,
      });
    }
  });
  cardsToCheck.sort((a: tGuess, b: tGuess) => a.fromIndex - b.fromIndex);
  cardsToCheck.forEach((move) => {
    const toSlot = canDropInSomeHueco(move.fromCardId);
    if (toSlot !== false) {
      move.toPos = POS.HUECO;
      move.toSlot = toSlot;
      move.toCardId = datos.huecos[toSlot][0];
    }
  });
  return cardsToCheck.filter((move) => typeof move.toPos !== 'undefined');
}

function formatGuess(guess: tGuess): string {
  function formatPos(pos: POS, slot?: number) {
    switch (pos) {
      case POS.HUECO:
        return `<td>hueco</td><td>${slot + 1}</td>`;
      case POS.VISTA:
        return '<td colspan="2">vista</td>';
      case POS.PILA:
        return `<td>pila</td><td>${slot + 1}</td>`;
    }
  }
  return `<tr class="desde"><td>De:</td>${formatPos(
    guess.fromPos,
    guess.fromSlot
  )}<td>${guess.fromCardId}</td></tr>  
  <tr class="hasta"><td>A:</td>${formatPos(guess.toPos, guess.toSlot)}<td>${
    guess.toCardId || 'vacío'
  }</td></tr>`;
}

function guessNext() {
  const guesses: tGuess[] = guessFirstHuecoToPila().concat(
    guessHuecoToHueco(),
    guessVistaToPila(),
    guessVistaToHueco()
  );

  $('.guess')
    .css('visibility', 'visible')
    .html(
      guesses.length
        ? `<table>
  <tr><th></th><th>Donde</th><th>Columna</th><th>Carta</th></tr>
  ${guesses.map(formatGuess).join('\n')}</table>`
        : '<p class="noHint">No hay sugerencias</p>'
    );
}
