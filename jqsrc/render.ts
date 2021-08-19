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
  )}" />`;

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
const emptyHuecoStackPosition = `
<div 
  data-start="0"
  data-cardid="${HUECO}"
>
  <div class="clipper">
    ${cardImg(HUECO)}
  </div>
</div>
`;
const emptyHuecoContainer = `
<div class="celda ${POS.HUECO} droppable">
  <div class="cardContainer">
    ${emptyHuecoStackPosition}  
  </div>
</div>
`;

const setCardId = (el: JQuery, cardId: tCardId) =>
  el.find('img').first().prop('src', imgSrc(cardId));

export const initBoard = () => {
  const boardEl = $('.grid');

  boardEl.append(createContainer(POS.MAZO));
  boardEl.append(createContainer(POS.VISTA, true));
  boardEl.append($('<div class="celda"></div>'));

  for (let slot = 0; slot < numPilas; slot++) {
    boardEl.append(createContainer(POS.PILA, true, true));
  }

  for (let slot = 0; slot < numHuecos; slot++) {
    boardEl.append(emptyHuecoContainer);
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

const newRenderHuecoStack = (
  el: JQuery,
  cardIds: tCardId[],
  firstShown: number,
  stackLength: number
) => {
  const [cardId, ...rest] = cardIds;
  const isVisible = stackLength - rest.length > firstShown;
  const isLast = rest.length === 0;
  // Ajusto la carta existente
  el.data({
    start: rest.length,
    cardid: cardId || HUECO,
  });
  el.toggleClass('draggable', isVisible);
  setCardId(el, isVisible ? cardId || HUECO : REVERSO);
  el.find('.clipper').toggleClass('short', !isLast);
  // ajuste hecho

  if (rest.length) {
    const next = el.find('div[data-start]').first();
    if (next.data()) {
      newRenderHuecoStack(next, rest, firstShown, stackLength);
    } else {
      // Append an empty container for the rest
      el.append(emptyHuecoStackPosition);
      // this card needs to be redone once the container is in place
      newRenderHuecoStack(el, cardIds, firstShown, stackLength);
    }
  } else {
    const sobra = el.children().eq(1).get(0);
    if (sobra) {
      el.children().last().remove();
    }
  }
};

const renderOneHueco = (h: JQuery, slot: number) => {
  const cardIds = datos.huecos[slot];
  const cardId = cardIds[0];
  if (cardId === topHuecos[slot]) return;
  topHuecos[slot] = cardId;

  newRenderHuecoStack(
    h.find('div[data-start]').first(),
    cardIds.slice(0).reverse(),
    datos.firstShown[slot],
    cardIds.length
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
