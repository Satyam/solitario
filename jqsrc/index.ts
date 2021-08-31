import { initBoard } from './render.js';
import { initActions } from './actions.js';
import { initDrag } from './dragdrop.js';
import { initUndo } from './undoStack.js';
import { initStats } from './stats.js';
import { initGuess } from './guess.js';
import { EV } from './datos.js';

export const main = () => {
  initBoard();
  initActions();
  initDrag();
  initUndo();
  initStats();
  initGuess();

  $(document).trigger(EV.NEWGAME_BEFORE);
};
