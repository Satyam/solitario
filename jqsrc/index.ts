import { initBoard } from './render.js';
import { initActions } from './actions.js';
import { initDrag } from './dragdrop.js';
import { initUndo } from './undoStack.js';
import { initStats } from './stats.js';
import { EV } from './datos.js';

export const main = () => {
  initBoard();
  initActions();
  initDrag();
  initUndo();
  initStats();

  $(document).trigger(EV.NEWGAME);
};
