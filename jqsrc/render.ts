import {
  REVERSO,
  HUECO,
  SEL,
  datos,
  tCardId,
  numPilas,
  numHuecos,
} from './datos.js';
import { imgSrc, cardImg } from './utils.js';
import { enableDraggable } from './dragdrop.js';

let topMazo: tCardId;
let topVista: tCardId;
const topPilas: tCardId[] = Array(numPilas);
const topHuecos: tCardId[] = Array(numHuecos);

const setCardId = (el: JQuery, cardId: tCardId) =>
  el.find('img').prop('src', imgSrc(cardId));

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
    ? `${
        isVisible
          ? `<div class="draggable" data-index="${
              rest.length
            }"><div class="short">${cardImg(cardId)}</div>`
          : `<div class="short">${cardImg(REVERSO)}</div>`
      }${renderHuecoStack(rest, firstShown, index + 1)}</div>`
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
      : cardImg(HUECO, 'draggable')
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
