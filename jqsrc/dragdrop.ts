import { POS, SEL, datos, baraja } from './datos.js';

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
      switch (toPos) {
        case POS.PILA: {
          const toCardId = datos.pilas[toSlot][0];
          const toCarta = baraja[toCardId];
          if (toCardId) {
            return (
              toCarta.color === fromCarta.color &&
              toCarta.index === fromCarta.index + 1
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
      switch (toPos) {
        case POS.PILA: {
          if (fromIndex > 0) return false;
          const toCardId = datos.pilas[toSlot][0];
          const toCarta = baraja[toCardId];
          if (toCardId) {
            return (
              fromCarta.color === toCarta.color &&
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
  console.log('drop', { fromPos, fromSlot, toPos, toSlot });
}
