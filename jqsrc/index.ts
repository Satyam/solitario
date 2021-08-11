import { initNewGame } from './init.js';

export const main = () => {
  initNewGame();
  $('#newGame')
    .attr({
      title: 'New Game',
    })
    .on('click', () => {
      alert('click on new game');
    });
  $('#undo')
    .attr({
      title: 'Undo',
      disabled: true,
    })
    .on('click', () => {
      alert('click on undo');
    });
  $('#redo')
    .attr({
      title: 'Redo',
      disabled: true,
    })
    .on('click', () => {
      alert('click on redo');
    });
  $('#raise')
    .attr({
      title: 'Raise',
      disabled: true,
    })
    .on('click', () => {
      alert('click on raise');
    });
};
