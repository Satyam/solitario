import { SEL, datos } from './datos.js';
import { renderMazo, renderVista } from './render.js';
import { push } from './undoStack.js';

export const initActions = () => {
  $(SEL.MAZO).on('click', dealCard);
};

const dealCard = (ev: JQuery.Event) => {
  push();
  datos.vista.unshift(datos.mazo.shift());
  renderMazo();
  renderVista();
};
