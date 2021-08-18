import {
  REVERSO,
  HUECO,
  POS,
  SEL,
  datos,
  tCardId,
  numPilas,
  numHuecos,
} from './datos.js';

import { enableDraggable } from './dragdrop.js';

let topMazo: tCardId;
let topVista: tCardId;
const topPilas: tCardId[] = Array(numPilas);
const topHuecos: tCardId[] = Array(numHuecos);

export const imgSrc = (cardId: tCardId): string => `assets/cards/${cardId}.svg`;

export const cardImg = (cardId: tCardId, className: string = ''): string =>
  `<img  draggable="false" class="card ${className}" src="${imgSrc(
    cardId
  )}" data-cardid="${cardId}" />`;

const createContainer = (
  name: string,
  draggable?: boolean,
  droppable?: boolean
) =>
  $(`
<div class="celda ${name} ${droppable ? 'droppable' : ''}">
  <div class="cardContainer">
  ${cardImg(REVERSO, draggable ? 'draggable' : '')}
  </div>
</div>
`);

const setCardId = (el: JQuery, cardId: tCardId) =>
  el.find('img').prop('src', imgSrc(cardId)).data('cardid', cardId);

export const initBoard = () => {
  const boardEl = $('.grid');

  boardEl.append(createContainer(POS.MAZO));
  boardEl.append(createContainer(POS.VISTA, true));
  boardEl.append($('<div class="celda"></div>'));

  for (let slot = 0; slot < numPilas; slot++) {
    boardEl.append(createContainer(POS.PILA, true, true));
  }

  for (let slot = 0; slot < numHuecos; slot++) {
    boardEl.append(createContainer(POS.HUECO, true, true));
  }
};

export const renderMazo = () => {
  const cardId = datos.mazo.length ? REVERSO : HUECO;
  if (cardId === topMazo) return;
  topMazo = cardId;
  setCardId($(SEL.MAZO), cardId);
};

export const renderVista = () => {
  const cardId = datos.vista[0] || HUECO;
  if (cardId === topVista) return;
  topVista = cardId;
  const vistaEl = $(SEL.VISTA);
  setCardId(vistaEl, cardId);
  enableDraggable(vistaEl, cardId !== HUECO);
};

export const renderPila = (slot: number) => {
  const cardId = datos.pilas[slot][0] || HUECO;
  if (cardId === topPilas[slot]) return;
  topPilas[slot] = cardId;
  const pilaEl = $(SEL.PILAS).eq(slot);
  setCardId(pilaEl, cardId);
  enableDraggable(pilaEl, cardId !== HUECO);
};

export const renderPilas = () => $(SEL.PILAS).each(renderPila);

const renderHuecoStack = (
  cardIds: tCardId[],
  firstShown: number,
  index: number
): string => {
  const [cardId, ...rest] = cardIds;
  const isVisible = index >= firstShown;

  return rest.length
    ? `
    <div 
      ${isVisible ? 'class="draggable"' : ''}
      data-index="${rest.length}"
    >
      <div class="short">${cardImg(isVisible ? cardId : REVERSO)}</div>
      ${renderHuecoStack(rest, firstShown, index + 1)}
    </div>`
    : cardImg(cardId, 'draggable');
};

const renderOneHueco = (h: JQuery, slot: number) => {
  const cardIds = datos.huecos[slot];
  const cardId = cardIds[0];
  if (cardId === topHuecos[slot]) return;
  topHuecos[slot] = cardId;

  h.find('.cardContainer').html(
    cardIds.length
      ? // reverse the cards so the last is placed first, at the bottom
        renderHuecoStack(cardIds.slice(0).reverse(), datos.firstShown[slot], 0)
      : cardImg(HUECO)
  );
  h.find(SEL.DRAGGABLE).draggable({ helper: 'clone' });
  enableDraggable(h, cardIds.length > 0);
};

export const renderHuecos = () => {
  $(SEL.HUECOS).each(function (slot) {
    renderOneHueco($(this), slot);
  });
};

export const renderHueco = (slot: number) => {
  renderOneHueco($(SEL.HUECOS).eq(slot), slot);
};

export const renderAll = () => {
  renderMazo();
  renderVista();
  renderHuecos();
  renderPilas();
};
