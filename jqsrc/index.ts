import { initNewGame } from './init.js';
import { initActions } from './actions.js';

export const main = () => {
  initNewGame();
  initActions();
  $('#newGame').on('click', initNewGame);
  $('#raise').on('click', () => {
    alert('click on raise');
  });
};
