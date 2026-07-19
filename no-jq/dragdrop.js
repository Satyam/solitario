import { renderPila, renderVista, renderHueco } from './render.js';
import { POS, SEL, EV, datos } from './datos.js';
import { canDropInPila, canDropInHueco, fireEV } from './utils.js';

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
};

let fromEl = null;
let fromCeldaEl = null;
let fromCardId = null;
let fromIndex = null;
let fromPos = null;
let fromSlot = null;

document.addEventListener('dragstart', (ev) => {
  fromEl = ev.target;
  fromCeldaEl = fromEl.closest('.celda');
  fromCardId = fromEl.dataset.cardid;
  fromIndex = parseInt(fromEl.dataset.start, 10);
  fromPos = fromCeldaEl.dataset.pos;
  fromSlot = parseInt(fromCeldaEl.dataset.slot, 10);
  fromEl.classList.add('dragging');
  checkDropTargets();
});

document.addEventListener('dragover', (ev) => {
  const celdaEl = ev.target.closest('.celda');
  if (
    celdaEl &&
    celdaEl !== fromCeldaEl &&
    celdaEl.classList.contains('droppable')
  ) {
    ev.preventDefault();
  }
});

document.addEventListener('drop', (ev) => {
  const celdaEl = ev.target.closest('.celda');
  if (
    celdaEl &&
    celdaEl !== fromCeldaEl &&
    celdaEl.classList.contains('droppable')
  ) {
    drop(celdaEl.dataset.pos, celdaEl.dataset.slot);
    ev.preventDefault();
  }
});

document.addEventListener('dragend', (ev) => {
  ev.target.classList.remove('dragging');
  clearDropTargets();
  fromEl = null;
  fromCeldaEl = null;
  fromCardId = null;
  fromIndex = null;
  fromPos = null;
  fromSlot = null;
});

function checkDropTargets() {
  document.querySelectorAll('.droppable').forEach((dropEl) => {
    const toPos = dropEl.dataset.pos;
    const toSlot = dropEl.dataset.slot;
    if (accept(toPos, toSlot)) {
      dropEl.classList.add('droppable-active');
    }
  });
}

function clearDropTargets() {
  document.querySelectorAll('.droppable').forEach((dropEl) => {
    dropEl.classList.remove('droppable-active');
  });
}

function accept(toPos, toSlot) {
  if (!fromCeldaEl) return false;

  switch (fromPos) {
    case POS.VISTA: {
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
      if (!fromCardId) return false;
      switch (toPos) {
        case POS.HUECO:
          return canDropInHueco(fromCardId, toSlot);
        default:
          return false;
      }
    }
    case POS.HUECO: {
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

function drop(toPos, toSlot) {
  fireEV(EV.JUGADA_BEFORE);
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
}
