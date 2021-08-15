import { initBoard } from './render.js';
import { initActions, startNewGame } from './actions.js';
import { initDrag } from './dragdrop.js';

export const main = () => {
  initBoard();
  initActions();
  initDrag();

  startNewGame();
};
