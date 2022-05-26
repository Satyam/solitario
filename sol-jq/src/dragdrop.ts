import { renderPila, renderVista, renderHueco } from './render.js';
import { POS, SEL, EV, datos } from './datos.js';
import { canDropInPila, canDropInHueco } from './utils.js';

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
      tolerance: 'pointer',
    })
    .on('drop', drop);
};

export const enableDraggable = (el: JQuery, enabled: boolean) => {
  el.find(SEL.DRAGGABLE).draggable(enabled ? 'enable' : 'disable');
};

export const setDraggable = (el: JQuery) => {
  el.draggable({
    zIndex: 100,
    scroll: false,
    revert: 'invalid',
    revertDuration: 50,
  });
};

function accept(this: JQuery<HTMLElement>, source: JQuery) {
  const celda = source.closest(SEL.CELDA);
  if (celda.length === 0) return false;
  const { pos: fromPos, slot: fromSlot } = celda.data();

  const fromIndex = source.data('start') || 0;
  const { pos: toPos, slot: toSlot } = $(this).data();
  switch (fromPos) {
    case POS.VISTA: {
      const fromCardId = datos.vista[0];
      if (!fromCardId) return false;
      switch (toPos) {
        case POS.PILA:
          return canDropInPila(fromCardId, toSlot);
        case POS.HUECO:
          return canDropInHueco(fromCardId, toSlot);
        default:
          return false;
      }
    }
    case POS.PILA: {
      const fromCardId = datos.pilas[fromSlot][0];
      if (!fromCardId) return false;
      switch (toPos) {
        case POS.HUECO:
          return canDropInHueco(fromCardId, toSlot);
        default:
          return false;
      }
    }
    case POS.HUECO: {
      const fromCardId = datos.huecos[fromSlot][fromIndex];
      if (!fromCardId) return false;
      switch (toPos) {
        case POS.PILA:
          if (fromIndex > 0) return false;
          return canDropInPila(fromCardId, toSlot);
        case POS.HUECO:
          return canDropInHueco(fromCardId, toSlot);
        default:
          return false;
      }
    }
  }
  console.error('should not be here');
}

function drop(ev: JQuery.Event, ui: any) {
  const { pos: fromPos, slot: fromSlot } = ui.draggable
    .closest(SEL.CELDA)
    .data();
  const { pos: toPos, slot: toSlot } = $(this).data();
  const fromIndex = ui.draggable.data('start') || 0;
  $(document).trigger(EV.JUGADA_BEFORE);
  ui.helper.remove();
  switch (fromPos) {
    case POS.VISTA:
      switch (toPos) {
        case POS.PILA:
          datos.pilas[toSlot].unshift(datos.vista.shift()!);
          renderPila(toSlot);
          renderVista();
          break;
        case POS.HUECO:
          datos.huecos[toSlot].unshift(datos.vista.shift()!);
          renderVista();
          renderHueco(toSlot);
          break;
      }
      break;
    case POS.PILA:
      switch (toPos) {
        case POS.HUECO:
          datos.huecos[toSlot].unshift(datos.pilas[fromSlot].shift()!);
          renderPila(fromSlot);
          renderHueco(toSlot);
          break;
      }
      break;
    case POS.HUECO:
      switch (toPos) {
        case POS.PILA:
          datos.pilas[toSlot].unshift(datos.huecos[fromSlot].shift()!);
          renderHueco(fromSlot);
          renderPila(toSlot);
          break;

        case POS.HUECO:
          datos.huecos[toSlot].unshift(
            ...datos.huecos[fromSlot].splice(0, fromIndex + 1)
          );
          renderHueco(fromSlot);
          renderHueco(toSlot);
          break;
      }
      break;
  }
  $(document).trigger(EV.JUGADA_AFTER);

  $('.ui-droppable-active').removeClass('ui-droppable-active');
}
