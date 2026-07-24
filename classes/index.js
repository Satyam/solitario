import { Board } from './board.js';

export const main = () => {
  globalThis.board = new Board(document.getElementById('grid'));
  board.startGame();
};

/*
import { initBoard } from './render.js';
import { initActions } from './actions.js';
import { initDrag } from './dragdrop.js';
import { initUndo } from './undoStack.js';
import { initStats } from './stats.js';
import { initGuess } from './guess.js';
import { EV } from './datos.js';
import { fireEV } from './utils.js';

import { test } from './classes/test.js';

export const main = () => {
  initBoard();
  initActions();
  initDrag();
  initUndo();
  initStats();
  initGuess();
  test();

  fireEV(EV.NEWGAME_BEFORE);
};
*/
