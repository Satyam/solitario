import { datos, EV } from './datos.js';
import { onEV, fireEV } from './utils.js';

const undoStack = [];
let previous = -1;
export const initUndo = () => {
  onEV(EV.NEWGAME_BEFORE, resetUndo);
  onEV(EV.JUGADA_BEFORE, pushState);
  document.getElementById('undo').addEventListener('click', undo);
  document.getElementById('redo').addEventListener('click', redo);
};
const resetUndo = () => {
  undoStack.length = 0;
  previous = -1;
  setButtons();
};
const pushState = () => {
  previous += 1;
  undoStack.length = previous;
  undoStack[previous] = JSON.stringify(datos);
  setButtons();
};
const undo = () => {
  if (previous < 0) return;
  undoStack[previous + 1] = JSON.stringify(datos);
  Object.assign(datos, JSON.parse(undoStack[previous]));
  previous -= 1;
  setButtons();
  fireEV(EV.UNDO_AFTER);
};
const redo = () => {
  if (previous >= undoStack.length - 2) return;
  previous += 1;
  Object.assign(datos, JSON.parse(undoStack[previous + 1]));
  setButtons();
  fireEV(EV.REDO_AFTER);
};
const setButtons = () => {
  document.getElementById('undo').toggleAttribute('disabled', previous < 0);
  document
    .getElementById('redo')
    .toggleAttribute('disabled', previous >= undoStack.length - 2);
};
