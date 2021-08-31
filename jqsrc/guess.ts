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
  $(document).on(EV.JUGADA_AFTER, guessNext).on(EV.NEWGAME_AFTER, guessNext);
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
        return `hueco, columna ${slot + 1}`;
      case POS.VISTA:
        return 'vista';
      case POS.PILA:
        return `pila, columna ${slot + 1}`;
    }
  }
  return `<li>Mover ${guess.fromCardId} en ${formatPos(
    guess.fromPos,
    guess.fromSlot
  )} 
  sobre ${guess.toCardId || 'vacío'} en ${formatPos(
    guess.toPos,
    guess.toSlot
  )}</li>`;
}
function guessNext() {
  const guesses: tGuess[] = guessFirstHuecoToPila().concat(
    guessHuecoToHueco(),
    guessVistaToPila(),
    guessVistaToHueco()
  );

  $('.guess').html(`<ul>${guesses.map(formatGuess).join('\n')}</ul>`);
}
