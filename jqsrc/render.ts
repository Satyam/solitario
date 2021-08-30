import {
  REVERSO,
  HUECO,
  POS,
  SEL,
  EV,
  datos,
  tCardId,
  numPilas,
  numHuecos,
} from './datos.js';

import { enableDraggable, setDraggable } from './dragdrop.js';

let topMazo: tCardId;
let topVista: tCardId;
const topPilas: tCardId[] = Array(numPilas);
const topHuecos: tCardId[] = Array(numHuecos);

const s = getComputedStyle(document.documentElement);
const cardHeight = parseInt(s.getPropertyValue('--cardHeight'), 10);
const shortCardHeight = parseInt(s.getPropertyValue('--shortCardHeight'), 10);

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
  <div class="cardContainer single">
    ${cardImg(HUECO, 'behind')}
    ${cardImg(REVERSO, `top ${draggable ? 'draggable' : ''}`)}
  </div>
</div>
`);

const emptyHuecoStackPosition = `
<div 
  class="stack"
  data-start="0"
  data-cardid="${HUECO}"
>
  ${cardImg(HUECO)}
</div>
`;

const emptyHuecoContainer = `
<div class="celda ${POS.HUECO} droppable">
  <div class="cardContainer">
    ${emptyHuecoStackPosition}  
  </div>
</div>
`;

const setCardId = (el: JQuery, cardId: tCardId) => {
  el.find(SEL.IMG).add(el.filter(SEL.IMG)).prop('src', imgSrc(cardId));
};

export const initBoard = () => {
  const boardEl = $('.grid');

  boardEl.append(createContainer(POS.MAZO));
  boardEl.append(createContainer(POS.VISTA, true));
  boardEl.append($('<div class="celda guess"></div>'));

  for (let slot = 0; slot < numPilas; slot++) {
    boardEl.append(createContainer(POS.PILA, true, true));
  }

  for (let slot = 0; slot < numHuecos; slot++) {
    boardEl.append(emptyHuecoContainer);
  }

  $(document).on(EV.NEWGAME_AFTER, renderAll);
};

export const renderMazo = () => {
  const cardId = datos.mazo.length ? REVERSO : HUECO;
  if (cardId === topMazo) return;
  topMazo = cardId;
  setCardId($(SEL.MAZO).find(SEL.TOP), cardId);
};

const renderVoP = (
  containerEl: JQuery,
  cardIdTop: tCardId = HUECO,
  cardIdNext: tCardId = HUECO
) => {
  const imgTop = containerEl.find(SEL.TOP);
  const imgBehind = containerEl.find('.behind');

  if (imgTop.length) {
    setCardId(imgTop, cardIdTop);
  } else {
    setDraggable(
      $(cardImg(cardIdTop, 'draggable top')).appendTo(containerEl.children())
    );
    enableDraggable(imgTop, cardIdTop !== HUECO);
  }
  setCardId(imgBehind, cardIdNext);
};

export const renderVista = () => {
  const cardId = datos.vista[0] || HUECO;
  if (cardId === topVista) return;
  topVista = cardId;
  renderVoP($(SEL.VISTA), cardId, datos.vista[1]);
};

export const renderPila = (slot: number) => {
  const cardId = datos.pilas[slot][0] || HUECO;
  if (cardId === topPilas[slot]) return;
  topPilas[slot] = cardId;
  renderVoP($(SEL.PILAS).eq(slot), cardId, datos.pilas[slot][1]);
};

export const renderPilas = () => $(SEL.PILAS).each(renderPila);

const renderHuecoStack = (
  el: JQuery,
  cardIds: tCardId[],
  firstShown: number,
  stackLength: number
) => {
  const [cardId, ...rest] = cardIds;
  const index = stackLength - rest.length;
  const isVisible = index > firstShown;

  // Ajusto la carta existente
  el.data({
    start: rest.length,
    cardid: cardId || HUECO,
  })
    .toggleClass('draggable', isVisible)
    .toggleClass('offset', index > 1);
  if (el.find(SEL.IMG).length === 0) {
    el.append(cardImg(HUECO));
  }
  setCardId(el, isVisible ? cardId || HUECO : REVERSO);
  // ajuste hecho

  if (rest.length) {
    let next = el.find(SEL.STACK).first();
    // If there is no place to render the rest, create a stack position and carry on
    if (next.length === 0) {
      next = $(emptyHuecoStackPosition).appendTo(el);
    }
    renderHuecoStack(next, rest, firstShown, stackLength);
  } else {
    // remove further stack positions.
    el.find(SEL.STACK).remove();
  }
};

const renderOneHueco = (h: JQuery, slot: number) => {
  const cardIds = datos.huecos[slot];
  const cardId = cardIds[0];
  if (cardId === topHuecos[slot]) return;
  topHuecos[slot] = cardId;

  let stack = h.find(SEL.STACK);
  if (stack.length === 0) {
    stack = $(emptyHuecoStackPosition).appendTo(h.children());
  }
  renderHuecoStack(
    stack.first(),
    cardIds.slice(0).reverse(),
    datos.firstShown[slot],
    cardIds.length
  );
  h.find('.cardContainer').css({
    height: ((cardIds.length || 1) - 1) * shortCardHeight + cardHeight,
  });
  setDraggable(h.find(SEL.DRAGGABLE));
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
