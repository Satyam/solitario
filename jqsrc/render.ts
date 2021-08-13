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
  setCardId($(SEL.VISTA), cardId);
};

export const renderPila = (slot: number) => {
  const cardId = datos.pilas[slot][0] || HUECO;
  if (cardId === topPilas[slot]) return;
  topPilas[slot] = cardId;
  setCardId($(SEL.PILAS), cardId);
};

export const renderPilas = () => $(SEL.PILAS).each(renderPila);

const renderHuecoStack = (
  cardIds: tCardId[],
  firstShown: number,
  index: number
): string => {
  const [cardId, ...rest] = cardIds;

  return rest.length
    ? `<div><div class="short">${cardImg(
        index < firstShown ? REVERSO : cardId
      )}</div>${renderHuecoStack(rest, firstShown, index + 1)}</div>`
    : cardImg(cardId);
};

const renderOneHueco = (h: JQuery, slot: number) => {
  const cardIds = datos.huecos[slot];
  const cardId = cardIds[0];
  if (cardId === topHuecos[slot]) return;
  topHuecos[slot] = cardId;
  h.html(
    cardIds.length
      ? renderHuecoStack(cardIds, datos.firstShown[slot], 0)
      : cardImg(HUECO)
  );
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
