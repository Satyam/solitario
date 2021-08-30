import { incRondas } from './stats.js';

import {
  SEL,
  EV,
  datos,
  tCardId,
  baraja,
  numHuecos,
  numPilas,
} from './datos.js';

import { renderMazo, renderPila, renderVista, renderHueco } from './render.js';

import { shuffle, fixFirstShown } from './utils.js';

export const initActions = () => {
  // Buttons
  $('#newGame').on('click', () => {
    $(document).trigger(EV.NEWGAME);
  });
  $('#raise').on('click', raiseAll);

  // cards
  $(SEL.MAZO).on('click', dealCard);
  $(SEL.VISTA).on('mousedown', raiseFromVista);
  $(SEL.HUECOS).on('mousedown', raiseFromHueco);

  $(document)
    .on(EV.GAMEOVER, slideDown)
    .on(EV.JUGADA, checkGameover)
    .on(EV.NEWGAME, startNewGame);
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
};

const checkGameover = () => {
  const gameover = datos.pilas.every((pila) => pila.length === 13);
  $('.gameover').toggle(gameover);
  if (gameover) $(document).trigger(EV.GAMEOVER);
};

const dealCard = (ev: JQuery.Event) => {
  $(document).trigger(EV.JUGADA);
  if (datos.mazo.length) {
    datos.vista.unshift(datos.mazo.shift());
  } else {
    datos.mazo = datos.vista.reverse();
    datos.vista = [];
    incRondas();
  }
  renderMazo();
  renderVista();
};

function canDropInPila(fromCardId: tCardId) {
  if (typeof fromCardId === 'undefined') return -1;
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
  return -1;
}

async function vistaToPila(toSlot: number): Promise<boolean> {
  if (toSlot === -1) return false;
  $(document).trigger(EV.JUGADA);
  datos.pilas[toSlot].unshift(datos.vista.shift());
  await animateMove(
    $(SEL.VISTA).find(SEL.TOP),
    $(SEL.PILAS).eq(toSlot).find(SEL.TOP)
  );
  renderPila(toSlot);
  renderVista();

  return true;
}

function raiseFromVista(ev: JQuery.Event) {
  if (ev.buttons === 4) {
    vistaToPila(canDropInPila(datos.vista[0]));
    return false;
  }
}

async function huecoToPila(fromSlot: number, toSlot: number): Promise<boolean> {
  if (toSlot === -1) return false;
  $(document).trigger(EV.JUGADA);
  datos.pilas[toSlot].unshift(datos.huecos[fromSlot].shift());
  await animateMove(
    $(SEL.HUECOS).eq(fromSlot).find(SEL.IMG).last(),
    $(SEL.PILAS).eq(toSlot).find(SEL.TOP)
  );
  fixFirstShown(fromSlot);
  renderHueco(fromSlot);
  renderPila(toSlot);

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
  if (pila.length) {
    $(SEL.PILAS)
      .eq(slot)
      .find(SEL.TOP)
      .effect('bounce', { times: 3 }, Math.random() * 200 + 300, () => {
        pila.shift();
        renderPila(slot);
        slidePilaDown(slot, pila);
      });
  }
}

function slideDown() {
  datos.pilas.forEach((pila, slot) => {
    slidePilaDown(slot, pila);
  });
}
