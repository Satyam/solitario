import { renderPila, renderVista, renderHueco } from './render.js';
import { POS, SEL, EV, datos } from './datos.js';
import { canDropInPila, canDropInHueco } from './utils.js';

export const initDrag = () => {
  let el = document.querySelector(SEL.MAZO);
  el.dataset.pos = POS.MAZO;
  el.dataset.slot = 0;

  el = document.querySelector(SEL.VISTA);
  el.dataset.pos = POS.VISTA;
  el.dataset.slot = 0;

  document.querySelectorAll(SEL.PILAS).forEach((el, slot) => {
    el.dataset.pos = POS.PILA;
    el.dataset.slot = slot;
  });
  document.querySelectorAll(SEL.HUECOS).forEach((el, slot) => {
    el.dataset.pos = POS.HUECO;
    el.dataset.slot = slot;
  });

  // document.querySelectorAll('.droppable').forEach((el, i) => {
  //   console.log('v', i, el.nodeName);
  //   const attrs = el.attributes;
  //   for (let i = 0; i < attrs.length; i++) {
  //     console.log(attrs.item(i).name, '=', attrs.item(i).value);
  //   }
  // });

  // document.querySelectorAll('.draggable').forEach((el, i) => {
  //   console.log('^', i, el.nodeName);
  //   const attrs = el.attributes;
  //   for (let i = 0; i < attrs.length; i++) {
  //     console.log(attrs.item(i).name, '=', attrs.item(i).value);
  //   }
  //   el.draggable = true;
  // });

  // document.querySelectorAll('.droppable').forEach(el =>
  //   el.addEventListener('dragover', ev => {
  //     console.log('-------------');
  //     const t = ev.target;
  //     console.log(t.nodeName, t.className);
  //     const container = t.closest('.droppable');
  //     if (container) {
  //       console.log(container.nodeName, container.className);
  //       const attrs = container.attributes;
  //       for (let i = 0; i < attrs.length; i++) {
  //         console.log(attrs.item(i).name, '=', attrs.item(i).value);
  //       }
  //       ev.preventDefault();
  //     }
  //   })
  // );
  document.querySelectorAll(SEL.DRAGGABLE).forEach(el => setDraggable(el));
  // TODO
  // $(SEL.DROPPABLE)
  //   .droppable({
  //     accept,
  //     tolerance: 'pointer',
  //   })
  //   .on('drop', drop);
};

export const enableDraggable = (el, enabled) => {
  console.log('enableDraggable', el.nodeName, el.className, enabled);
  el.draggable = enabled;
  // debugger;
  // el.find(SEL.DRAGGABLE).draggable(enabled ? 'enable' : 'disable');
};

export const setDraggable = el => {
  // debugger;
  // el.draggable({
  //   zIndex: 100,
  //   scroll: false,
  //   revert: 'invalid',
  //   revertDuration: 50,
  // });
};

function accept(source) {
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

function drop(ev, ui) {
  const { pos: fromPos, slot: fromSlot } = ui.draggable
    .closest(SEL.CELDA)
    .data();
  const { pos: toPos, slot: toSlot } = $(this).data();
  const fromIndex = ui.draggable.data('start') || 0;
  fireEV(EV.JUGADA_BEFORE);
  ui.helper.remove();
  switch (fromPos) {
    case POS.VISTA:
      switch (toPos) {
        case POS.PILA:
          datos.pilas[toSlot].unshift(datos.vista.shift());
          renderPila(toSlot);
          renderVista();
          break;
        case POS.HUECO:
          datos.huecos[toSlot].unshift(datos.vista.shift());
          renderVista();
          renderHueco(toSlot);
          break;
      }
      break;
    case POS.PILA:
      switch (toPos) {
        case POS.HUECO:
          datos.huecos[toSlot].unshift(datos.pilas[fromSlot].shift());
          renderPila(fromSlot);
          renderHueco(toSlot);
          break;
      }
      break;
    case POS.HUECO:
      switch (toPos) {
        case POS.PILA:
          datos.pilas[toSlot].unshift(datos.huecos[fromSlot].shift());
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
  fireEV(EV.JUGADA_AFTER);
  $('.ui-droppable-active').removeClass('ui-droppable-active');
}
