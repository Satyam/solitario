import { renderPila, renderVista, renderHueco, cardImg } from './render.js';
import { POS, SEL, datos, baraja, HUECO } from './datos.js';
import { pushState } from './undoStack.js';
import { fixFirstShown } from './utils.js';

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

  setDraggable($(SEL.DRAGGABLE));

  $(SEL.DROPPABLE)
    .droppable({
      accept,
    })
    .on('drop', drop);
};

export const enableDraggable = (el: JQuery, enabled: boolean) => {
  el.find(SEL.DRAGGABLE).draggable(enabled ? 'enable' : 'disable');
};
export const setDraggable = (el: JQuery, dragOriginal?: boolean) => {
  el.draggable({
    helper: dragOriginal
      ? 'clone'
      : () => {
          return $(cardImg(HUECO)).appendTo('body').get(0);
        },
    zIndex: 10,
    scroll: false,
    start: function (event, ui) {
      console.log($(this).get(0).outerHTML, ui.helper.get(0).outerHTML);
      ui.helper.attr(
        'src',
        $(this).find('img').add($(this).filter('img')).attr('src')
      );
    },
  });
};

function accept(source: JQuery) {
  const { pos: fromPos, slot: fromSlot } = $(source).closest(SEL.CELDA).data();

  const fromIndex = $(source).data('start') || 0;
  const { pos: toPos, slot: toSlot } = $(this).data();
  // console.log('accept', { fromPos, fromSlot, fromIndex, toPos, toSlot });

  switch (fromPos) {
    case POS.VISTA: {
      const fromCardId = datos.vista[0];
      if (!fromCardId) return false;
      const fromCarta = baraja[fromCardId];
      // console.log(fromCardId);
      switch (toPos) {
        case POS.PILA: {
          const toCardId = datos.pilas[toSlot][0];
          if (toCardId) {
            const toCarta = baraja[toCardId];
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
          if (toCardId) {
            const toCarta = baraja[toCardId];
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
      if (!fromCardId) return false;
      const fromCarta = baraja[fromCardId];
      switch (toPos) {
        case POS.HUECO: {
          const toCardId = datos.huecos[toSlot][0];
          if (toCardId) {
            const toCarta = baraja[toCardId];
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
      if (!fromCardId) return false;
      const fromCarta = baraja[fromCardId];
      switch (toPos) {
        case POS.PILA: {
          if (fromIndex > 0) return false;
          const toCardId = datos.pilas[toSlot][0];
          if (toCardId) {
            const toCarta = baraja[toCardId];
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
          if (toCardId) {
            const toCarta = baraja[toCardId];
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
  }
  console.error('should not be here');
}

function drop(ev: JQuery.Event, ui: any) {
  const { pos: fromPos, slot: fromSlot } = $(ui.draggable)
    .closest(SEL.CELDA)
    .data();
  const { pos: toPos, slot: toSlot } = $(this).data();
  const fromIndex = $(ui.draggable).data('start') || 0;
  // $(ui.draggable).draggable('disable');
  // $(this).droppable('disable');
  // console.log('drop', { fromPos, fromSlot, fromIndex, toPos, toSlot });
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
      fixFirstShown(fromSlot);
      break;
  }
  $('.ui-droppable-active').removeClass('ui-droppable-active');
}
