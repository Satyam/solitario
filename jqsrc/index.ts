import { initNewGame } from './init.js';

export const main = () => {
  initNewGame();
  $('#newGame').on('click', initNewGame);
  $('#raise').on('click', () => {
    alert('click on raise');
  });
};
