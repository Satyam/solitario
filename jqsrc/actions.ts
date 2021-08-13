import { SEL, datos, tCardId, baraja, numHuecos, numPilas } from './datos.js';
import { renderAll, renderMazo, renderVista } from './render.js';
import { initUndo, pushState } from './undoStack.js';
import { shuffle } from './utils.js';

export const initActions = () => {
  // Buttons
  $('#newGame').on('click', startNewGame);
  $('#raise').on('click', () => {
    alert('click on raise');
  });

  // cards
  $(SEL.MAZO).on('click', dealCard);
};

export const startNewGame = (): void => {
  datos.vista = [];
  for (let slot = 0; slot < numPilas; slot++) datos.pilas[slot] = [];

  const cardIds = shuffle<tCardId[]>(Object.keys(baraja) as tCardId[]);

  for (let slot = 0; slot < numHuecos; slot++) {
    datos.huecos[slot] = cardIds.splice(0, slot + 1);
    datos.firstShown[slot] = slot;
  }

  // Place the remaining cards in the mazo.
  datos.mazo = cardIds;

  renderAll();
  initUndo();
};

const dealCard = (ev: JQuery.Event) => {
  pushState();
  datos.vista.unshift(datos.mazo.shift());
  renderMazo();
  renderVista();
};
