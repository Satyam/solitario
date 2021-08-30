import { datos, tDatos, EV } from './datos.js';
import { renderAll } from './render.js';
import { incUndos, incRedos } from './stats.js';

const undoStack: string[] = [];
let previous = -1;

export const initUndo = () => {
  $(document).on(EV.NEWGAME_BEFORE, resetUndo).on(EV.JUGADA_BEFORE, pushState);
};

const resetUndo = () => {
  undoStack.length = 0;
  previous = -1;
  setButtons();
  $('#undo').on('click', undo);
  $('#redo').on('click', redo);
};

const r = (msg: string) => {
  // console.log(
  //   msg,
  //   previous,
  //   undoStack.length,
  //   undoStack.map((e) => {
  //     const x = JSON.parse(e);
  //     return [x.mazo[0], x.vista[0]];
  //   })
  // );
};

const pushState = () => {
  r('- push');
  previous += 1;
  undoStack.length = previous;
  undoStack[previous] = JSON.stringify(datos);
  setButtons();
  r('+ push');
};

const undo = () => {
  r('- undo');
  if (previous < 0) return;
  incUndos();
  undoStack[previous + 1] = JSON.stringify(datos);
  Object.assign(datos, JSON.parse(undoStack[previous]) as tDatos);
  previous -= 1;
  renderAll();
  setButtons();
  r('+ undo');
};

const redo = () => {
  r('- redo');

  if (previous >= undoStack.length - 2) return;
  incRedos();
  previous += 1;
  Object.assign(datos, JSON.parse(undoStack[previous + 1]) as tDatos);
  renderAll();
  setButtons();
  r('+ redo');
};

export const setButtons = () => {
  $('#undo').prop('disabled', previous < 0);
  $('#redo').prop('disabled', previous >= undoStack.length - 2);
};
