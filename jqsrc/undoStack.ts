import { datos, tDatos } from './datos.js';
import { renderAll } from './render.js';

const undoStack: string[] = [];
let current = -1;

export const initUndo = () => {
  undoStack.length = 0;
  current = -1;
  setButtons();
  $('#undo').on('click', undo);
  $('#redo').on('click', redo);
};

export const push = () => {
  current += 1;
  undoStack.length = current;
  undoStack[current] = JSON.stringify(datos);
  setButtons();
};

const undo = () => {
  if (current < 0) return;
  Object.assign(datos, JSON.parse(undoStack[current]) as tDatos);
  current -= 1;
  renderAll();
  setButtons();
};

const redo = () => {
  if (current >= undoStack.length) return;
  current += 1;
  Object.assign(datos, JSON.parse(undoStack[current]) as tDatos);
  renderAll();
  setButtons();
};

export const setButtons = () => {
  $('#undo').prop('disabled', current < 0);
  $('#redo').prop('disabled', current >= undoStack.length - 1);
};
