import { renderPila, renderVista, renderHueco } from './render.js';
import { POS, SEL, datos, baraja } from './datos.js';
import { pushState } from './undoStack.js';

export const initDrag = () => {
  $(SEL.MAZO).data({
    pos: POS.MAZO,
    slot: 0,
  });
  $(SEL.VISTA).data({
    pos: POS.VISTA,
    slot: 0,
  });
  $(SEL.PILAS).each(function (slot) {
    $(this).data({
      pos: POS.PILA,
      slot,
    });
  });
  $(SEL.HUECOS).each(function (slot) {
    $(this).data({
      pos: POS.HUECO,
      slot,
    });
  });

  $(SEL.DRAGGABLE).draggable({
    helper: 'clone',
  });

  $(SEL.DROPPABLE)
    .droppable({
      accept,
    })
    .on('drop', drop);
};

export const enableDraggable = (el: JQuery, enabled: boolean) => {
  el.find(SEL.DRAGGABLE).draggable(enabled ? 'enable' : 'disable');
};

function accept(source: JQuery) {
  const { pos: fromPos, slot: fromSlot } = $(source).closest(SEL.CELDA).data();

  const fromIndex = $(source).data('index') || 0;
  const { pos: toPos, slot: toSlot } = $(this).data();
  // console.log('accept', { fromPos, fromSlot, fromIndex, toPos, toSlot });

  switch (fromPos) {
    case POS.VISTA: {
      const fromCardId = datos.vista[0];
      const fromCarta = baraja[fromCardId];
      if (!fromCarta) return false;
      // console.log(fromCardId);
      switch (toPos) {
        case POS.PILA: {
          const toCardId = datos.pilas[toSlot][0];
          const toCarta = baraja[toCardId];
          if (toCardId) {
            return (
              toCarta.palo === fromCarta.palo &&
              toCarta.index === fromCarta.index - 1
            );
          } else {
            return fromCarta.valor === 'A';
          }
        }
        case POS.HUECO: {
          const toCardId = datos.huecos[toSlot][0];
          const toCarta = baraja[toCardId];
          if (toCarta) {
            return (
              fromCarta.color !== toCarta.color &&
              fromCarta.index === toCarta.index - 1
            );
          } else {
            return fromCarta.valor === 'K';
          }
        }
        default:
          return false;
      }
    }
    case POS.PILA: {
      const fromCardId = datos.pilas[fromSlot][0];
      const fromCarta = baraja[fromCardId];
      if (!fromCarta) return false;
      switch (toPos) {
        case POS.HUECO: {
          const toCardId = datos.huecos[toSlot][0];
          const toCarta = baraja[toCardId];
          if (toCarta) {
            return (
              fromCarta.color !== toCarta.color &&
              fromCarta.index === toCarta.index - 1
            );
          } else {
            return fromCarta.valor === 'K';
          }
        }
        default:
          return false;
      }
    }
    case POS.HUECO: {
      const fromCardId = datos.huecos[fromSlot][fromIndex];
      const fromCarta = baraja[fromCardId];
      if (!fromCarta) return false;
      switch (toPos) {
        case POS.PILA: {
          if (fromIndex > 0) return false;
          const toCardId = datos.pilas[toSlot][0];
          const toCarta = baraja[toCardId];
          if (toCardId) {
            return (
              fromCarta.palo === toCarta.palo &&
              fromCarta.index === toCarta.index + 1
            );
          } else {
            return fromCarta.valor === 'A';
          }
        }
        case POS.HUECO: {
          const toCardId = datos.huecos[toSlot][0];
          const toCarta = baraja[toCardId];
          return (
            fromCarta.color !== toCarta.color &&
            fromCarta.index === toCarta.index - 1
          );
        }
        default:
          return false;
      }
    }
  }
}

function drop(ev: JQuery.Event, ui: any) {
  const { pos: fromPos, slot: fromSlot } = $(ui.draggable)
    .closest(SEL.CELDA)
    .data();
  const { pos: toPos, slot: toSlot } = $(this).data();
  const fromIndex = $(ui.draggable).data('index') || 0;
  // $(ui.draggable).draggable('disable');
  // $(this).droppable('disable');
  console.log('drop', { fromPos, fromSlot, fromIndex, toPos, toSlot });
  switch (fromPos) {
    case POS.VISTA:
      switch (toPos) {
        case POS.PILA:
          pushState();
          datos.pilas[toSlot].unshift(datos.vista.shift());
          setTimeout(() => {
            renderPila(toSlot);
            renderVista();
          }, 100);
          break;
        case POS.HUECO:
          pushState();
          datos.huecos[toSlot].unshift(datos.vista.shift());
          setTimeout(() => {
            renderVista();
            renderHueco(toSlot);
          }, 100);
          break;
      }
      break;
    case POS.PILA:
      switch (toPos) {
        case POS.HUECO:
          pushState();
          datos.huecos[toSlot].unshift(datos.pilas[fromSlot].shift());
          setTimeout(() => {
            renderPila(fromSlot);
            renderHueco(toSlot);
          }, 100);
          break;
      }
      break;
    case POS.HUECO:
      switch (toPos) {
        case POS.PILA:
          pushState();
          datos.pilas[toSlot].unshift(datos.huecos[fromSlot].shift());
          setTimeout(() => {
            renderHueco(fromSlot);
            renderPila(toSlot);
          }, 100);
          break;

        case POS.HUECO:
          pushState();
          datos.huecos[toSlot].unshift(
            ...datos.huecos[fromSlot].splice(0, fromIndex + 1)
          );
          setTimeout(() => {
            renderHueco(fromSlot);
            renderHueco(toSlot);
          }, 100);
          break;
      }
      const lastCardIndex = datos.huecos[fromSlot].length - 1;
      if (datos.firstShown[fromSlot] > lastCardIndex) {
        datos.firstShown[fromSlot] = lastCardIndex;
      }
      break;
  }
}
