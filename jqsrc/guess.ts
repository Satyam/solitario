import { POS, EV, tCardId, datos, baraja } from './datos.js';
import { canDropInSomeHueco, canDropInSomePila } from './utils.js';
type tGuess = {
  fromPos: POS;
  fromCardId: tCardId;
  fromSlot: number;
  firstShown: number;
  isLast?: boolean;
  toPos?: POS;
  toSlot?: number;
  toCardId?: tCardId;
};

let guessOn: boolean = false;

export function initGuess() {
  const setOnDemand = () => {
    guessOn = false;
    hideHint();
    $('#hint')
      .on('click', guessNext)
      .removeClass('buttonPressed')
      .find('img')
      .attr('src', 'assets/icons/quiz_black_24dp.svg');
    $(document)
      .on(EV.JUGADA_AFTER, hideHint)
      .on(EV.NEWGAME_AFTER, hideHint)
      .off(EV.JUGADA_AFTER, guessNext)
      .off(EV.NEWGAME_AFTER, guessNext);
  };

  function setPermanent() {
    guessOn = true;
    $('#hint')
      .addClass('buttonPressed')
      .find('img')
      .attr('src', 'assets/icons/quiz_white_24dp.svg');
    guessNext();
    $(document)
      .off(EV.JUGADA_AFTER, hideHint)
      .off(EV.NEWGAME_AFTER, hideHint)
      .on(EV.JUGADA_AFTER, guessNext)
      .on(EV.NEWGAME_AFTER, guessNext);
  }

  $('#hint').on('dblclick', () => {
    if (guessOn) setOnDemand();
    else setPermanent();
  });
  setOnDemand();
}

function hideHint() {
  if (guessOn) return;
  $('.guess').css('visibility', 'hidden');
}

function checkAnyKingAround() {
  const cartaPila = baraja[datos.vista[0]];
  return (
    (cartaPila && cartaPila.valor === 'K') ||
    datos.huecos.some((hueco, slot) => {
      const length = hueco.length;
      if (length) {
        const firstShown = datos.firstShown[slot];
        for (let index = 0; index < length - (firstShown || 1); index++) {
          const carta = baraja[hueco[index]];
          if (carta && carta.valor === 'K') return true;
        }
      }
      return false;
    })
  );
}

function guessFirstHuecoToPila(): tGuess[] {
  const cardsToCheck: tGuess[] = [];
  datos.huecos.forEach((hueco, slot) => {
    if (hueco[0]) {
      cardsToCheck.push({
        fromPos: POS.HUECO,
        fromCardId: hueco[0],
        fromSlot: slot,
        firstShown: datos.firstShown[slot],
        isLast: hueco.length === 1,
      });
    }
  });
  cardsToCheck.sort((a: tGuess, b: tGuess) => b.firstShown - a.firstShown);
  cardsToCheck.forEach((move) => {
    const fromCardId = move.fromCardId;
    if (move.isLast) {
      const fromCarta = baraja[fromCardId];
      // except for aces and twos, others only are worth it if there is a king to fill the hueco
      if (fromCarta.index > 1 && !checkAnyKingAround()) return false;
    }
    const toSlot = canDropInSomePila(fromCardId);
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
          firstShown: 0,
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
          firstShown: 0,
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
        firstShown,
        isLast: hueco.length === fromIndex + 1,
      });
    }
  });
  // sort in decreasing order by firstShown so it lists the longest stack to uncover first
  cardsToCheck.sort((a: tGuess, b: tGuess) => b.firstShown - a.firstShown);
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
