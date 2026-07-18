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

  // TODO
  // $(SEL.DROPPABLE)
  //   .droppable({
  //     accept,
  //     tolerance: 'pointer',
  //   })
  //   .on('drop', drop);
};

let sourceEl = null;
let sourceCeldaEl = null;
let cardId = null;
let start = null;
let pos = null;
let slot = null;

document.addEventListener('dragstart', (ev) => {
  // console.log(ev.target);
  sourceEl = ev.target;
  sourceCeldaEl = sourceEl.closest('.celda');
  cardId = sourceEl.dataset.cardid;
  start = sourceEl.dataset.start;
  const celda = sourceEl.closest('.celda');
  pos = celda.dataset.pos;
  slot = celda.dataset.slot;
  log('dragStart', ev);
  sourceEl.classList.add('dragging');
});

document.addEventListener('dragover', (ev) => {
  const celdaEl = ev.target.closest('.celda');
  if (
    celdaEl &&
    celdaEl !== sourceCeldaEl &&
    celdaEl.classList.contains('droppable')
  ) {
    log('dragover', ev);
    ev.preventDefault();
  }
});

document.addEventListener('drop', (ev) => {
  const celdaEl = ev.target.closest('.celda');
  if (
    celdaEl &&
    celdaEl !== sourceCeldaEl &&
    celdaEl.classList.contains('droppable')
  ) {
    log('drop', ev);
    ev.preventDefault();
  } else {
    console.log('no-drop', ev.target);
  }
});

document.addEventListener('dragend', (ev) => {
  log('dragend', ev);
  console.log('success', ev.dataTransfer.dropEffect !== 'none');
  ev.target.classList.remove('dragging');
});

function log(name, ev) {
  const celdaEl = ev.target.closest('.celda');
  console.log(
    name,
    `${ev.target.nodeName}.${ev.target.className}=>${celdaEl ? celdaEl.className : '?'}`,
    {
      cardId,
      start,
      pos,
      slot,
    }
  );
}

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
