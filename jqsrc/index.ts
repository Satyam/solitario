import { initActions, startNewGame } from './actions.js';
import { initDrag } from './dragdrop.js';

export const main = () => {
  initActions();
  initDrag();

  startNewGame();
};
