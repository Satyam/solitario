import { incRondas } from './stats.js';

import {
  SEL,
  EV,
  datos,
  tCardId,
  baraja,
  numHuecos,
  numPilas,
  POS,
} from './datos.js';

import { renderMazo, renderPila, renderVista, renderHueco } from './render.js';

import { shuffle, fixFirstShown } from './utils.js';

type tCanDrop = number | false;

export const initActions = () => {
  // Buttons
  $('#newGame').on('click', () => {
    $(document).trigger(EV.NEWGAME_BEFORE);
  });
  $('#raise').on('click', raiseAll);

  // cards
  $(SEL.MAZO).on('click', dealCard);
  $(SEL.VISTA).on('mousedown', raiseFromVista);
  $(SEL.HUECOS).on('mousedown', raiseFromHueco);

  $(document)
    .on(EV.GAMEOVER_BEFORE, slideDown)
    .on(EV.JUGADA_AFTER, checkGameover)
    .on(EV.JUGADA_AFTER, guessNext)
    .on(EV.NEWGAME_BEFORE, startNewGame)
    .on(EV.NEWGAME_AFTER, guessNext)
    .on(EV.NEWGAME_AFTER, checkGameover);
};

const startNewGame = (): void => {
  datos.vista = [];
  for (let slot = 0; slot < numPilas; slot++) datos.pilas[slot] = [];

  const cardIds = shuffle<tCardId[]>(Object.keys(baraja) as tCardId[]);

  for (let slot = 0; slot < numHuecos; slot++) {
    datos.huecos[slot] = cardIds.splice(0, slot + 1);
    datos.firstShown[slot] = slot;
  }

  // Place the remaining cards in the mazo.
  datos.mazo = cardIds;

  $(document).trigger(EV.NEWGAME_AFTER);
};

const checkGameover = () => {
  const gameover = datos.pilas.every((pila) => pila.length === 13);
  $('.gameover').toggle(gameover);
  if (gameover) $(document).trigger(EV.GAMEOVER_BEFORE);
};

const dealCard = (ev: JQuery.Event) => {
  $(document).trigger(EV.JUGADA_BEFORE);
  if (datos.mazo.length) {
    datos.vista.unshift(datos.mazo.shift());
  } else {
    datos.mazo = datos.vista.reverse();
    datos.vista = [];
    incRondas();
  }
  renderMazo();
  renderVista();
  $(document).trigger(EV.JUGADA_AFTER);
};

function canDropInPila(fromCardId: tCardId): tCanDrop {
  if (typeof fromCardId === 'undefined') return false;
  const fromCarta = baraja[fromCardId];
  for (let slot = 0; slot < numPilas; slot++) {
    const toCarta = baraja[datos.pilas[slot][0]];
    if (toCarta) {
      if (
        fromCarta.palo === toCarta.palo &&
        fromCarta.index === toCarta.index + 1
      )
        return slot;
    } else {
      if (fromCarta.valor === 'A') return slot;
    }
  }
  return false;
}

function canDropInHueco(fromCardId: tCardId): tCanDrop {
  if (typeof fromCardId === 'undefined') return false;
  const fromCarta = baraja[fromCardId];
  for (let toSlot = 0; toSlot < numHuecos; toSlot++) {
    const toCardId = datos.huecos[toSlot][0];
    if (toCardId) {
      const toCarta = baraja[toCardId];
      if (
        fromCarta.color !== toCarta.color &&
        fromCarta.index === toCarta.index - 1
      ) {
        return toSlot;
      }
    } else {
      if (fromCarta.valor === 'K') return toSlot;
    }
  }
  return false;
}

async function vistaToPila(toSlot: tCanDrop): Promise<boolean> {
  if (toSlot === false) return false;
  $(document).trigger(EV.JUGADA_BEFORE);
  datos.pilas[toSlot].unshift(datos.vista.shift());
  await animateMove(
    $(SEL.VISTA).find(SEL.TOP),
    $(SEL.PILAS).eq(toSlot).find(SEL.TOP)
  );
  renderPila(toSlot);
  renderVista();
  $(document).trigger(EV.JUGADA_AFTER);

  return true;
}

function raiseFromVista(ev: JQuery.Event) {
  if (ev.buttons === 4) {
    vistaToPila(canDropInPila(datos.vista[0]));
    return false;
  }
}

async function huecoToPila(
  fromSlot: number,
  toSlot: tCanDrop
): Promise<boolean> {
  if (toSlot === false) return false;
  $(document).trigger(EV.JUGADA_BEFORE);
  datos.pilas[toSlot].unshift(datos.huecos[fromSlot].shift());
  await animateMove(
    $(SEL.HUECOS).eq(fromSlot).find(SEL.IMG).last(),
    $(SEL.PILAS).eq(toSlot).find(SEL.TOP)
  );
  fixFirstShown(fromSlot);
  renderHueco(fromSlot);
  renderPila(toSlot);
  $(document).trigger(EV.JUGADA_AFTER);

  return true;
}

function raiseFromHueco(ev: JQuery.Event) {
  if (ev.buttons === 4) {
    const fromSlot = $(this).data('slot');
    const toSlot = canDropInPila(datos.huecos[fromSlot][0]);
    huecoToPila(fromSlot, toSlot);
    // stop propagation
    return false;
  }
}

function animateMove(srcEl: JQuery, destEl: JQuery): Promise<void> {
  return new Promise((resolve) => {
    const srcPos = srcEl.offset();
    srcEl.css({
      position: 'relative',
      zIndex: 10,
    });
    const destPos = destEl.offset();
    srcEl.animate(
      {
        left: `+=${destPos.left - srcPos.left}`,
        top: `+=${destPos.top - srcPos.top}`,
      },
      {
        duration: 300,
        easing: 'swing',
        complete: () => {
          srcEl.remove();
          resolve();
        },
      }
    );
  });
}

async function raiseAll() {
  loop: while (true) {
    if (await vistaToPila(canDropInPila(datos.vista[0]))) continue;
    const huecos = datos.huecos;
    const l = huecos.length;
    for (let fromSlot = 0; fromSlot < l; fromSlot++) {
      if (await huecoToPila(fromSlot, canDropInPila(huecos[fromSlot][0])))
        continue loop;
    }
    break;
  }
}

function slidePilaDown(slot: number, pila: tCardId[]) {
  return new Promise((resolve) => {
    if (pila.length) {
      $(SEL.PILAS)
        .eq(slot)
        .find(SEL.TOP)
        .effect('bounce', { times: 3 }, Math.random() * 200 + 300, () => {
          pila.shift();
          renderPila(slot);
          resolve(slidePilaDown(slot, pila));
        });
    } else {
      resolve(true);
    }
  });
}

function slideDown() {
  Promise.all(datos.pilas.map((pila, slot) => slidePilaDown(slot, pila))).then(
    () => {
      $(document).trigger(EV.GAMEOVER_AFTER);
    }
  );
}

// type tCardToCheck = [tCardId, number?, number?];
type tGuess = {
  fromPos: POS;
  fromCardId: tCardId;
  fromSlot: number;
  fromIndex: number;
  toPos?: POS;
  toSlot?: number;
  toCardId?: tCardId;
};

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
    const toSlot = canDropInPila(move.fromCardId);
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
    const toSlot = canDropInPila(cardId);
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
    const toSlot = canDropInHueco(cardId);
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
    const toSlot = canDropInHueco(move.fromCardId);
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
