import { initStats, incJugadas, incRondas } from './stats.js';

import { SEL, datos, tCardId, baraja, numHuecos, numPilas } from './datos.js';

import {
  renderAll,
  renderMazo,
  renderPila,
  renderVista,
  renderHueco,
} from './render.js';
import { initUndo, pushState } from './undoStack.js';
import { shuffle, fixFirstShown } from './utils.js';

export const initActions = () => {
  // Buttons
  $('#newGame').on('click', startNewGame);
  $('#raise').on('click', raiseAll);

  // cards
  $(SEL.MAZO).on('click', dealCard);
  $(SEL.VISTA).on('mousedown', raiseFromVista);
  $(SEL.HUECOS).on('mousedown', raiseFromHueco);
};

export const startNewGame = (): void => {
  datos.vista = [];
  for (let slot = 0; slot < numPilas; slot++) datos.pilas[slot] = [];

  const cardIds = shuffle<tCardId[]>(Object.keys(baraja) as tCardId[]);

  for (let slot = 0; slot < numHuecos; slot++) {
    datos.huecos[slot] = cardIds.splice(0, slot + 1);
    datos.firstShown[slot] = slot;
  }

  // Place the remaining cards in the mazo.
  datos.mazo = cardIds;

  renderAll();
  initUndo();
  initStats();
};

const dealCard = (ev: JQuery.Event) => {
  pushState();
  if (datos.mazo.length) {
    datos.vista.unshift(datos.mazo.shift());
  } else {
    datos.mazo = datos.vista.reverse();
    datos.vista = [];
    incRondas();
  }
  renderMazo();
  renderVista();
  incJugadas();
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

function vistaToPila(toSlot: number): boolean {
  if (toSlot === -1) return false;
  pushState();
  datos.pilas[toSlot].unshift(datos.vista.shift());
  animateMove(
    $(SEL.VISTA).find('.top'),
    $(SEL.PILAS).eq(toSlot).find('.top'),
    function () {
      renderPila(toSlot);
    }
  );
  renderVista();
  incJugadas();

  return true;
}

function raiseFromVista(ev: JQuery.Event) {
  if (ev.buttons === 4) {
    return vistaToPila(canDropInPila(datos.vista[0]));
  }
}

function huecoToPila(fromSlot: number, toSlot: number): boolean {
  if (toSlot === -1) return false;
  pushState();
  datos.pilas[toSlot].unshift(datos.huecos[fromSlot].shift());
  const srcEl = $(SEL.HUECOS).eq(fromSlot).find('img').last();
  animateMove(srcEl, $(SEL.PILAS).eq(toSlot).find('.top'), function () {
    fixFirstShown(fromSlot);
    renderHueco(fromSlot);
    renderPila(toSlot);
  });
  // srcEl.parents('.stack').first().siblings('.short').removeClass('short');
  incJugadas();
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

function animateMove(srcEl: JQuery, destEl: JQuery, callback: () => void) {
  const srcPos = srcEl.offset();
  srcEl.css({
    position: 'absolute',
    left: srcPos.left,
    top: srcPos.top,
    zIndex: 10,
  });
  const destPos = destEl.offset();
  srcEl.animate(
    {
      left: `+=${destPos.left - srcPos.left}`,
      top: `+=${destPos.top - srcPos.top}`,
    },
    {
      duration: 200,
      easing: 'swing',
      complete: () => {
        srcEl.remove();
        callback();
      },
    }
  );
}

function raiseAll() {
  let found = false;
  do {
    found = datos.huecos.some((hueco, fromSlot) =>
      huecoToPila(fromSlot, canDropInPila(hueco[0]))
    );
    found ||= vistaToPila(canDropInPila(datos.vista[0]));
  } while (found);
}
