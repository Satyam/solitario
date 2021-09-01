import { datos, tDatos, EV } from './datos.js';

const undoStack: string[] = [];
let previous = -1;

export const initUndo = () => {
  $(document).on(EV.NEWGAME_BEFORE, resetUndo).on(EV.JUGADA_BEFORE, pushState);
  $('#undo').on('click', undo);
  $('#redo').on('click', redo);
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
  Object.assign(datos, JSON.parse(undoStack[previous]) as tDatos);
  previous -= 1;
  setButtons();
  $(document).trigger(EV.UNDO_AFTER);
};

const redo = () => {
  if (previous >= undoStack.length - 2) return;
  previous += 1;
  Object.assign(datos, JSON.parse(undoStack[previous + 1]) as tDatos);
  setButtons();
  $(document).trigger(EV.REDO_AFTER);
};

const setButtons = () => {
  $('#undo').prop('disabled', previous < 0);
  $('#redo').prop('disabled', previous >= undoStack.length - 2);
};
