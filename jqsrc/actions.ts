import {
  SEL,
  datos,
  tCardId,
  baraja,
  numHuecos,
  numPilas,
  tCarta,
} from './datos.js';
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
  $('#raise').on('click', () => {
    console.log(datos);
  });

  // cards
  $(SEL.MAZO).on('click', dealCard);
  $(SEL.VISTA).on('mousedown', vistaToPila);
  $(SEL.HUECOS).on('mousedown', huecoToPila);
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
};

const dealCard = (ev: JQuery.Event) => {
  pushState();
  if (datos.mazo.length) {
    datos.vista.unshift(datos.mazo.shift());
  } else {
    datos.mazo = datos.vista.reverse();
    datos.vista = [];
  }
  renderMazo();
  renderVista();
};

function canDropInPila(fromCarta: tCarta) {
  if (typeof fromCarta === 'undefined') return -1;
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

function vistaToPila(ev: JQuery.Event) {
  if (ev.buttons === 4) {
    const slot = canDropInPila(baraja[datos.vista[0]]);
    if (slot >= 0) {
      pushState();
      datos.pilas[slot].unshift(datos.vista.shift());
      debugger;
      animateMove(
        $(SEL.VISTA).find('img'),
        $(SEL.PILAS).eq(slot).find('img'),
        function () {
          renderPila(slot);
        },
        true
      );
      renderVista();
    }
    // stop propagation
    return false;
  }
}

function huecoToPila(ev: JQuery.Event) {
  if (ev.buttons === 4) {
    const fromSlot = $(this).data('slot');
    const toSlot = canDropInPila(baraja[datos.huecos[fromSlot][0]]);
    if (toSlot >= 0) {
      pushState();
      datos.pilas[toSlot].unshift(datos.huecos[fromSlot].shift());
      const srcEl = $(SEL.HUECOS).eq(fromSlot).find('img').last();
      animateMove(srcEl, $(SEL.PILAS).eq(toSlot).find('img'), function () {
        fixFirstShown(fromSlot);
        renderHueco(fromSlot);
        renderPila(toSlot);
      });
      srcEl.parents('.stack').first().siblings('.short').removeClass('short');
    }
    // stop propagation
    return false;
  }
}

function animateMove(
  srcEl: JQuery,
  destEl: JQuery,
  callback: () => void,
  clone: boolean = false
) {
  const srcPos = srcEl.offset();
  const cloneEl = clone ? srcEl.clone().appendTo(srcEl.parent()) : srcEl;
  cloneEl.css({
    position: 'absolute',
    left: srcPos.left,
    top: srcPos.top,
    zIndex: 10,
  });
  const destPos = destEl.offset();
  cloneEl.animate(
    {
      left: `+=${destPos.left - srcPos.left}`,
      top: `+=${destPos.top - srcPos.top}`,
    },
    {
      duration: 200,
      easing: 'swing',
      complete: () => {
        if (clone) {
          cloneEl.remove();
        } else {
          cloneEl.css({
            position: 'relative',
            left: 0,
            top: 0,
            zIndex: 'auto',
          });
        }
        callback();
      },
    }
  );
}
